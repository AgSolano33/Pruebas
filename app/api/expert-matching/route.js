import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { matchExpertosConProyecto } from "@/services/expertMatchingService";

// POST - Realizar matching de expertos con un proyecto
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { proyectoData } = body;
    
    if (!proyectoData) {
      return NextResponse.json(
        { success: false, error: "Datos del proyecto requeridos" },
        { status: 400 }
      );
    }
    
    // Validar estructura mínima del proyecto
    if (!proyectoData.empresa || !proyectoData.analisisObjetivos) {
      return NextResponse.json(
        { success: false, error: "Estructura del proyecto inválida" },
        { status: 400 }
      );
    }
    
    console.log('Iniciando proceso de matching...');
    
    // Realizar el matching
    const resultado = await matchExpertosConProyecto(proyectoData);
    
    return NextResponse.json(resultado, { status: 200 });
    
  } catch (error) {
    console.error("Error en el matching de expertos:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Error interno del servidor" 
      },
      { status: 500 }
    );
  }
}

// GET - Obtener matches existentes
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const empresa = searchParams.get("empresa");
    const estado = searchParams.get("estado");
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;
    
    // Construir filtros
    const filtros = {};
    if (empresa) filtros.nombreEmpresa = { $regex: empresa, $options: 'i' };
    if (estado) filtros.estado = estado;
    
    const skip = (page - 1) * limit;
    
    const ExpertoMatch = (await import("@/models/ExpertoMatch")).default;
    
    const matches = await ExpertoMatch.find(filtros)
      .populate("expertoId", "nombre semblanza industrias categorias gradoExperiencia")
      .sort({ puntuacionMatch: -1, fechaCreacion: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await ExpertoMatch.countDocuments(filtros);
    
    return NextResponse.json({
      success: true,
      data: matches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error("Error al obtener matches:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 