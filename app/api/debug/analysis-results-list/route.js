import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import mongoose from "mongoose";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    await connectToDatabase();
    const db = mongoose.connection.db;
    
    let query = {};
    if (userId) {
      query.userId = userId;
    }
    
    // Obtener todos los análisis
    const analyses = await db.collection('analysis_results').find(query)
      .sort({ createdAt: -1 })
      .select('userId createdAt metricasPorcentuales')
      .toArray();

    console.log('Análisis encontrados:', analyses.length);
    analyses.forEach(analysis => {
      console.log(`- userId: ${analysis.userId}, fecha: ${analysis.createdAt}`);
      if (analysis.metricasPorcentuales) {
        console.log(`  - metricasPorcentuales:`, analysis.metricasPorcentuales);
      } else {
        console.log(`  - No tiene metricasPorcentuales`);
      }
    });

    return NextResponse.json({
      success: true,
      count: analyses.length,
      data: analyses
    });
  } catch (error) {
    console.error('Error al listar análisis:', error);
    return NextResponse.json({
      success: false,
      error: error.message || "Error al listar análisis"
    }, { status: 500 });
  }
} 