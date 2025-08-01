import OpenAI from "openai";
import { connectToDatabase } from "@/libs/mongodb";
import MetricGeneralAnalysis from "@/models/MetricGeneralAnalysis";
import MetricAnalysisResult from "@/models/MetricAnalysisResult";
import ProyectoPublicado from "@/models/ProyectoPublicado";
import promptConfig from "@/scripts/metricGeneralPrompt.json";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY no está configurada en las variables de entorno");
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function analyzeGeneralMetrics({ userId, empresa }) {
  await connectToDatabase();

  // Obtener todas las métricas analizadas del usuario
  const metricasAnalizadas = await MetricAnalysisResult.find({ 
    userId 
  }).sort({ createdAt: -1 });

  if (metricasAnalizadas.length === 0) {
    throw new Error("No se encontraron métricas analizadas para este usuario");
  }

  // Preparar los datos para el análisis
  const metricasData = metricasAnalizadas.map(metrica => ({
    metricKey: metrica.metricKey,
    metricTitle: metrica.metricTitle,
    valorPorcentual: metrica.valorPorcentual,
    interpretacion: metrica.interpretacion,
    conclusion: metrica.conclusion,
    recomendaciones: metrica.recomendaciones,
    fechaAnalisis: metrica.fechaAnalisis
  }));

  // Construir el prompt con los datos de todas las métricas
  const jsonStructureString = JSON.stringify(promptConfig.jsonStructure, null, 2);
  const instructionsString = promptConfig.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n');
  
  const prompt = `${promptConfig.userPrompt}\n\n${jsonStructureString}\n\nAsegúrate de que:\n${instructionsString}\n\nIMPORTANTE: ${promptConfig.importantNote}\n\nEjemplo:\n${JSON.stringify(promptConfig.example, null, 2)}\n\n${promptConfig.dataPlaceholder.replace('{dataForAnalysis}', JSON.stringify({ 
    empresa, 
    metricasAnalizadas: metricasData,
    totalMetricas: metricasData.length,
    resumenMetricas: metricasData.map(m => ({
      area: m.metricKey,
      titulo: m.metricTitle,
      puntuacion: m.valorPorcentual,
      interpretacion: m.interpretacion
    }))
  }, null, 2))}`;

  // Llamar a OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: promptConfig.systemMessage + "\n\nAnaliza todas las métricas proporcionadas para generar un análisis integral que identifique patrones transversales y oportunidades de mejora holísticas."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 3000
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

  // Mantener solo 2 análisis generales activos por usuario (actual + anterior)
  const analisisGeneralesExistentes = await MetricGeneralAnalysis.find({ userId, activo: true })
    .sort({ createdAt: -1 })
    .limit(2)
    .lean();

  // Si hay más de 1 análisis general activo, marcar los análisis más antiguos como inactivos
  if (analisisGeneralesExistentes.length >= 2) {
    const analisisAMarcarInactivos = await MetricGeneralAnalysis.find({ userId, activo: true })
      .sort({ createdAt: -1 })
      .skip(2);
    
    if (analisisAMarcarInactivos.length > 0) {
      // Obtener los IDs de los proyectos asociados a los análisis que se van a marcar como inactivos
      const proyectoIdsAMarcarInactivos = analisisAMarcarInactivos
        .flatMap(analisis => analisis.proyectosIntegrales || [])
        .map(proyecto => proyecto.proyectoId)
        .filter(id => id); // Filtrar IDs válidos
      
      // Marcar los proyectos asociados como inactivos
      if (proyectoIdsAMarcarInactivos.length > 0) {
        await ProyectoPublicado.updateMany(
          { _id: { $in: proyectoIdsAMarcarInactivos } },
          { activo: false }
        );
        console.log(`Marcados ${proyectoIdsAMarcarInactivos.length} proyectos como inactivos del usuario ${userId}`);
      }
      
      // Marcar los análisis generales antiguos como inactivos
      await MetricGeneralAnalysis.updateMany(
        { _id: { $in: analisisAMarcarInactivos.map(a => a._id) } },
        { activo: false }
      );
      console.log(`Marcados ${analisisAMarcarInactivos.length} análisis generales como inactivos del usuario ${userId}`);
    }
  }

  // Crear proyectos para cada proyecto integral identificado
  const proyectosCreados = [];
  for (const proyectoIntegral of analysis.proyectosIntegrales) {
    const proyecto = await ProyectoPublicado.create({
      userId,
      nombreEmpresa: empresa.nombre,
      nombreProyecto: proyectoIntegral.nombreProyecto,
      industria: empresa.sector,
      categoriasServicioBuscado: proyectoIntegral.areasInvolucradas,
      objetivoEmpresa: proyectoIntegral.descripcionProyecto,
      descripcion: proyectoIntegral.descripcionProyecto,
      estado: "aprobacion",
      presupuesto: undefined,
      plazo: undefined,
      analisisOpenAI: {
        match: proyectoIntegral.descripcionProyecto,
        industriaMejor: empresa.sector,
        puntuacionMatch: proyectoIntegral.estimacionMejora,
        razones: proyectoIntegral.areasInvolucradas
      }
    });
    proyectosCreados.push(proyecto);
  }

  // Actualizar los proyectos integrales con los IDs de los proyectos creados
  const proyectosIntegralesActualizados = analysis.proyectosIntegrales.map((proyecto, index) => ({
    ...proyecto,
    proyectoId: proyectosCreados[index]?._id
  }));

  // Guardar el análisis general
  const generalAnalysis = await MetricGeneralAnalysis.create({
    userId,
    empresa,
    analisisGeneral: analysis.analisisGeneral,
    conclusionesPorArea: analysis.conclusionesPorArea,
    proyectosIntegrales: proyectosIntegralesActualizados,
    expertosRecomendados: analysis.expertosRecomendados,
    serviciosIntegrales: analysis.serviciosIntegrales,
    recomendacionesEstrategicas: analysis.recomendacionesEstrategicas,
    metricasAnalizadas: metricasData.map(m => ({
      metricKey: m.metricKey,
      metricTitle: m.metricTitle,
      valorPorcentual: m.valorPorcentual,
      fechaAnalisis: m.fechaAnalisis
    }))
  });

  return {
    generalAnalysis,
    proyectosCreados,
    metricasAnalizadas: metricasData.length
  };
}

export async function getGeneralAnalysis(userId) {
  await connectToDatabase();
  
  const analysis = await MetricGeneralAnalysis.findOne({ 
    userId 
  }).sort({ createdAt: -1 }).populate('proyectosIntegrales.proyectoId');

  return analysis;
} 