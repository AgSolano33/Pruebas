export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import ProyectoPreAST from "@/models/proyectosPreAST";

// ---------- helpers ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function openaiFetch(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (_) {}
  if (!res.ok) {
    throw new Error(JSON.stringify({ url, status: res.status, statusText: res.statusText, body: json || text || null }));
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
      try { return await openaiFetch(url, { method: "GET", headers }); }
      catch (e) {
        lastErr = e;
        try {
          const parsed = JSON.parse(e.message);
          if (parsed?.status >= 500) { await sleep(500 * (attempt + 1)); continue; }
          else { throw e; }
        } catch { await sleep(500 * (attempt + 1)); }
      }
    }
  }
  throw lastErr || new Error("No se pudieron listar los mensajes.");
}

function to3Propuestas(raw) {
  const arr = Array.isArray(raw?.Propuestas) ? raw.Propuestas : [];
  return arr
    .slice(0, 3)
    .map((p, i) => ({
      nombreProyecto: String(p?.nombreProyecto || `Proyecto ${i + 1}`).trim(),
      resumenProyecto: String(p?.resumenProyecto || "").trim(),
      descripcionProyecto: String(p?.descripcionProyecto || "").trim(),
      raw: p,
    }))
    .filter(x => x.nombreProyecto && x.resumenProyecto && x.descripcionProyecto);
}

