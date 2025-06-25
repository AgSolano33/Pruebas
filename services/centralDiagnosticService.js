import OpenAI from "openai";
import { connectToDatabase } from "@/libs/mongodb";
import promptConfig from "@/scripts/centralDiagnosticPrompt.json";

// Verificar API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY no está configurada en las variables de entorno");
}

if (!OPENAI_API_KEY.startsWith('sk-')) {
  throw new Error("OPENAI_API_KEY tiene un formato inválido. Debe comenzar con 'sk-'");
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Función para calcular métricas porcentuales
function calcularMetricasPorcentuales(evaluacionAreas) {
  const metricas = {};
  
  // Función auxiliar para calcular el porcentaje de una sección
  const calcularPorcentajeSeccion = (seccion) => {
    if (!seccion || typeof seccion !== 'object') return 0;
    
    const valores = Object.values(seccion).filter(val => typeof val === 'number');
    if (valores.length === 0) return 0;
    
    const suma = valores.reduce((acc, val) => acc + val, 0);
    const maximo = valores.length * 5;
    return Math.round((suma / maximo) * 100);
  };
  
  // Calcular cada métrica
  metricas.madurezDigital = calcularPorcentajeSeccion(evaluacionAreas?.madurezDigital);
  metricas.saludFinanciera = calcularPorcentajeSeccion(evaluacionAreas?.saludFinanciera);
  metricas.eficienciaOperativa = calcularPorcentajeSeccion(evaluacionAreas?.eficienciaOperativa);
  metricas.recursosHumanos = calcularPorcentajeSeccion(evaluacionAreas?.recursosHumanos);
  metricas.marketingVentas = calcularPorcentajeSeccion(evaluacionAreas?.marketingVentas);
  metricas.innovacionDesarrollo = calcularPorcentajeSeccion(evaluacionAreas?.innovacionDesarrollo);
  metricas.experienciaCliente = calcularPorcentajeSeccion(evaluacionAreas?.experienciaCliente);
  metricas.gestionRiesgos = calcularPorcentajeSeccion(evaluacionAreas?.gestionRiesgos);
  
  return metricas;
}

export async function analyzeCentralDiagnostic(diagnosticData, userId) {
  console.log('1. Iniciando análisis del diagnóstico central...');
  console.log('Datos del diagnóstico:', diagnosticData);

  let mongoose = null;

  try {
    // Conectar a MongoDB
    mongoose = await connectToDatabase();
    console.log('2. Conexión a MongoDB establecida');

    // Preparar los datos para el análisis
    const dataForAnalysis = {
      empresa: {
        nombre: diagnosticData.informacionEmpresa?.nombreEmpresa || '',
        sector: diagnosticData.informacionEmpresa?.sector || '',
        ubicacion: diagnosticData.informacionEmpresa?.ubicacion || '',
        descripcion: diagnosticData.informacionEmpresa?.descripcionActividad || '',
        numeroEmpleados: diagnosticData.informacionEmpresa?.numeroEmpleados || '',
        ventas: diagnosticData.informacionEmpresa?.ventas || ''
      },
      resumenEmpresa: {
        descripcion: diagnosticData.informacionEmpresa?.descripcionActividad || '',
        fortalezas: diagnosticData.informacionEmpresa?.fortalezas || [],
        debilidades: diagnosticData.informacionEmpresa?.debilidades || [],
        oportunidades: diagnosticData.informacionEmpresa?.oportunidades || []
      },
      analisisObjetivos: {
        situacionActual: diagnosticData.proyectoObjetivos?.descripcionProyecto || '',
        viabilidad: diagnosticData.proyectoObjetivos?.objetivoConsultoria || '',
        recomendaciones: diagnosticData.proyectoObjetivos?.recomendaciones || []
      },
      evaluacionAreas: diagnosticData.evaluacionAreas || {},
      metricasPorcentuales: calcularMetricasPorcentuales(diagnosticData.evaluacionAreas)
    };

    console.log('Métricas calculadas:', dataForAnalysis.metricasPorcentuales);
    console.log('Datos de evaluación:', diagnosticData.evaluacionAreas);

    // Usar JSON mode con la API de chat completions
    console.log('3. Enviando solicitud a OpenAI con JSON mode...');
    
    // Construir el prompt desde el archivo JSON
    const jsonStructureString = JSON.stringify(promptConfig.jsonStructure, null, 2);
    const instructionsString = promptConfig.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n');
    
    const prompt = `${promptConfig.userPrompt}

${jsonStructureString}

Asegúrate de que:
${instructionsString}

IMPORTANTE: ${promptConfig.importantNote}

${promptConfig.example.description}

${promptConfig.dataPlaceholder.replace('{dataForAnalysis}', JSON.stringify(dataForAnalysis, null, 2))}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `${promptConfig.systemMessage}

INFORMACIÓN DE LA EMPRESA:
- Sector: ${dataForAnalysis.empresa.sector}
- Ubicación: ${dataForAnalysis.empresa.ubicacion}
- Descripción: ${dataForAnalysis.empresa.descripcion}
- Número de empleados: ${dataForAnalysis.empresa.numeroEmpleados}
- Ventas: ${dataForAnalysis.empresa.ventas}

Tu tarea es analizar la información proporcionada y generar un análisis completo en formato JSON estricto, personalizado específicamente para esta empresa basándote en su sector, ubicación, tamaño y características únicas.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('No se pudo obtener la respuesta de OpenAI');
    }

    const rawResponse = response.choices[0].message.content;
    console.log('Respuesta recibida:', rawResponse);

    // Procesar la respuesta JSON
    let analysis;
    try {
      analysis = JSON.parse(rawResponse);
      
      // Validar la estructura de la respuesta
      const requiredStructure = {
        empresa: {
          nombre: "string",
          sector: "string",
          ubicacion: "string"
        },
        fechaAnalisis: "date",
        resumenEmpresa: {
          descripcion: "string",
          fortalezas: "array",
          debilidades: "array",
          oportunidades: "array"
        },
        analisisObjetivos: {
          situacionActual: "string",
          viabilidad: "string",
          recomendaciones: "array"
        },
        metricasPorcentuales: {
          madurezDigital: "number",
          saludFinanciera: "number",
          eficienciaOperativa: "number",
          recursosHumanos: "number",
          marketingVentas: "number",
          innovacionDesarrollo: "number",
          experienciaCliente: "number",
          gestionRiesgos: "number"
        },
        analisisMetricas: "object",
        proximosPasos: {
          inmediatos: "array",
          cortoPlazo: "array",
          medianoPlazo: "array"
        }
      };

      // Validar que todos los campos requeridos existan
      for (const [key, value] of Object.entries(requiredStructure)) {
        if (!analysis[key]) {
          throw new Error(`Falta el campo requerido: ${key}`);
        }
      }

      // Validar que las métricas estén entre 0 y 100
      for (const [key, value] of Object.entries(analysis.metricasPorcentuales)) {
        if (typeof value !== 'number' || value < 0 || value > 100) {
          throw new Error(`La métrica ${key} debe ser un número entre 0 y 100`);
        }
      }

    } catch (error) {
      console.error('Error al validar la respuesta:', error);
      throw new Error(`Error en el formato de la respuesta: ${error.message}`);
    }

    // Guardar el resultado en la base de datos
    const result = await mongoose.connection.db.collection('analysis_results').insertOne({
      ...analysis,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('4. Resultado guardado en la base de datos');

    return {
      ...analysis,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error en el análisis:', error);
    throw new Error(`Error al analizar el diagnóstico central: ${error.message}`);
  }
}

// Función para crear y analizar el diagnóstico central
export async function createAndAnalyzeCentralDiagnostic(diagnosticData, userId) {
  try {
    // Conectar a MongoDB
    const mongoose = await connectToDatabase();

    // Guardar el diagnóstico central
    const diagnosticResult = await mongoose.connection.db
      .collection('central_diagnostics')
      .insertOne({
        ...diagnosticData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });

    console.log('Diagnóstico central guardado:', diagnosticResult.insertedId);

    // Realizar el análisis automáticamente
    const analysis = await analyzeCentralDiagnostic(diagnosticData, userId);

    return {
      diagnosticId: diagnosticResult.insertedId,
      analysis
    };
  } catch (error) {
    console.error('Error al crear y analizar el diagnóstico:', error);
    throw new Error(`Error al crear y analizar el diagnóstico central: ${error.message}`);
  }
}

// Función de prueba para el diagnóstico central
export async function testCentralDiagnostic(testData) {
  try {
    console.log('Iniciando prueba de diagnóstico central...');
    const result = await analyzeCentralDiagnostic(testData, 'test_user_id');
    console.log('Diagnóstico central de prueba completado exitosamente');
    return result;
  } catch (error) {
    console.error('Error en la prueba de diagnóstico central:', error);
    throw error;
  }
} 