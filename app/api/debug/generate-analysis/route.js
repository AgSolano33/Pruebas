import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import DiagnosticoCentral from "@/models/DiagnosticoCentral";
import { analyzeCentralDiagnostic } from "@/services/centralDiagnosticService";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "Se requiere userId"
      }, { status: 400 });
    }

    await connectToDatabase();
    const db = mongoose.connection.db;

    console.log('Buscando diagnóstico central para userId:', userId);
    
    // Buscar el diagnóstico central más reciente del usuario
    const diagnostico = await DiagnosticoCentral.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!diagnostico) {
      return NextResponse.json({
        success: false,
        error: "No se encontró diagnóstico central para este usuario"
      }, { status: 404 });
    }

    console.log('Diagnóstico encontrado:', diagnostico._id);

    // Verificar si ya existe un análisis
    const existingAnalysis = await db.collection('analysis_results').findOne({ userId });
    
    if (existingAnalysis) {
      return NextResponse.json({
        success: false,
        error: "Ya existe un análisis para este usuario"
      }, { status: 400 });
    }

    console.log('Generando análisis para el diagnóstico...');
    
    // Generar el análisis
    const analysisResult = await analyzeCentralDiagnostic(diagnostico, userId);
    
    console.log('Análisis generado exitosamente');

    return NextResponse.json({
      success: true,
      message: "Análisis generado exitosamente",
      analysisId: analysisResult._id
    });

  } catch (error) {
    console.error('Error al generar análisis:', error);
    return NextResponse.json({
      success: false,
      error: error.message || "Error al generar análisis"
    }, { status: 500 });
  }
} 