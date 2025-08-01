import OpenAI from "openai";
import { connectToDatabase } from "@/libs/mongodb";
import MetricAnalysisResult from "@/models/MetricAnalysisResult";
import ProyectoPublicado from "@/models/ProyectoPublicado";
import promptConfig from "@/scripts/metricAnalysisPrompt.json";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY no está configurada en las variables de entorno");
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function analyzeMetric({ userId, metricKey, metricTitle, valorPorcentual, empresa, datosMetrica }) {
  await connectToDatabase();

  // Construir el prompt con los datos del formulario
  const jsonStructureString = JSON.stringify(promptConfig.jsonStructure, null, 2);
  const instructionsString = promptConfig.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n');
  
  // Crear un prompt personalizado que incluya los datos del formulario
  const formDataSummary = datosMetrica.formData ? 
    `\n\nDatos del formulario de evaluación:\n${JSON.stringify(datosMetrica.formData, null, 2)}` : '';
  
  const prompt = `${promptConfig.userPrompt}\n\n${jsonStructureString}\n\nAsegúrate de que:\n${instructionsString}\n\nIMPORTANTE: ${promptConfig.importantNote}\n\nEjemplo:\n${JSON.stringify(promptConfig.example, null, 2)}\n\n${promptConfig.dataPlaceholder.replace('{dataForAnalysis}', JSON.stringify({ 
    empresa, 
    metricKey, 
    metricTitle, 
    valorPorcentual, 
    datosMetrica: {
      ...datosMetrica,
      formDataSummary: formDataSummary
    }
  }, null, 2))}${formDataSummary}`;

  // Llamar a OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: promptConfig.systemMessage + "\n\nAnaliza los datos del formulario proporcionado para generar un análisis más preciso y personalizado basado en las respuestas específicas del usuario."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 2000
  });

  if (!response.choices?.[0]?.message?.content) {
    throw new Error('No se pudo obtener la respuesta de OpenAI');
  }

  let analysis;
  try {
    analysis = JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error('Error al parsear la respuesta de OpenAI: ' + error.message);
  }

  // Mantener solo 2 análisis completos activos por usuario (actual + anterior)
  const analisisExistentes = await MetricAnalysisResult.find({ userId, activo: true })
    .sort({ fechaAnalisis: -1 })
    .limit(2)
    .lean();

  // Si hay más de 1 análisis activo, marcar los análisis más antiguos como inactivos
  if (analisisExistentes.length >= 2) {
    const analisisAMarcarInactivos = await MetricAnalysisResult.find({ userId, activo: true })
      .sort({ fechaAnalisis: -1 })
      .skip(2);
    
    if (analisisAMarcarInactivos.length > 0) {
      // Obtener los IDs de los proyectos asociados a los análisis que se van a marcar como inactivos
      const proyectoIdsAMarcarInactivos = analisisAMarcarInactivos
        .map(analisis => analisis.proyectoId)
        .filter(id => id); // Filtrar IDs válidos
      
      // Marcar los proyectos asociados como inactivos
      if (proyectoIdsAMarcarInactivos.length > 0) {
        await ProyectoPublicado.updateMany(
          { _id: { $in: proyectoIdsAMarcarInactivos } },
          { activo: false }
        );
        console.log(`Marcados ${proyectoIdsAMarcarInactivos.length} proyectos como inactivos del usuario ${userId}`);
      }
      
      // Marcar los análisis antiguos como inactivos
      await MetricAnalysisResult.updateMany(
        { _id: { $in: analisisAMarcarInactivos.map(a => a._id) } },
        { activo: false }
      );
      console.log(`Marcados ${analisisAMarcarInactivos.length} análisis como inactivos del usuario ${userId}`);
    }
  }

  // Crear el proyecto asociado
  const proyecto = await ProyectoPublicado.create({
    userId,
    nombreEmpresa: empresa.nombre,
    nombreProyecto: analysis.proyectoPropuesto.nombreProyecto,
    industria: empresa.sector,
    categoriasServicioBuscado: analysis.proyectoPropuesto.areasInvolucradas,
    objetivoEmpresa: analysis.proyectoPropuesto.descripcionProyecto,
    descripcion: analysis.proyectoPropuesto.descripcionProyecto,
    estado: "aprobacion",
    presupuesto: undefined,
    plazo: undefined,
    analisisOpenAI: {
      match: analysis.proyectoPropuesto.descripcionProyecto,
      industriaMejor: empresa.sector,
      puntuacionMatch: analysis.proyectoPropuesto.estimacionMejora,
      razones: analysis.areasMejora
    }
  });

  // Guardar el análisis de la métrica
  const metricAnalysis = await MetricAnalysisResult.create({
    userId,
    metricKey,
    metricTitle,
    fechaAnalisis: new Date(),
    empresa,
    descripcionModulo: {
      objetivo: analysis.descripcionModulo,
      alcance: analysis.descripcionModulo,
      componentes: []
    },
    conclusion: {
      nivel: analysis.conclusion,
      fortalezas: analysis.fortalezas,
      areasMejora: analysis.areasMejora,
      impactoGeneral: analysis.conclusion
    },
    interpretacion: analysis.interpretacion,
    recomendaciones: analysis.recomendaciones,
    valorPorcentual,
    proyectoId: proyecto._id
  });

  return {
    metricAnalysis,
    proyecto
  };
} 