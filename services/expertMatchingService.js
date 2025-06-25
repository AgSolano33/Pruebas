import OpenAI from "openai";
import { connectToDatabase } from "@/libs/mongodb";
import Experto from "@/models/Experto";
import ExpertoMatch from "@/models/ExpertoMatch";
import NotificacionExperto from "@/models/NotificacionExperto";
import User from "@/models/User";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Función para verificar variables de entorno
function getAssistantId() {
  const assistantId = process.env.ASSISTANT_ID;
  if (!assistantId) {
    console.error('Variables de entorno disponibles:', Object.keys(process.env).filter(key => key.includes('ASSISTANT')));
    throw new Error('ASSISTANT_ID no está configurado en las variables de entorno');
  }
  return assistantId;
}

export async function matchExpertosConProyecto(proyectoData, proyectoId = null) {
  console.log('1. Iniciando matching de expertos con proyecto...');
  console.log('Datos del proyecto:', proyectoData);

  try {
    // Conectar a MongoDB
    await connectToDatabase();
    console.log('2. Conexión a MongoDB establecida');

    // Obtener todos los expertos aprobados
    const expertos = await Experto.find({ estado: "aprobado" })
      .populate("userId", "name email image")
      .lean();

    if (expertos.length === 0) {
      console.log('No hay expertos aprobados disponibles. Creando proyecto sin matching...');
      
      // Crear un análisis básico sin expertos
      const analisisBasico = {
        match: "Proyecto publicado para búsqueda de expertos. Se realizará matching cuando haya expertos aprobados disponibles.",
        industriaMejor: proyectoData.empresa?.sector || "General",
        puntuacionMatch: 0,
        razones: ["Proyecto en espera de expertos aprobados"]
      };

      return {
        success: true,
        message: "Proyecto publicado exitosamente. Se realizará matching cuando haya expertos aprobados.",
        data: [analisisBasico],
        total: 0,
        sinExpertos: true
      };
    }

    console.log(`3. Encontrados ${expertos.length} expertos aprobados`);

    // Preparar los datos del proyecto para el análisis
    const proyectoInfo = {
      nombreEmpresa: proyectoData.empresa?.nombre || '',
      nombreProyecto: proyectoData.analisisObjetivos?.situacionActual || '',
      industria: proyectoData.empresa?.sector || '',
      categoriasServicioBuscado: proyectoData.analisisObjetivos?.recomendaciones || [],
      objetivoEmpresa: proyectoData.analisisObjetivos?.viabilidad || '',
    };

    // Preparar los datos de los expertos (sin nombres)
    const expertosInfo = expertos.map(experto => ({
      id: experto._id.toString(),
      semblanza: experto.semblanza,
      industrias: experto.industrias,
      categorias: experto.categorias,
      gradoExperiencia: experto.gradoExperiencia,
      experienciaProfesional: experto.experienciaProfesional,
      serviciosPropuestos: experto.serviciosPropuestos,
    }));

    // Crear el prompt para ChatGPT
    const prompt = `
Eres un experto en matching entre proyectos empresariales y consultores expertos. Tu tarea es analizar un proyecto y evaluar qué expertos serían los mejores matches.

INFORMACIÓN DEL PROYECTO:
- Nombre de la empresa: ${proyectoInfo.nombreEmpresa}
- Nombre del proyecto: ${proyectoInfo.nombreProyecto}
- Industria: ${proyectoInfo.industria}
- Categorías de servicio buscado: ${proyectoInfo.categoriasServicioBuscado.join(', ')}
- Objetivo de la empresa: ${proyectoInfo.objetivoEmpresa}

EXPERTO ${expertosInfo.length} EXPERTOS DISPONIBLES:
${expertosInfo.map((experto, index) => `
EXPERTO ${index + 1}:
- ID: ${experto.id}
- Semblanza: ${experto.semblanza}
- Industrias: ${experto.industrias.join(', ')}
- Categorías: ${experto.categorias}
- Grado de experiencia: ${experto.gradoExperiencia}
- Experiencia profesional: ${experto.experienciaProfesional}
- Servicios propuestos: ${experto.serviciosPropuestos}
`).join('\n')}

TAREA:
Para cada experto, evalúa si sería un buen match para el proyecto y proporciona:
1. Un análisis detallado del match (por qué es compatible o no)
2. La industria que mejor se alinea
3. Una puntuación del 0 al 100 (donde 100 es el match perfecto)

RESPONDE EN FORMATO JSON EXACTO:
{
  "matches": [
    {
      "expertoId": "ID_DEL_EXPERTO",
      "match": "Análisis detallado del match y por qué es compatible",
      "industriaMejor": "Nombre de la industria que mejor se alinea",
      "puntuacionMatch": 85,
      "razones": ["Razón 1", "Razón 2", "Razón 3"]
    }
  ]
}

IMPORTANTE:
- Solo incluye expertos que tengan un match de al menos 60 puntos
- Ordena por puntuación de mayor a menor
- Sé específico en el análisis del match
- Considera la experiencia, industrias, categorías y servicios propuestos
`;

    console.log('4. Enviando prompt a ChatGPT...');

    // Usar chat completions
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres un experto en matching entre proyectos empresariales y consultores expertos. Responde siempre en formato JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const rawResponse = completion.choices[0].message.content;
    console.log('Respuesta de chat completions:', rawResponse);

    // Limpiar la respuesta
    let cleanedResponse = rawResponse;
    if (rawResponse.includes('```json')) {
      cleanedResponse = rawResponse.replace(/```json\n|\n```/g, '');
    } else if (rawResponse.includes('```')) {
      cleanedResponse = rawResponse.replace(/```\n|\n```/g, '');
    }
    cleanedResponse = cleanedResponse.trim();

    console.log('Respuesta limpia:', cleanedResponse);

    // Procesar la respuesta
    let analysis;
    try {
      analysis = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Error al parsear JSON:', error);
      throw new Error(`Error en el formato de la respuesta: ${error.message}`);
    }

    // Validar la estructura de la respuesta
    if (!analysis.matches || !Array.isArray(analysis.matches)) {
      throw new Error('La respuesta no contiene el array de matches');
    }

    // Validar cada match
    for (const match of analysis.matches) {
      if (!match.expertoId || !match.match || !match.industriaMejor || 
          typeof match.puntuacionMatch !== 'number' || 
          match.puntuacionMatch < 0 || match.puntuacionMatch > 100) {
        throw new Error('Estructura de match inválida');
      }
    }

    console.log('5. Guardando matches en la base de datos...');

    // Guardar los matches en la base de datos
    const matchesGuardados = [];
    
    for (const matchData of analysis.matches) {
      const experto = expertos.find(e => e._id.toString() === matchData.expertoId);
      
      if (!experto) {
        console.warn(`Experto no encontrado: ${matchData.expertoId}`);
        continue;
      }

      const nuevoMatch = new ExpertoMatch({
        nombreEmpresa: proyectoInfo.nombreEmpresa,
        nombreProyecto: proyectoInfo.nombreProyecto,
        industria: proyectoInfo.industria,
        categoriasServicioBuscado: proyectoInfo.categoriasServicioBuscado,
        objetivoEmpresa: proyectoInfo.objetivoEmpresa,
        expertoId: experto._id,
        semblanza: experto.semblanza,
        industriasExperto: experto.industrias,
        categoriasExperto: experto.categorias,
        gradoExperiencia: experto.gradoExperiencia,
        experienciaProfesional: experto.experienciaProfesional,
        serviciosPropuestos: experto.serviciosPropuestos,
        match: matchData.match,
        industriaMejor: matchData.industriaMejor,
        puntuacionMatch: matchData.puntuacionMatch,
      });

      await nuevoMatch.save();
      matchesGuardados.push(nuevoMatch);
    }

    // Crear notificaciones para los expertos si se proporcionó el proyectoId
    if (proyectoId) {
      console.log('7. Creando notificaciones para expertos...');
      
      for (const matchData of analysis.matches) {
        const experto = expertos.find(e => e._id.toString() === matchData.expertoId);
        
        if (!experto) continue;

        const nuevaNotificacion = new NotificacionExperto({
          expertoId: experto._id,
          proyectoId: proyectoId,
          nombreEmpresa: proyectoInfo.nombreEmpresa,
          nombreProyecto: proyectoInfo.nombreProyecto,
          industria: proyectoInfo.industria,
          descripcionProyecto: proyectoInfo.objetivoEmpresa,
          categoriasServicioBuscado: proyectoInfo.categoriasServicioBuscado,
          puntuacionMatch: matchData.puntuacionMatch,
          industriaMejor: matchData.industriaMejor,
          razonesMatch: matchData.razones || [],
          analisisMatch: matchData.match,
        });

        await nuevaNotificacion.save();
        console.log(`Notificación creada para experto: ${experto._id}`);
      }
    }

    console.log(`6. Proceso completado. ${matchesGuardados.length} matches guardados`);

    return {
      success: true,
      message: `Matching completado exitosamente. ${matchesGuardados.length} expertos encontrados.`,
      data: matchesGuardados,
      total: matchesGuardados.length
    };

  } catch (error) {
    console.error('Error en el proceso de matching:', error);
    throw error;
  }
} 