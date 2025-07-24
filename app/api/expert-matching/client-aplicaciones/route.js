import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import ExpertoMatch from "@/models/ExpertoMatch";
import ProyectoPublicado from "@/models/ProyectoPublicado";

// GET - Obtener aplicaciones que recibió un cliente
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    const limit = parseInt(searchParams.get('limit')) || 50;
    
    // Obtener los proyectos del cliente
    const proyectosCliente = await ProyectoPublicado.find({ 
      userId: session.user.id 
    }).select('_id nombreEmpresa nombreProyecto');
    
    if (proyectosCliente.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      });
    }
    
    // Construir filtros para las aplicaciones
    const filtros = {
      nombreEmpresa: { $in: proyectosCliente.map(p => p.nombreEmpresa) },
      nombreProyecto: { $in: proyectosCliente.map(p => p.nombreProyecto) }
    };
    
    // Agregar filtro de estado si se especifica
    if (estado && estado !== 'todos') {
      filtros.estado = estado;
    }
    
    // Obtener aplicaciones que coincidan con los proyectos del cliente
    const aplicaciones = await ExpertoMatch.find(filtros)
      .sort({ fechaCreacion: -1 })
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      success: true,
      data: aplicaciones,
      total: aplicaciones.length
    });
    
  } catch (error) {
    console.error("Error al obtener aplicaciones del cliente:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 