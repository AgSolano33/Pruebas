// Fuerza Node.js runtime (no Edge) y evita caché
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

// ---------- Utils ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function openaiFetch(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (_) {}
  if (!res.ok) {
    throw new Error(
      JSON.stringify({
        url,
        status: res.status,
        statusText: res.statusText,
        body: json || text || null,
      })
    );
  }
  return json;
}

async function listMessagesResilient(base, threadId, headers) {
  const variants = [
    `${base}/threads/${threadId}/messages`,
    `${base}/threads/${threadId}/messages?order=desc`,
    `${base}/threads/${threadId}/messages?limit=50&order=desc`,
  ];
  let lastErr = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const url of variants) {
      try {
        return await openaiFetch(url, { method: "GET", headers });
      } catch (e) {
        lastErr = e;
        try {
          const parsed = JSON.parse(e.message);
          if (parsed?.status && parsed.status >= 500) {
            await sleep(500 * (attempt + 1));
            continue;
          } else {
            throw e;
          }
        } catch {
          await sleep(500 * (attempt + 1));
        }
      }
    }
  }
  throw lastErr || new Error("No se pudieron listar los mensajes.");
}

// ---------- TOOL HANDLER ----------
function executeToolCall(toolCall) {
  const fn = toolCall?.function;
  const name = fn?.name;
  let args = {};
  try {
    args = fn?.arguments ? JSON.parse(fn.arguments) : {};
  } catch {
    args = { _raw: fn?.arguments || "" };
  }

  switch (name) {
    case "emit_prediagnostico":
      // Si necesitas validar/normalizar el JSON, hazlo aquí antes de devolverlo
      return JSON.stringify(args);

    default:
      return JSON.stringify({ error: `Tool no implementada: ${name}` });
  }
}

// ---------- Handler principal ----------
export async function POST(req) {
  try {
    const apiKey = (process.env.OPENAI_API_KEY || "").trim();
    const assistantId = (process.env.ASSISTANT_ID_PREDIAGNOSTICO_GENERAL || "").trim();

    if (!apiKey || !apiKey.startsWith("sk-")) {
      return NextResponse.json({ error: "OPENAI_API_KEY ausente o inválido" }, { status: 500 });
    }
    if (!/^asst_[A-Za-z0-9]+$/.test(assistantId)) {
      return NextResponse.json({ error: "ASSISTANT_ID_PREDIAGNOSTICO_GENERAL inválido (debe iniciar con asst_)" }, { status: 500 });
    }

    const body = await req.json().catch(() => null);
    if (!body?.infoEmpresa || !body?.prediagnostico) {
      return NextResponse.json({ error: "Se requieren infoEmpresa y prediagnostico" }, { status: 400 });
    }

    const userMessage =
`Aquí tienes los datos en JSON. Responde SOLO en formato JSON válido, SIN texto adicional.

infoEmpresa:
${JSON.stringify(body.infoEmpresa)}

prediagnostico:
${JSON.stringify(body.prediagnostico)}
`;

    const base = "https://api.openai.com/v1";
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2", // obligatorio para Assistants v2
    };

    // 1) Crear thread
    const thread = await openaiFetch(`${base}/threads`, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    });

    // 2) Agregar mensaje del usuario
    await openaiFetch(`${base}/threads/${thread.id}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        role: "user",
        content: [{ type: "text", text: userMessage }],
      }),
    });

    // 3) Crear run con TU assistant_id
    let run = await openaiFetch(`${base}/threads/${thread.id}/runs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ assistant_id: assistantId }),
    });

    // 4) Poll + ejecución de tools si se requiere
    const deadline = Date.now() + 90_000;
    const terminal = ["completed", "failed", "cancelled", "expired"];

    while (true) {
      if (Date.now() > deadline) {
        return NextResponse.json(
          { error: "Timeout esperando respuesta del asistente", threadId: thread.id, runId: run.id },
          { status: 504 }
        );
      }

      if (run.status === "requires_action") {
        const toolCalls = run?.required_action?.submit_tool_outputs?.tool_calls || [];

        const tool_outputs = toolCalls.map((tc) => ({
          tool_call_id: tc.id,
          output: executeToolCall(tc), // ← devuelve string con el JSON que espera la tool
        }));

        // Enviar outputs de las tools
        run = await openaiFetch(`${base}/threads/${thread.id}/runs/${run.id}/submit_tool_outputs`, {
          method: "POST",
          headers,
          body: JSON.stringify({ tool_outputs }),
        });

        // Poll nuevamente
        await sleep(800);
        run = await openaiFetch(`${base}/threads/${thread.id}/runs/${run.id}`, {
          method: "GET",
          headers,
        });
        continue;
      }

      if (terminal.includes(run.status)) break;

      await sleep(1000);
      run = await openaiFetch(`${base}/threads/${thread.id}/runs/${run.id}`, {
        method: "GET",
        headers,
      });
    }

    if (run.status !== "completed") {
      return NextResponse.json(
        { error: `Run no completado. Estado: ${run.status}`, threadId: thread.id, runId: run.id, last_error: run.last_error || null },
        { status: 500 }
      );
    }

    // 5) Listar mensajes de forma resiliente y extraer el JSON final
    const page = await listMessagesResilient(base, thread.id, headers);
    const assistantMsg = (page?.data || []).find((m) => m.role === "assistant");
    if (!assistantMsg) {
      return NextResponse.json({ error: "Sin respuesta del asistente", threadId: thread.id, runId: run.id }, { status: 500 });
    }

    const textPart = (assistantMsg.content || []).find((c) => c.type === "text");
    let rawOutput = (textPart?.text?.value || "").trim();

    if (rawOutput.startsWith("```")) {
      rawOutput = rawOutput
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();
    }

    let outputJSON;
    try {
      outputJSON = JSON.parse(rawOutput);
    } catch {
      return NextResponse.json(
        { error: "La respuesta del asistente no es JSON válido", rawOutput, threadId: thread.id, runId: run.id },
        { status: 500 }
      );
    }

    return NextResponse.json({
      threadId: thread.id,
      runId: run.id,
      output: outputJSON, // ← guarda esto en prediagnosticoAST
    });

  } catch (err) {
    let message = err?.message || "Error desconocido";
    try {
      const parsed = JSON.parse(message);
      return NextResponse.json({ error: parsed }, { status: 500 });
    } catch {
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
}