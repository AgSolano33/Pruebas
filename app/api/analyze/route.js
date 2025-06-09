import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import Diagnosis from '@/models/Diagnosis';
import AnalysisResult from '@/models/AnalysisResult';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { diagnosisData } = await req.json();

    if (!diagnosisData || !diagnosisData.email) {
      return NextResponse.json(
        { error: 'Los datos del diagnóstico y el email son requeridos' },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Verificar si ya existe un análisis guardado para este email en AnalysisResult
    const existingAnalysisResult = await AnalysisResult.findOne({ diagnosisEmail: diagnosisData.email });

    if (existingAnalysisResult) {
      return NextResponse.json({
        ...existingAnalysisResult.toObject(),
        existingDiagnosis: true
      });
    }

    // Si no existe un análisis guardado, obtener o crear el diagnóstico original
    let diagnosisToAnalyze;
    const existingDiagnosis = await Diagnosis.findOne({ email: diagnosisData.email });

    if (existingDiagnosis) {
      diagnosisToAnalyze = existingDiagnosis;
    } else {
      // Si no existe el diagnóstico original, guardarlo primero
      const newDiagnosis = new Diagnosis({
        ...diagnosisData,
        createdAt: new Date()
      });
      await newDiagnosis.save();
      diagnosisToAnalyze = newDiagnosis;
    }

    // 2. Convertir información relevante a texto para ChatGPT y enviarla
    const evaluacionAreasText = diagnosisToAnalyze.evaluacionareas ? 
      Object.entries(diagnosisToAnalyze.evaluacionareas).map(([area, data]) => 
        `Área: ${area}, Puntos: ${data.puntos}`
      ).join('\\n') : '';

    const proyectoObjetivoText = diagnosisToAnalyze.proyectoobjetivo ? 
      `Descripción del proyecto: ${diagnosisToAnalyze.proyectoobjetivo.descripcion}, Objetivo: ${diagnosisToAnalyze.proyectoobjetivo.objetivo}` : '';

    // 3. Instruir a ChatGPT para que devuelva la respuesta en JSON
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Eres un experto analista de negocios. Analiza la siguiente información de un diagnóstico.\n\n**Información de Evaluación de Áreas:**\n${evaluacionAreasText}\n\n**Información de Proyecto y Objetivo:**\n${proyectoObjetivoText}\n\nBasado en esto, proporciona:\n1. Un resumen conciso (summary)\n2. Recomendaciones específicas (recommendations) en un array de strings\n3. Próximos pasos (nextSteps) en un array de strings\n4. Métricas porcentuales para cada área de evaluación (0-100) donde la clave es el nombre del área y el valor es el porcentaje. Suma los puntos de cada área para obtener el porcentaje. (metrics)\n\nResponde **ÚNICAMENTE** en formato JSON con la siguiente estructura:\n{\n  "summary": "resumen del análisis",\n  "recommendations": ["recomendación 1", "recomendación 2", ...],\n  "nextSteps": ["paso 1", "paso 2", ...],\n  "metrics": {\n    "NombreDelArea1": 85,\n    "NombreDelArea2": 65\n  }\n}`
        },
        {
          role: "user",
          content: `Analiza este diagnóstico:`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    // 4. Guardar el resultado del análisis de ChatGPT en la nueva colección AnalysisResult
    const newAnalysisResult = new AnalysisResult({
      diagnosisEmail: diagnosisData.email,
      metrics: analysis.metrics,
      summary: analysis.summary,
      recommendations: analysis.recommendations,
      nextSteps: analysis.nextSteps,
      createdAt: new Date()
    });

    await newAnalysisResult.save();

    return NextResponse.json({
      ...analysis,
      existingDiagnosis: false
    });

  } catch (error) {
    console.error('Error en el análisis:', error);
    return NextResponse.json(
      { error: 'Error al procesar el análisis' },
      { status: 500 }
    );
  }
} 