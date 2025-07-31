import { NextResponse } from "next/server";
import { analyzeMetric } from "@/services/metricAnalysisService";
import MetricAnalysisResult from "@/models/MetricAnalysisResult";
import { connectToDatabase } from "@/libs/mongodb";

export async function GET(request, { params }) {
  try {
    const { metricKey } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || !metricKey) {
      return NextResponse.json({
        success: false,
        error: "Se requiere userId y metricKey"
      }, { status: 400 });
    }

    await connectToDatabase();
    
    // Buscar el análisis más reciente para esta métrica y usuario
    const analysis = await MetricAnalysisResult.findOne({ 
      userId, 
      metricKey 
    }).sort({ createdAt: -1 }).populate('proyectoId');

    if (!analysis) {
      return NextResponse.json({
        success: false,
        error: "No se encontró análisis para esta métrica"
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: analysis 
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || "Error al obtener el análisis de la métrica"
    }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { metricKey } = params;
    const body = await request.json();
    const { userId, metricTitle, valorPorcentual, empresa, datosMetrica } = body;

    if (!userId || !metricKey || !metricTitle || valorPorcentual === undefined) {
      return NextResponse.json({
        success: false,
        error: "Faltan datos requeridos para el análisis de la métrica"
      }, { status: 400 });
    }

    const result = await analyzeMetric({
      userId,
      metricKey,
      metricTitle,
      valorPorcentual,
      empresa,
      datosMetrica
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || "Error al analizar la métrica"
    }, { status: 500 });
  }
} 