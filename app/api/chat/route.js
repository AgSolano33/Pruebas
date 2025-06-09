import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, type, diagnosisData } = await req.json();

    if (type === 'analyze_diagnosis') {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Eres un experto analista de negocios. Analiza el siguiente diagnóstico y proporciona:
            1. Un resumen conciso
            2. Recomendaciones específicas
            3. Próximos pasos
            4. Métricas porcentuales para cada categoría (0-100)
            
            Responde en formato JSON con la siguiente estructura:
            {
              "summary": "resumen del análisis",
              "recommendations": ["recomendación 1", "recomendación 2", ...],
              "nextSteps": ["paso 1", "paso 2", ...],
              "metrics": {
                "category1": 85,
                "category2": 65,
                ...
              }
            }`
          },
          {
            role: "user",
            content: JSON.stringify(diagnosisData)
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = JSON.parse(completion.choices[0].message.content);
      return NextResponse.json(response);
    }

    // Chat normal
    if (!message) {
      return NextResponse.json(
        { error: 'El mensaje es requerido' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un asistente experto en consultoría empresarial, especializado en ayudar a emprendedores y empresas a resolver sus desafíos y alcanzar sus objetivos."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      response: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('Error en la API de chat:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 