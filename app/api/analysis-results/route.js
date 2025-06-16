import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/libs/mongodb';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');

    await connectToDatabase();
    const db = mongoose.connection.db;

    let centralDiagnosis;

    if (id) {
      // Si se proporciona un ID, buscar ese diagnóstico central específico
      centralDiagnosis = await db.collection('diagnosticoscentrales').findOne({ _id: new mongoose.Types.ObjectId(id) });
      if (!centralDiagnosis) {
        return NextResponse.json({ 
          success: false, 
          error: 'Diagnóstico central no encontrado por ID' 
        }, { status: 404 });
      }
    } else if (userId) {
      // Si se proporciona un userId, buscar el diagnóstico central más reciente de ese usuario
      centralDiagnosis = await db.collection('diagnosticoscentrales')
        .findOne({ userId }, { sort: { createdAt: -1 } });
      
      if (!centralDiagnosis) {
        return NextResponse.json({ 
          success: false, 
          error: 'No se encontró un diagnóstico central para el usuario' 
        }, { status: 404 });
      }
    } else {
      // Si no se proporciona ni id ni userId, devolver error
      return NextResponse.json({ 
        success: false, 
        error: 'Se requiere userId o id para obtener el diagnóstico central' 
      }, { status: 400 });
    }

    // Función auxiliar para calcular el promedio de un objeto de evaluación
    const calculateAverage = (obj) => {
      if (!obj) return 0;
      const values = Object.values(obj).filter(val => typeof val === 'number');
      if (values.length === 0) return 0;
      return (values.reduce((sum, val) => sum + val, 0) / values.length) * 20; // Escalar a porcentaje (max 5 * 20 = 100)
    };

    // Formatear los datos para el frontend
    const formattedData = {
      _id: centralDiagnosis._id,
      createdAt: centralDiagnosis.createdAt,
      updatedAt: centralDiagnosis.updatedAt,
      userId: centralDiagnosis.userId,
      
      // Datos para la sección de Resumen de la Empresa y Análisis de Objetivos
      resumenEmpresa: {
        descripcion: centralDiagnosis.informacionEmpresa?.descripcionActividad || '',
        fortalezas: [], // No hay un campo directo, se puede derivar o dejar vacío
        debilidades: [], // No hay un campo directo, se puede derivar o dejar vacío
        oportunidades: [], // No hay un campo directo, se puede derivar o dejar vacío
      },
      analisisObjetivos: {
        situacionActual: centralDiagnosis.proyectoObjetivos?.descripcionProyecto || '',
        viabilidad: centralDiagnosis.proyectoObjetivos?.objetivoConsultoria || '',
        recomendaciones: [], // No hay un campo directo, se puede derivar o dejar vacío
      },

      // Porcentajes de las métricas principales (derivados de evaluacionAreas)
      porcentajes: {
        madurezDigital: calculateAverage(centralDiagnosis.evaluacionAreas?.madurezDigital),
        saludFinanciera: calculateAverage(centralDiagnosis.evaluacionAreas?.saludFinanciera),
        eficienciaOperativa: calculateAverage(centralDiagnosis.evaluacionAreas?.eficienciaOperativa),
        recursosHumanos: calculateAverage(centralDiagnosis.evaluacionAreas?.talentoHumano),
        marketingVentas: calculateAverage(centralDiagnosis.evaluacionAreas?.ventasMarketing),
        innovacionDesarrollo: calculateAverage(centralDiagnosis.evaluacionAreas?.innovacion),
        experienciaCliente: calculateAverage(centralDiagnosis.evaluacionAreas?.experienciaCliente),
        gestionRiesgos: calculateAverage(centralDiagnosis.evaluacionAreas?.gestionRiesgos),
      },

      // Análisis de métricas (interpretación y recomendaciones)
      analisisMetricas: {
        madurezDigital: { interpretacion: 'Basado en su evaluación de madurez digital.', recomendaciones: [] },
        saludFinanciera: { interpretacion: 'Basado en su evaluación de salud financiera.', recomendaciones: [] },
        eficienciaOperativa: { interpretacion: 'Basado en su evaluación de eficiencia operativa.', recomendaciones: [] },
        recursosHumanos: { interpretacion: 'Basado en su evaluación de talento humano.', recomendaciones: [] },
        marketingVentas: { interpretacion: 'Basado en su evaluación de ventas y marketing.', recomendaciones: [] },
        innovacionDesarrollo: { interpretacion: 'Basado en su evaluación de innovación.', recomendaciones: [] },
        experienciaCliente: { interpretacion: 'Basado en su evaluación de experiencia del cliente.', recomendaciones: [] },
        gestionRiesgos: { interpretacion: 'Basado en su evaluación de gestión de riesgos.', recomendaciones: [] },
      },

      // Próximos pasos (se puede derivar de otros campos si están disponibles)
      proximosPasos: {
        inmediatos: [],
        cortoPlazo: [],
        medianoPlazo: [],
      }
    };

    return NextResponse.json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error('Error en GET /api/analysis-results:', error);
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
        error: 'Se requiere el ID del diagnóstico' 
      }, { status: 400 });
    }

    await connectToDatabase();
    const db = mongoose.connection.db;
    const result = await db.collection('diagnosticoscentrales').deleteOne({ 
      _id: new mongoose.Types.ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Diagnóstico central no encontrado' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Diagnóstico central eliminado exitosamente' 
    });

  } catch (error) {
    console.error('Error al eliminar diagnóstico central:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error al eliminar diagnóstico central' 
    }, { status: 500 });
  }
} 