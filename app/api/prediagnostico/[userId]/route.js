import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import PreDiagnostico from "@/models/Prediagnostico";

// POST: crear un nuevo PreDiagnostico
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const nuevoPrediagnostico = await PreDiagnostico.create({
      userId: body.userId,
      preguntaObstaculo: body.preguntaObstaculo,
      preguntaIntentos: body.preguntaIntentos,
      preguntaSeñales: body.preguntaSeñales,
      preguntasKpis: body.preguntasKpis,
      preguntaTipoAyuda: body.preguntaTipoAyuda,
      preguntaInversion: body.preguntaInversion
    });

    return NextResponse.json(nuevoPrediagnostico, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear PreDiagnostico" }, { status: 500 });
  }
}

// GET: obtener todos los PreDiagnosticos de un usuario
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { userId } = params;

    const prediagnosticos = await PreDiagnostico.find({ userId });

    return NextResponse.json(prediagnosticos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener PreDiagnosticos" }, { status: 500 });
  }
}
