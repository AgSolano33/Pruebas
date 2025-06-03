import { NextResponse } from "next/server";
import DiagnosticoCentral from "@/models/DiagnosticoCentral";
import connectDB from "@/libs/mongodb";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const diagnostico = await DiagnosticoCentral.create(data);
    
    return NextResponse.json(
      { message: "Diagnóstico creado exitosamente", diagnostico },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear el diagnóstico:", error);
    return NextResponse.json(
      { error: "Error al crear el diagnóstico" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const diagnosticos = await DiagnosticoCentral.find().sort({ createdAt: -1 });
    
    return NextResponse.json(diagnosticos);
  } catch (error) {
    console.error("Error al obtener los diagnósticos:", error);
    return NextResponse.json(
      { error: "Error al obtener los diagnósticos" },
      { status: 500 }
    );
  }
} 