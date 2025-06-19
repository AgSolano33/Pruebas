import OpenAI from "openai";
import { connectToDatabase } from "@/libs/mongodb";

// Verificar ASSISTANT_ID
const ASSISTANT_ID = process.env.ASSISTANT_ID;
if (!ASSISTANT_ID) {
  throw new Error("ASSISTANT_ID no está configurado en las variables de entorno");
}

if (!ASSISTANT_ID.startsWith('asst_')) {
  throw new Error("ASSISTANT_ID tiene un formato inválido. Debe comenzar con 'asst_'");
}

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

  let threadId = null;
  let mongoose = null;

  try {
    // Conectar a MongoDB
    mongoose = await connectToDatabase();
    console.log('2. Conexión a MongoDB establecida');

    // Crear un thread para el análisis
    console.log('3. Creando thread en OpenAI...');
    const threadResponse = await openai.beta.threads.create();
    
    if (!threadResponse?.id?.startsWith('thread_')) {
      throw new Error('Error al crear el thread: ID inválido');
    }
    
    threadId = threadResponse.id;
    console.log('Thread creado exitosamente:', threadId);

    // Preparar los datos para el análisis
    const dataForAnalysis = {
      empresa: {
        nombre: diagnosticData.informacionEmpresa?.nombreEmpresa || '',
        sector: diagnosticData.informacionEmpresa?.sector || '',
        ubicacion: diagnosticData.informacionEmpresa?.ubicacion || ''
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

    // Agregar el mensaje con los datos del diagnóstico
    console.log('4. Agregando mensaje al thread...');
    
    const prompt = `
Analiza el siguiente diagnóstico central y proporciona la respuesta en el siguiente formato JSON estricto:

{
  "empresa": {
    "nombre": "string",
    "sector": "string",
    "ubicacion": "string"
  },
  "fechaAnalisis": "date",
  "resumenEmpresa": {
    "descripcion": "string",
    "fortalezas": ["string"],
    "debilidades": ["string"],
    "oportunidades": ["string"]
  },
  "analisisObjetivos": {
    "situacionActual": "string",
    "viabilidad": "string",
    "recomendaciones": ["string"]
  },
  "metricasPorcentuales": {
    "madurezDigital": number,
    "saludFinanciera": number,
    "eficienciaOperativa": number,
    "recursosHumanos": number,
    "marketingVentas": number,
    "innovacionDesarrollo": number,
    "experienciaCliente": number,
    "gestionRiesgos": number
  },
  "analisisMetricas": {
    "madurezDigital": {
      "descripcionModulo": {
        "objetivo": "string",
        "alcance": "string",
        "componentes": ["string"]
      },
      "conclusionBasadaPuntuacion": {
        "nivel": "string",
        "fortalezas": ["string"],
        "areasMejora": ["string"],
        "impactoGeneral": "string"
      },
      "interpretacionCompleta": {
        "analisisDetallado": "string",
        "tendencias": ["string"],
        "factoresClave": ["string"],
        "impactoEstrategico": "string"
      },
      "interpretacion": "string",
      "recomendaciones": ["string"]
    },
    "saludFinanciera": {
      "descripcionModulo": {
        "objetivo": "string",
        "alcance": "string",
        "componentes": ["string"]
      },
      "conclusionBasadaPuntuacion": {
        "nivel": "string",
        "fortalezas": ["string"],
        "areasMejora": ["string"],
        "impactoGeneral": "string"
      },
      "interpretacionCompleta": {
        "analisisDetallado": "string",
        "tendencias": ["string"],
        "factoresClave": ["string"],
        "impactoEstrategico": "string"
      },
      "interpretacion": "string",
      "recomendaciones": ["string"]
    },
    "eficienciaOperativa": {
      "descripcionModulo": {
        "objetivo": "string",
        "alcance": "string",
        "componentes": ["string"]
      },
      "conclusionBasadaPuntuacion": {
        "nivel": "string",
        "fortalezas": ["string"],
        "areasMejora": ["string"],
        "impactoGeneral": "string"
      },
      "interpretacionCompleta": {
        "analisisDetallado": "string",
        "tendencias": ["string"],
        "factoresClave": ["string"],
        "impactoEstrategico": "string"
      },
      "interpretacion": "string",
      "recomendaciones": ["string"]
    },
    "recursosHumanos": {
      "descripcionModulo": {
        "objetivo": "string",
        "alcance": "string",
        "componentes": ["string"]
      },
      "conclusionBasadaPuntuacion": {
        "nivel": "string",
        "fortalezas": ["string"],
        "areasMejora": ["string"],
        "impactoGeneral": "string"
      },
      "interpretacionCompleta": {
        "analisisDetallado": "string",
        "tendencias": ["string"],
        "factoresClave": ["string"],
        "impactoEstrategico": "string"
      },
      "interpretacion": "string",
      "recomendaciones": ["string"]
    },
    "marketingVentas": {
      "descripcionModulo": {
        "objetivo": "string",
        "alcance": "string",
        "componentes": ["string"]
      },
      "conclusionBasadaPuntuacion": {
        "nivel": "string",
        "fortalezas": ["string"],
        "areasMejora": ["string"],
        "impactoGeneral": "string"
      },
      "interpretacionCompleta": {
        "analisisDetallado": "string",
        "tendencias": ["string"],
        "factoresClave": ["string"],
        "impactoEstrategico": "string"
      },
      "interpretacion": "string",
      "recomendaciones": ["string"]
    },
    "innovacionDesarrollo": {
      "descripcionModulo": {
        "objetivo": "string",
        "alcance": "string",
        "componentes": ["string"]
      },
      "conclusionBasadaPuntuacion": {
        "nivel": "string",
        "fortalezas": ["string"],
        "areasMejora": ["string"],
        "impactoGeneral": "string"
      },
      "interpretacionCompleta": {
        "analisisDetallado": "string",
        "tendencias": ["string"],
        "factoresClave": ["string"],
        "impactoEstrategico": "string"
      },
      "interpretacion": "string",
      "recomendaciones": ["string"]
    },
    "experienciaCliente": {
      "descripcionModulo": {
        "objetivo": "string",
        "alcance": "string",
        "componentes": ["string"]
      },
      "conclusionBasadaPuntuacion": {
        "nivel": "string",
        "fortalezas": ["string"],
        "areasMejora": ["string"],
        "impactoGeneral": "string"
      },
      "interpretacionCompleta": {
        "analisisDetallado": "string",
        "tendencias": ["string"],
        "factoresClave": ["string"],
        "impactoEstrategico": "string"
      },
      "interpretacion": "string",
      "recomendaciones": ["string"]
    },
    "gestionRiesgos": {
      "descripcionModulo": {
        "objetivo": "string",
        "alcance": "string",
        "componentes": ["string"]
      },
      "conclusionBasadaPuntuacion": {
        "nivel": "string",
        "fortalezas": ["string"],
        "areasMejora": ["string"],
        "impactoGeneral": "string"
      },
      "interpretacionCompleta": {
        "analisisDetallado": "string",
        "tendencias": ["string"],
        "factoresClave": ["string"],
        "impactoEstrategico": "string"
      },
      "interpretacion": "string",
      "recomendaciones": ["string"]
    }
  },
  "proximosPasos": {
    "inmediatos": ["string"],
    "cortoPlazo": ["string"],
    "medianoPlazo": ["string"]
  }
}

Asegúrate de que:
1. Todos los campos estén presentes
2. Los arrays contengan al menos un elemento
3. Los strings no estén vacíos
4. Los números en metricasPorcentuales estén entre 0 y 100
5. Mantén el formato exacto de los nombres de los campos
6. Que toda la información esté en español
7. Las métricas porcentuales sean números enteros
8. Basa tu análisis en los datos proporcionados, especialmente en las métricas y evaluaciones existentes
9. Proporciona recomendaciones específicas y accionables basadas en los datos reales
10. Para cada métrica en metricasPorcentuales:
    - Cada evaluación tiene un valor de 1 a 5 puntos
    - Suma todos los puntos de las evaluaciones de la sección
    - Calcula el porcentaje usando la fórmula: (suma_total / (número_de_evaluaciones * 5)) * 100
    - Redondea al número entero más cercano
    - El resultado será un porcentaje entre 0 y 100

IMPORTANTE: Usa los datos de evaluacionAreas proporcionados para calcular las métricas porcentuales. No inventes valores.

Por ejemplo, para Gestión de Riesgos:
- Si tienes 5 evaluaciones con valores 3, 3, 3, 2, 3
- Suma total = 14 puntos
- Máximo posible = 5 evaluaciones * 5 puntos = 25 puntos
- Porcentaje = (14 / 25) * 100 = 56%

Datos del diagnóstico a analizar:
${JSON.stringify(dataForAnalysis, null, 2)}
`;

    const messageResponse = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: prompt
    });
    
    if (!messageResponse?.id) {
      throw new Error('No se pudo agregar el mensaje al thread');
    }
    
    console.log('Mensaje agregado:', messageResponse.id);

    // Ejecutar el asistente y esperar la respuesta
    console.log('5. Ejecutando asistente y esperando respuesta...');
    
    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: ASSISTANT_ID,
    });
    
    if (run.status === "failed") {
      throw new Error(`Error en la ejecución del asistente: ${run.last_error?.message}`);
    }

    // Obtener los mensajes del thread
    console.log('6. Obteniendo respuesta del asistente...');
    
    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0];
    
    if (!lastMessage?.content?.[0]?.text?.value) {
      throw new Error('No se pudo obtener la respuesta del asistente');
    }
    
    const rawResponse = lastMessage.content[0].text.value;
    console.log('Respuesta recibida:', rawResponse);

    // Limpiar la respuesta antes de parsearla como JSON
    let cleanedResponse = rawResponse
      .replace(/```json\n|\n```/g, '')
      .replace(/```\n|\n```/g, '')
      .trim();
    
    console.log('Respuesta limpia:', cleanedResponse);

    // Procesar la respuesta
    let analysis;
    try {
      analysis = JSON.parse(cleanedResponse);
      
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

    console.log('7. Resultado guardado en la base de datos');

    return {
      ...analysis,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error en el análisis:', error);
    throw new Error(`Error al analizar el diagnóstico central: ${error.message}`);
  } finally {
    // Limpiar recursos
    if (threadId) {
      try {
        console.log('Limpiando thread:', threadId);
        await openai.beta.threads.delete(threadId);
        console.log('Thread eliminado:', threadId);
      } catch (error) {
        console.error('Error al eliminar thread:', error);
      }
    }
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