import { NextResponse } from "next/server";
import DiagnosticoCentral from "@/models/DiagnosticoCentral";
import connectDB from "@/libs/mongodb";
import { analyzeDiagnosticWithGPT } from "@/services/chatGPTService";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Validar que se proporcione el userId
    if (!data.userId) {
      return NextResponse.json(
        { error: "Se requiere el ID del usuario" },
        { status: 400 }
      );
    }
    
    const diagnostico = await DiagnosticoCentral.create(data);
    
    return NextResponse.json(
      { message: "Diagnóstico creado exitosamente", diagnostico },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear el diagnóstico:", error);
    return NextResponse.json(
      { error: "Error al crear el diagnóstico" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('Conectando a la base de datos...');
    await connectDB();
    console.log('Conexión exitosa a la base de datos');

    // Obtener el diagnóstico más reciente
    const diagnostico = await DiagnosticoCentral.findOne()
      .sort({ createdAt: -1 })
      .lean();

    if (!diagnostico) {
      console.log('No se encontró ningún diagnóstico');
      return NextResponse.json({ 
        success: false, 
        error: 'No se encontró ningún diagnóstico' 
      }, { status: 404 });
    }

    console.log('Diagnóstico encontrado:', JSON.stringify(diagnostico, null, 2));

    // Analizar el diagnóstico con ChatGPT
    console.log('Iniciando análisis con ChatGPT...');
    const { analysis, usage } = await analyzeDiagnosticWithGPT(diagnostico);
    console.log('Análisis completado:', JSON.stringify(analysis, null, 2));
    console.log('Uso de tokens:', usage);

    return NextResponse.json({
      success: true,
      data: {
        diagnostico,
        analysis,
        usage
      }
    });

  } catch (error) {
    console.error('Error en el endpoint de ChatGPT:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 