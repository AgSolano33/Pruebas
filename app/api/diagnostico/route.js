import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import DiagnosticoEmpresarial from "@/models/DiagnosticoEmpresarial";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const diagnostico = await DiagnosticoEmpresarial.create(data);
    return NextResponse.json(diagnostico, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el diagnóstico" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const diagnosticos = await DiagnosticoEmpresarial.find().sort({
      createdAt: -1,
    });
    return NextResponse.json(diagnosticos);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los diagnósticos" },
      { status: 500 }
    );
  }
} 