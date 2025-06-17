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

// Verificar que el asistente existe usando fetch directamente
async function verifyAssistantDirectly() {
  try {
    console.log('Verificando asistente directamente...');
    const response = await fetch(`https://api.openai.com/v1/assistants/${ASSISTANT_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error en la respuesta:', error);
      throw new Error(`Error al verificar el asistente: ${error.error?.message || 'Error desconocido'}`);
    }

    const assistant = await response.json();
    console.log('Asistente verificado:', {
      id: assistant.id,
      name: assistant.name,
      model: assistant.model,
      instructions: assistant.instructions
    });
    return true;
  } catch (error) {
    console.error('Error al verificar el asistente:', error);
    throw new Error(`El asistente con ID ${ASSISTANT_ID} no existe o no tienes acceso a él. Asegúrate de que la API key y el ID del asistente pertenezcan a la misma cuenta.`);
  }
}

export async function analyzeDiagnosticWithGPT(diagnosticData, userId) {
  console.log('1. Iniciando análisis con ChatGPT...');
  console.log('Datos del diagnóstico:', diagnosticData);

  // Inicializar variables fuera del try para poder acceder en el finally
  let threadId = null;
  let runId = null;
  let mongoose = null;

  try {
    // Conectar a MongoDB
    mongoose = await connectToDatabase();
    console.log('2. Conexión a MongoDB establecida');

    // Crear un thread para el análisis
    console.log('3. Creando thread en OpenAI...');
    try {
      const threadResponse = await openai.beta.threads.create();
      console.log('Respuesta completa al crear thread:', JSON.stringify(threadResponse, null, 2));
      
      if (!threadResponse) {
        throw new Error('La respuesta al crear el thread está vacía');
      }
      
      if (!threadResponse.id) {
        throw new Error(`El thread no tiene ID. Respuesta completa: ${JSON.stringify(threadResponse)}`);
      }
      
      if (!threadResponse.id.startsWith('thread_')) {
        throw new Error(`ID de thread inválido: ${threadResponse.id}`);
      }
      
      threadId = threadResponse.id;
      console.log('Thread creado exitosamente:', threadId);
    } catch (error) {
      console.error('Error al crear el thread:', error);
      throw new Error(`Error al crear el thread: ${error.message}`);
    }

    // Agregar el mensaje con los datos del diagnóstico
    console.log('4. Agregando mensaje al thread...');
    console.log('Usando threadId:', threadId);
    
    const prompt = `
Analiza el siguiente diagnóstico y proporciona la respuesta en el siguiente formato JSON estricto:

{
  "1. Situacion actual de la empresa y objetivos": {
    "Diagnostico general": "La empresa 'nombreEmpresa' ",
    "Retos principales": "string",
    "Objetivos": "string"
  },
  "2. Posibles soluciones": [
    {
      "Solucion": "string",
      "Herramientas": ["string"]
    }
  ],
  "3. Categorias de proyecto": {
    "Industry": ["string"],
    "Categorias de servicio buscado": ["string"],
    "Objetivos de la empresa": ["string"]
  },
  "4. Posibles matches": [
    {
      "Titulo solucion propuesta": "string",
      "Descripcion": "string"
    }
  ]
}

Asegúrate de que:
1. Todos los campos estén presentes
2. Los arrays contengan al menos un elemento
3. Los strings no estén vacíos
4. Mantén el formato exacto de los nombres de los campos
5. Reemplaza [nombreEmpresa] con el nombre real de la empresa del diagnóstico
6. Que toda la informacion este en español.

Datos del diagnóstico a analizar:
${JSON.stringify(diagnosticData, null, 2)}
`;

    const messageResponse = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: prompt
    });
    
    if (!messageResponse || !messageResponse.id) {
      throw new Error('No se pudo agregar el mensaje al thread');
    }
    
    console.log('Mensaje agregado:', messageResponse.id);

    // Ejecutar el asistente y esperar la respuesta
    console.log('5. Ejecutando asistente y esperando respuesta...');
    console.log('Usando threadId antes de createAndPoll:', threadId);
    
    try {
      // Usar createAndPoll para manejar la ejecución y espera automáticamente
      const run = await openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: ASSISTANT_ID,
      });
      
      console.log('Run object after createAndPoll:', run);
      console.log('ThreadId after createAndPoll:', threadId);
      
      if (!run || !run.id) {
        throw new Error('No se pudo iniciar o completar el run en OpenAI');
      }
      
      runId = run.id;
      console.log('Run completado exitosamente:', runId);
      
      if (run.status === "failed") {
        throw new Error(`Error en la ejecución del asistente: ${run.last_error?.message}`);
      } else if (run.status === "cancelled") {
        throw new Error('La ejecución del asistente fue cancelada');
      } else if (run.status === "expired") {
        throw new Error('La ejecución del asistente expiró');
      }
    } catch (error) {
      console.error('Error durante la ejecución del asistente:', error);
      throw new Error(`Error al ejecutar el asistente: ${error.message}`);
    }

    // Obtener los mensajes del thread
    console.log('6. Obteniendo respuesta del asistente...');
    console.log('Usando threadId antes de messages.list:', threadId);
    
    if (!threadId || !threadId.startsWith('thread_')) {
      throw new Error(`Thread ID inválido al obtener mensajes: ${threadId}`);
    }
    
    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0];
    
    if (!lastMessage || !lastMessage.content || !lastMessage.content[0] || !lastMessage.content[0].text) {
      throw new Error('No se pudo obtener la respuesta del asistente');
    }
    
    const rawResponse = lastMessage.content[0].text.value;
    console.log('Respuesta recibida:', rawResponse);

    // Limpiar la respuesta antes de parsearla como JSON
    let cleanedResponse = rawResponse;
    
    // Eliminar bloques de código markdown si existen
    if (rawResponse.includes('```json')) {
      cleanedResponse = rawResponse.replace(/```json\n|\n```/g, '');
    } else if (rawResponse.includes('```')) {
      cleanedResponse = rawResponse.replace(/```\n|\n```/g, '');
    }
    
    // Eliminar espacios en blanco al inicio y final
    cleanedResponse = cleanedResponse.trim();
    
    console.log('Respuesta limpia:', cleanedResponse);

    // Procesar la respuesta
    let analysis;
    try {
      analysis = JSON.parse(cleanedResponse);
      
      // Validar la estructura de la respuesta
      const requiredStructure = {
        "1. Situacion actual de la empresa y objetivos": {
          "Diagnostico general": "string",
          "Retos principales": "string",
          "Objetivos": "string"
        },
        "2. Posibles soluciones": "array",
        "3. Categorias de proyecto": {
          "Industria": "array",
          "Categorias de servicio buscado": "array",
          "Objetivos de la empresa": "array"
        },
        "4. Posibles matches": "array"
      };

      // Validar que todos los campos requeridos existan
      for (const [key, value] of Object.entries(requiredStructure)) {
        if (!analysis[key]) {
          throw new Error(`Falta el campo requerido: ${key}`);
        }
      }

      // Validar la estructura de las soluciones
      if (!Array.isArray(analysis["2. Posibles soluciones"]) || 
          analysis["2. Posibles soluciones"].length === 0) {
        throw new Error("El campo '2. Posibles soluciones' debe ser un array no vacío");
      }

      // Validar la estructura de los matches
      if (!Array.isArray(analysis["4. Posibles matches"]) || 
          analysis["4. Posibles matches"].length === 0) {
        throw new Error("El campo '4. Posibles matches' debe ser un array no vacío");
      }

    } catch (error) {
      console.error('Error al validar la respuesta:', error);
      throw new Error(`Error en el formato de la respuesta: ${error.message}`);
    }

    // Guardar el resultado en la base de datos
    const result = await mongoose.connection.db.collection('diagnoses').insertOne({
      ...analysis,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      email: analysis.email || undefined
    });

    console.log('8. Resultado guardado en la base de datos');

    return {
      ...analysis,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error en el análisis:', error);
    throw new Error(`Error al analizar el diagnóstico: ${error.message}`);
  } finally {
    // Limpiar recursos si es necesario
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

// Función de prueba para el nuevo formato
async function testNewDiagnosisFormat(testData) {
  try {
    console.log('Iniciando prueba de diagnóstico...');
    const result = await analyzeDiagnosticWithGPT(testData, 'test_user_id');
    console.log('Diagnóstico de prueba completado exitosamente');
    return result;
  } catch (error) {
    console.error('Error en la prueba de diagnóstico:', error);
    throw error;
  }
}

// Exportar solo la función de prueba
export { testNewDiagnosisFormat }; 