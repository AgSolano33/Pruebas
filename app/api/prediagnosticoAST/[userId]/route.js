// app/api/prediagnostico/[userId]/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import PrediagnosticoAST from "@/models/PreDiagnosticoAST";

export async function POST(request, { params }) {
  try {
    await connectToDatabase();

    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "Falta userId" }, { status: 400 });
    }

    // El body puede venir del asistente o de Postman
    const body = await request.json();

    const nuevoPrediagnostico = await PrediagnosticoAST.create({
      userId,
      threadId: body.threadId || null,
      runId: body.runId || null,
      resultado: body.resultado, // ← aquí va el JSON arbitrario del asistente
    });

    return NextResponse.json(nuevoPrediagnostico, { status: 201 });
  } catch (error) {
    console.error("Error en POST /prediagnostico:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { userId } = params;
    const docs = await PrediagnosticoAST.find({ userId });

    return NextResponse.json(docs, { status: 200 });
  } catch (error) {
    console.error("Error en GET /prediagnostico:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
