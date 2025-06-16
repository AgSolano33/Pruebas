import { NextResponse } from "next/server";
import { analyzeDiagnosticWithGPT } from "@/services/chatGPTService";
import { connectToDatabase } from "@/libs/mongodb";
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.userId) {
      return NextResponse.json(
        { error: "Se requiere el ID del usuario" },
        { status: 400 }
      );
    }

    // Conectar a MongoDB
    const mongoose = await connectToDatabase();

    // Verificar si ya existe un análisis para este usuario
    const existingAnalysis = await mongoose.connection.db
      .collection('diagnoses')
      .findOne({ userId: data.userId }, { sort: { createdAt: -1 } });

    // Si no hay análisis previo o se solicita uno nuevo, proceder con el análisis
    const analysis = await analyzeDiagnosticWithGPT(data, data.userId);

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error al procesar el análisis" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
   
    

  
    
    // Conectar a MongoDB
    const mongoose = await connectToDatabase();

    // Ejecutar el análisis
    const analysis = await analyzeDiagnosticWithGPT(testData, userId);

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error al procesar el análisis de prueba" },
      { status: 500 }
    );
  }
}

// Endpoint de prueba para ejecutar el análisis con datos de prueba
export async function PUT(request) {
  try {
  
   

    
    
    // Conectar a MongoDB
    const mongoose = await connectToDatabase();
    

    // Ejecutar el análisis
    
    const analysis = await analyzeDiagnosticWithGPT(testData, userId);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error en el análisis de prueba:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar el análisis de prueba" },
      { status: 500 }
    );
  }
} 