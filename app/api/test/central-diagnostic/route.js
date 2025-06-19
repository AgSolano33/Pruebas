import { NextResponse } from 'next/server';
import { analyzeCentralDiagnostic } from '@/services/centralDiagnosticService';

export async function POST(request) {
  try {
    const testData = {
      empresa: {
        nombre: "Empresa de Prueba",
        sector: "Tecnología",
        ubicacion: "Ciudad de México"
      },
      resumenEmpresa: {
        descripcion: "Empresa de tecnología enfocada en desarrollo de software",
        fortalezas: [
          "Equipo técnico altamente calificado",
          "Buenas prácticas de desarrollo",
          "Cliente base estable"
        ],
        debilidades: [
          "Procesos de documentación mejorables",
          "Necesidad de automatización en pruebas"
        ],
        oportunidades: [
          "Expansión a nuevos mercados",
          "Desarrollo de nuevos productos"
        ]
      },
      analisisObjetivos: {
        situacionActual: "La empresa busca expandir sus operaciones y mejorar sus procesos",
        viabilidad: "Alta viabilidad con los recursos actuales",
        recomendaciones: [
          "Implementar mejoras en documentación",
          "Automatizar procesos de prueba"
        ]
      },
      metricasPorcentuales: {
        madurezDigital: 75,
        saludFinanciera: 85,
        eficienciaOperativa: 70,
        recursosHumanos: 80,
        marketingVentas: 65,
        innovacionDesarrollo: 75,
        experienciaCliente: 80,
        gestionRiesgos: 85
      }
    };

    console.log('Iniciando prueba de diagnóstico central...');
    const result = await analyzeCentralDiagnostic(testData, 'test_user_id');
    console.log('Diagnóstico central completado exitosamente');

    return NextResponse.json({
      success: true,
      message: 'Diagnóstico central completado exitosamente',
      data: result
    });

  } catch (error) {
    console.error('Error en la prueba de diagnóstico central:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al procesar el diagnóstico central',
      error: error.message
    }, { status: 500 });
  }
} 