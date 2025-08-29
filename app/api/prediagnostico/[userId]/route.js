import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import Prediagnostico from "@/models/Prediagnostico";

export async function POST(request, { params }) {
  try {
    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "Falta userId en la URL" }, { status: 400 });
    }
    console.log(params)
    await connectToDatabase();
    const body = await request.json();

    const nuevoPrediagnostico = await Prediagnostico.create({
      userId,
      preguntaObstaculo: body.preguntaObstaculo,
      preguntaIntentos: body.preguntaIntentos,
      preguntaSeñales: body.preguntaSeñales,
      preguntasKpis: body.preguntasKpis,
      preguntaTipoAyuda: body.preguntaTipoAyuda,
      preguntaInversion: body.preguntaInversion
    });

    return NextResponse.json({ success: true, data: nuevoPrediagnostico }, { status: 201 });

  } catch (error) {
    console.error("Error POST /prediagnostico:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(_req, { params }) {
  try {
    await connectToDatabase();
    const { userId } = params;
    if (!userId) {
      return NextResponse.json({ error: "ID de usuario no proporcionado" }, { status: 400 });
    }

    const docs = await Prediagnostico.find({ userId }).sort({ createdAt: -1 });
    // 👇 Devolver SIEMPRE un arreglo
    return NextResponse.json(docs, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al obtener prediagnósticos" }, { status: 500 });
  }
}