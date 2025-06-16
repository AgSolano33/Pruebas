import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import Prediagnostico from "@/models/Prediagnostico";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario no proporcionado' },
        { status: 400 }
      );
    }

    await connectToDatabase(); 
    const data = await request.json(); 
    const prediagnostico = await Prediagnostico.create({
      ...data,
      userId
    });
    console.log('Pre-diagnóstico creado exitosamente en la base de datos de prediagnosticos.');
    
    return NextResponse.json(prediagnostico, { status: 201 });

  } catch (error) {
    console.error("Error saving prediagnostico data:", error);
    
    let errorMessage = "Error al guardar los datos del prediagnóstico";
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      errorMessage = `Error de validación: ${validationErrors.join(', ')}`;
    } else if (error.code === 11000) {
      errorMessage = "Datos duplicados: Ya existe un prediagnóstico con esta información.";
    } else if (error.name === 'CastError') {
      errorMessage = `Error de formato de datos: ${error.message}`;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario no proporcionado' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      throw new Error("No se pudo establecer conexión con la base de datos");
    }
    
    // Obtener los prediagnósticos del usuario específico
    const prediagnosticos = await Prediagnostico.find({ userId })
      .sort({ createdAt: -1 });
    
    return NextResponse.json(prediagnosticos);
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error al obtener los prediagnósticos',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID no proporcionado' },
        { status: 400 }
      );
    }
    const db = await connectToDatabase();
    if (!db) {
      throw new Error("No se pudo establecer conexión con la base de datos");
    }
    const prediagnostico = await Prediagnostico.findByIdAndDelete(id);
    
    if (!prediagnostico) {
      return NextResponse.json(
        { error: 'Prediagnóstico no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Prediagnóstico eliminado exitosamente',
      id: id 
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error al eliminar el prediagnóstico',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
