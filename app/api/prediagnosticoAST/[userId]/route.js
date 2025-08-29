import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import PreDiagnosticoAST from "@/models/PreDiagnosticoAST"; 

export async function POST(request, { params }) {
  try {
    await connectToDatabase();

    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "Falta userId" }, { status: 400 });
    }

    const body = await request.json();

    const nuevo = await PreDiagnosticoAST.create({
      userId,
      prediagnosticoId: body.prediagnosticoId,
      threadId: body.threadId || null,
      runId: body.runId || null,
      resultado: body.resultado, // JSON del asistente
    });

    return NextResponse.json(nuevo, { status: 201 });
  } catch (error) {
    console.error("Error en POST /prediagnostico:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}


export async function GET(_req, { params }) {
  try {
    await connectToDatabase();

    const { userId } = params; // 👈 no params.id
    const docs = await PreDiagnosticoAST.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(docs, { status: 200 });
  } catch (e) {
    console.error("Error en GET /prediagnostico:", e);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}