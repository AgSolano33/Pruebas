import { NextResponse } from "next/server";
import { analyzeGeneralMetrics, getGeneralAnalysis } from "@/services/metricGeneralService";
import { connectToDatabase } from "@/libs/mongodb";

export async function GET(request) {
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
    
    // Buscar el análisis general más reciente para este usuario
    const analysis = await getGeneralAnalysis(userId);

    if (!analysis) {
      return NextResponse.json({
        success: false,
        error: "No se encontró análisis general para este usuario"
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: analysis 
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || "Error al obtener el análisis general"
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, empresa } = body;

    if (!userId || !empresa) {
      return NextResponse.json({
        success: false,
        error: "Faltan datos requeridos para el análisis general (userId y empresa)"
      }, { status: 400 });
    }

    const result = await analyzeGeneralMetrics({
      userId,
      empresa
    });

    return NextResponse.json({ 
      success: true, 
      message: "Análisis general generado exitosamente",
      data: result 
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || "Error al generar el análisis general"
    }, { status: 500 });
  }
} 