import { NextResponse } from "next/server";
import { analyzeMetric } from "@/services/metricAnalysisService";

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