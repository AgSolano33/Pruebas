import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import DiagnosticoCentral from "@/models/DiagnosticoCentral";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    await connectToDatabase();
    
    let query = {};
    if (userId) {
      query.userId = userId;
    }
    
    // Obtener todos los diagnósticos centrales
    const diagnosticos = await DiagnosticoCentral.find(query)
      .sort({ createdAt: -1 })
      .select('userId email createdAt')
      .lean();

    console.log('Diagnósticos centrales encontrados:', diagnosticos.length);
    diagnosticos.forEach(diagnostico => {
      console.log(`- userId: ${diagnostico.userId}, email: ${diagnostico.email}, fecha: ${diagnostico.createdAt}`);
    });

    return NextResponse.json({
      success: true,
      count: diagnosticos.length,
      data: diagnosticos
    });
  } catch (error) {
    console.error('Error al listar diagnósticos centrales:', error);
    return NextResponse.json({
      success: false,
      error: error.message || "Error al listar diagnósticos centrales"
    }, { status: 500 });
  }
} 