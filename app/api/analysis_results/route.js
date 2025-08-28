import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/libs/mongodb';
import mongoose from 'mongoose';
export const dynamic = "force-dynamic"; // evita SSG/ISR
export const revalidate = 0;            // (opcional) no caches

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');

    if (!userId && !id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Se requiere userId o id para obtener el análisis' 
      }, { status: 400 });
    }

    await connectToDatabase();
    const db = mongoose.connection.db;

    let analysisResult;

    if (id) {
      // Si se proporciona un ID, buscar ese análisis específico
      analysisResult = await db.collection('analysis_results').findOne({ 
        _id: new mongoose.Types.ObjectId(id) 
      });
      
      if (!analysisResult) {
        return NextResponse.json({
          success: true,
          data: null
        });
      }
    } else {
      // Si se proporciona un userId, buscar el análisis más reciente de ese usuario
      analysisResult = await db.collection('analysis_results')
        .findOne({ userId }, { sort: { createdAt: -1 } });
      
      if (!analysisResult) {
        return NextResponse.json({
          success: true,
          data: null
        });
      }
    }

    // Verificar que el análisis tenga la estructura correcta
    const requiredFields = [
      'metricasPorcentuales',
      'analisisMetricas',
      'resumenEmpresa',
      'analisisObjetivos',
      'proximosPasos'
    ];

    for (const field of requiredFields) {
      if (!analysisResult[field]) {
        console.error(`Campo requerido faltante en el análisis: ${field}`);
        return NextResponse.json({ 
          success: false, 
          error: `El análisis no tiene la estructura completa. Falta el campo: ${field}` 
        }, { status: 500 });
      }
    }

    // Verificar que las métricas porcentuales estén presentes y sean números
    const metricasRequeridas = [
      'madurezDigital',
      'saludFinanciera',
      'eficienciaOperativa',
      'recursosHumanos',
      'marketingVentas',
      'innovacionDesarrollo',
      'experienciaCliente',
      'gestionRiesgos'
    ];

    // Función para determinar el nivel basado en el porcentaje
    const getNivel = (porcentaje) => {
      if (porcentaje >= 80) return 'Excelente';
      if (porcentaje >= 60) return 'Bueno';
      if (porcentaje >= 40) return 'Regular';
      if (porcentaje >= 20) return 'Bajo';
      return 'Crítico';
    };

    // Procesar las métricas y asegurar que los porcentajes sean números enteros
    for (const metrica of metricasRequeridas) {
      const porcentaje = analysisResult.metricasPorcentuales[metrica];
      if (typeof porcentaje !== 'number') {
        console.error(`Métrica porcentual inválida o faltante: ${metrica}`);
        return NextResponse.json({ 
          success: false, 
          error: `La métrica ${metrica} no tiene un valor válido` 
        }, { status: 500 });
      }

      // Asegurar que el porcentaje sea un número entero
      analysisResult.metricasPorcentuales[metrica] = Math.round(porcentaje);
      
      // Agregar el nivel al análisis de la métrica
      if (analysisResult.analisisMetricas[metrica]) {
        analysisResult.analisisMetricas[metrica].nivel = getNivel(porcentaje);
      }
    }

    // Verificar que el análisis de métricas tenga la estructura correcta
    for (const metrica of metricasRequeridas) {
      const analisisMetrica = analysisResult.analisisMetricas[metrica];
      if (!analisisMetrica || 
          !analisisMetrica.descripcionModulo ||
          !analisisMetrica.conclusionBasadaPuntuacion ||
          !analisisMetrica.interpretacion ||
          !Array.isArray(analisisMetrica.recomendaciones)) {
        console.error(`Estructura de análisis de métrica inválida: ${metrica}`);
        return NextResponse.json({ 
          success: false, 
          error: `El análisis de la métrica ${metrica} no tiene la estructura completa` 
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error('Error en GET /api/analysis_results:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error al obtener resultados de análisis' 
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Se requiere el ID del análisis' 
      }, { status: 400 });
    }

    await connectToDatabase();
    const db = mongoose.connection.db;
    const result = await db.collection('analysis_results').deleteOne({ 
      _id: new mongoose.Types.ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Análisis no encontrado' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Análisis eliminado exitosamente' 
    });

  } catch (error) {
    console.error('Error al eliminar análisis:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error al eliminar análisis' 
    }, { status: 500 });
  }
} 