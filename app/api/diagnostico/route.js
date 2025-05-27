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
    let errorMessage = "Error al crear el diagnóstico";
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      errorMessage = `Error de validación: ${validationErrors.join(', ')}`;
    } else if (error.code === 11000) {
      errorMessage = "Ya existe un diagnóstico con estos datos";
    } else if (error.name === 'CastError') {
      errorMessage = `Error de tipo de dato: ${error.message}`;
    }
    // Error de validación: Muestra los mensajes específicos de validación de Mongoose
    // Error de duplicado: Indica cuando ya existe un diagnóstico con los mismos datos
    // Error de tipo de dato: Muestra el mensaje específico cuando hay un error de conversión de tipos
    return NextResponse.json(
      { error: errorMessage },
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
    let errorMessage = "Error al obtener los diagnósticos";
    
    if (error.name === 'MongooseError') {
      errorMessage = `Error de conexión a la base de datos: ${error.message}`;
    } else if (error.name === 'QueryError') {
      errorMessage = `Error en la consulta: ${error.message}`;
    }
        // Error de conexión: Muestra el mensaje específico cuando hay problemas con la base de datos
        // Error de consulta: Muestra el mensaje específico cuando hay problemas con la consulta
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 