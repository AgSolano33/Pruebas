import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import AnalysisResult from '@/models/AnalysisResult';

export async function GET() {
  try {
    await connectDB();

    // Buscar el análisis más reciente
    const analysisResult = await AnalysisResult.findOne()
      .sort({ fechaAnalisis: -1 })
      .lean();

    if (!analysisResult) {
      return NextResponse.json({ 
        success: false, 
        error: 'No se encontró ningún análisis' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error('Error al obtener el análisis:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message
    }, { status: 500 });
  }
} 