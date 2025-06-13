const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function analyzeDiagnosticWithGPT(diagnostic) {
  try {
    const { informacionEmpresa, proyectoObjetivos, evaluacionAreas } = diagnostic;

    // Calcular porcentajes manualmente para asegurar precisión
    const calcularPorcentaje = (area) => {
      const valores = Object.values(area);
      const suma = valores.reduce((acc, val) => acc + val, 0);
      const maximo = valores.length * 5; // 5 es la puntuación máxima
      return Math.round((suma / maximo) * 100);
    };

    const porcentajes = {
      madurezDigital: calcularPorcentaje(evaluacionAreas.madurezDigital),
      saludFinanciera: calcularPorcentaje(evaluacionAreas.saludFinanciera),
      eficienciaOperativa: calcularPorcentaje(evaluacionAreas.eficienciaOperativa),
      recursosHumanos: calcularPorcentaje(evaluacionAreas.recursosHumanos),
      marketingVentas: calcularPorcentaje(evaluacionAreas.marketingVentas),
      innovacionDesarrollo: calcularPorcentaje(evaluacionAreas.innovacionDesarrollo),
      experienciaCliente: calcularPorcentaje(evaluacionAreas.experienciaCliente),
      gestionRiesgos: calcularPorcentaje(evaluacionAreas.gestionRiesgos)
    };

    const prompt = `Analiza la siguiente información empresarial y proporciona un diagnóstico detallado en formato JSON:

    INFORMACIÓN DE LA EMPRESA:
    - Sector: ${informacionEmpresa.sector}
    - Nombre: ${informacionEmpresa.nombreEmpresa}
    - Ubicación: ${informacionEmpresa.ubicacion}
    - Descripción de Actividad: ${informacionEmpresa.descripcionActividad}
    - Número de Empleados: ${informacionEmpresa.numeroEmpleados}
    - Ventas Anuales: ${informacionEmpresa.ventasAnuales}
    - Antigüedad: ${informacionEmpresa.antiguedad} años

    PROYECTO Y OBJETIVOS:
    - Descripción del Proyecto: ${proyectoObjetivos.descripcionProyecto}
    - Objetivo de Consultoría: ${proyectoObjetivos.objetivoConsultoria}
    
    EVALUACIÓN DE ÁREAS (Porcentajes calculados):
    - Madurez Digital: ${porcentajes.madurezDigital}%
    - Salud Financiera: ${porcentajes.saludFinanciera}%
    - Eficiencia Operativa: ${porcentajes.eficienciaOperativa}%
    - Recursos Humanos: ${porcentajes.recursosHumanos}%
    - Marketing y Ventas: ${porcentajes.marketingVentas}%
    - Innovación y Desarrollo: ${porcentajes.innovacionDesarrollo}%
    - Experiencia del Cliente: ${porcentajes.experienciaCliente}%
    - Gestión de Riesgos: ${porcentajes.gestionRiesgos}%

    Por favor, proporciona la respuesta en el siguiente formato JSON:
    {
      "resumenEmpresa": {
        "descripcion": "Breve descripción de la empresa y su situación actual",
        "fortalezas": ["lista de fortalezas principales"],
        "debilidades": ["lista de debilidades principales"],
        "oportunidades": ["lista de oportunidades identificadas"]
      },
      "analisisObjetivos": {
        "situacionActual": "Análisis de la situación actual respecto a los objetivos",
        "viabilidad": "Evaluación de la viabilidad de los objetivos",
        "recomendaciones": ["recomendaciones específicas para alcanzar los objetivos"]
      },
      "metricasPorcentuales": {
        "madurezDigital": ${porcentajes.madurezDigital},
        "saludFinanciera": ${porcentajes.saludFinanciera},
        "eficienciaOperativa": ${porcentajes.eficienciaOperativa},
        "recursosHumanos": ${porcentajes.recursosHumanos},
        "marketingVentas": ${porcentajes.marketingVentas},
        "innovacionDesarrollo": ${porcentajes.innovacionDesarrollo},
        "experienciaCliente": ${porcentajes.experienciaCliente},
        "gestionRiesgos": ${porcentajes.gestionRiesgos}
      },
      "analisisMetricas": {
        "madurezDigital": {
          "interpretacion": "Interpretación del porcentaje obtenido",
          "recomendaciones": ["recomendaciones específicas para mejorar"]
        },
        "saludFinanciera": {
          "interpretacion": "Interpretación del porcentaje obtenido",
          "recomendaciones": ["recomendaciones específicas para mejorar"]
        },
        "eficienciaOperativa": {
          "interpretacion": "Interpretación del porcentaje obtenido",
          "recomendaciones": ["recomendaciones específicas para mejorar"]
        },
        "recursosHumanos": {
          "interpretacion": "Interpretación del porcentaje obtenido",
          "recomendaciones": ["recomendaciones específicas para mejorar"]
        },
        "marketingVentas": {
          "interpretacion": "Interpretación del porcentaje obtenido",
          "recomendaciones": ["recomendaciones específicas para mejorar"]
        },
        "innovacionDesarrollo": {
          "interpretacion": "Interpretación del porcentaje obtenido",
          "recomendaciones": ["recomendaciones específicas para mejorar"]
        },
        "experienciaCliente": {
          "interpretacion": "Interpretación del porcentaje obtenido",
          "recomendaciones": ["recomendaciones específicas para mejorar"]
        },
        "gestionRiesgos": {
          "interpretacion": "Interpretación del porcentaje obtenido",
          "recomendaciones": ["recomendaciones específicas para mejorar"]
        }
      },
      "proximosPasos": {
        "inmediatos": ["acciones a tomar en los próximos 30 días"],
        "cortoPlazo": ["acciones para los próximos 3 meses"],
        "medianoPlazo": ["acciones para los próximos 6 meses"]
      }
    }`;

    console.log('Enviando petición a OpenAI...');
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Eres un consultor empresarial experto en análisis de métricas, mejora continua y transformación digital. Tu análisis debe ser detallado, práctico y orientado a resultados. DEBES responder SIEMPRE en formato JSON válido. Los porcentajes ya están calculados, úsalos directamente en tu respuesta."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error detallado de OpenAI:', errorData);
      throw new Error(`Error en la API de OpenAI: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Respuesta de ChatGPT:', data);
    
    // Parsear la respuesta JSON
    const analysis = JSON.parse(data.choices[0].message.content);
    
    // Asegurarse de que los porcentajes sean números
    if (analysis.metricasPorcentuales) {
      Object.keys(analysis.metricasPorcentuales).forEach(key => {
        const value = analysis.metricasPorcentuales[key];
        if (typeof value === 'string') {
          // Eliminar el símbolo % y convertir a número
          analysis.metricasPorcentuales[key] = parseFloat(value.replace('%', ''));
        }
      });
    }
    
    return {
      analysis,
      usage: data.usage
    };
  } catch (error) {
    console.error('Error al analizar diagnóstico con ChatGPT:', error);
    throw error;
  }
} 