// ========== POST: recibe TODO el JSON, lo manda al assistant, guarda 3 proyectos ==========
export async function POST(req) {
  try {
    const apiKey = (process.env.OPENAI_API_KEY || "").trim();
    const assistantId = (process.env.ASSISTANT_ID_PROYECTOS_PREAST || "").trim();
    if (!apiKey || !apiKey.startsWith("sk-")) {
      return NextResponse.json({ error: "OPENAI_API_KEY ausente o inválido" }, { status: 500 });
    }
    if (!/^asst_[A-Za-z0-9]+$/.test(assistantId)) {
      return NextResponse.json({ error: "ASSISTANT_ID_PROYECTOS_PREAST inválido (debe iniciar con asst_)" }, { status: 500 });
    }

    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
    }

    const userId = String(payload.userId || "").trim();
    const prediagnosticoId = String(payload.prediagnosticoId || "").trim();
    if (!userId || !prediagnosticoId) {
      return NextResponse.json({ error: "userId y prediagnosticoId son requeridos en el JSON" }, { status: 400 });
    }

    // Mensaje: mandamos TAL CUAL tu objeto (sin consultar DB)
    const userMessage =
`
${JSON.stringify(payload)}
`;

    // Llamada al Assistant
    const base = "https://api.openai.com/v1";
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
    };

    const thread = await openaiFetch(`${base}/threads`, { method: "POST", headers, body: JSON.stringify({}) });

    await openaiFetch(`${base}/threads/${thread.id}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({ role: "user", content: [{ type: "text", text: userMessage }] }),
    });

    let run = await openaiFetch(`${base}/threads/${thread.id}/runs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        assistant_id: assistantId,
        response_format: { type: "json_object" } // <- si tu cuenta lo permite
      }),
    });

    // Poll con manejo de requires_action y timeout amplio
    const deadline = Date.now() + 240_000; // 4 min
    const terminal = ["completed", "failed", "cancelled", "expired"];

    while (true) {
      if (Date.now() > deadline) {
        return NextResponse.json({ error: "Timeout esperando respuesta del asistente", threadId: thread.id, runId: run.id }, { status: 504 });
      }

      if (run.status === "requires_action") {
        const toolCalls = run?.required_action?.submit_tool_outputs?.tool_calls || [];
        const tool_outputs = toolCalls.map(tc => ({
          tool_call_id: tc.id,
          output: JSON.stringify({ error: "Tool no implementada en este endpoint" }),
        }));
        run = await openaiFetch(`${base}/threads/${thread.id}/runs/${run.id}/submit_tool_outputs`, {
          method: "POST",
          headers,
          body: JSON.stringify({ tool_outputs }),
        });
        await sleep(800);
        run = await openaiFetch(`${base}/threads/${thread.id}/runs/${run.id}`, { method: "GET", headers });
        continue;
      }

      if (terminal.includes(run.status)) break;

      await sleep(900);
      run = await openaiFetch(`${base}/threads/${thread.id}/runs/${run.id}`, { method: "GET", headers });
    }

    if (run.status !== "completed") {
      return NextResponse.json(
        { error: `Run no completado. Estado: ${run.status}`, threadId: thread.id, runId: run.id, last_error: run.last_error || null },
        { status: 500 }
      );
    }

    // Obtener respuesta final y parsear JSON
    const page = await listMessagesResilient(base, thread.id, headers);
    const assistantMsg = (page?.data || []).find((m) => m.role === "assistant");
    if (!assistantMsg) {
      return NextResponse.json({ error: "Sin respuesta del asistente", threadId: thread.id, runId: run.id }, { status: 500 });
    }
    const textPart = (assistantMsg.content || []).find((c) => c.type === "text");
    let rawOutput = (textPart?.text?.value || "").trim();
    if (rawOutput.startsWith("```")) {
      rawOutput = rawOutput.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    }

    let outputJSON;
    try { outputJSON = JSON.parse(rawOutput); }
    catch {
      return NextResponse.json({ error: "La respuesta del asistente no es JSON válido", rawOutput, threadId: thread.id, runId: run.id }, { status: 500 });
    }

    const top3 = to3Propuestas(outputJSON);
    if (top3.length < 1) {
      return NextResponse.json({ error: "El asistente no devolvió Propuestas válidas" }, { status: 500 });
    }

    // Guardar EXACTAMENTE 3: primero borramos previos de ese prediagnóstico/usuario
    await connectToDatabase();
    await ProyectoPreAST.deleteMany({ userId, prediagnosticoId });

    // Insertar (con índice único userId+prediagnosticoId+nombreProyecto en tu modelo)
    let inserted;
    try {
      inserted = await ProyectoPreAST.insertMany(
        top3.map(p => ({ userId, prediagnosticoId, ...p })),
        { ordered: false }
      );
    } catch {
      // fallback a upsert por si chocan nombres
      inserted = [];
      for (const d of top3) {
        const up = await ProyectoPreAST.findOneAndUpdate(
          { userId, prediagnosticoId, nombreProyecto: d.nombreProyecto },
          { $set: { ...d, userId, prediagnosticoId } },
          { upsert: true, new: true }
        );
        inserted.push(up);
      }
    }

    return NextResponse.json({
      ok: true,
      threadId: thread.id,
      runId: run.id,
      savedCount: inserted.length,
      proyectos: inserted.map(d => ({
        _id: d._id,
        userId: d.userId,
        prediagnosticoId: d.prediagnosticoId,
        nombreProyecto: d.nombreProyecto,
        resumenProyecto: d.resumenProyecto,
        descripcionProyecto: d.descripcionProyecto,
        createdAt: d.createdAt,
      })),
    });

  } catch (err) {
    let message = err?.message || "Error desconocido";
    try { return NextResponse.json({ error: JSON.parse(message) }, { status: 500 }); }
    catch { return NextResponse.json({ error: message }, { status: 500 }); }
  }
}

// ========== GET: trae lo guardado para mostrar en el front ==========
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const prediagnosticoId = String(searchParams.get("prediagnosticoId") || "").trim();
    const userId = String(searchParams.get("userId") || "").trim();

    if (!prediagnosticoId || !userId) {
      return NextResponse.json({ error: "userId y prediagnosticoId son requeridos" }, { status: 400 });
    }

    await connectToDatabase();
    const items = await ProyectoPreAST.find({ userId, prediagnosticoId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ ok: true, count: items.length, proyectos: items });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Error desconocido" }, { status: 500 });
  }
}
