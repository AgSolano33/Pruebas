import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { matchExpertosConProyecto } from "@/services/expertMatchingService";
import { connectToDatabase } from "@/libs/mongodb";
import ExpertoMatch from "@/models/ExpertoMatch";
import NotificacionExperto from "@/models/NotificacionExperto";

// POST - Realizar matching de expertos con un proyecto o aplicar a un proyecto
export async function POST(request) {
  try {
    // Para el MVP, no requerimos autenticación
    // const session = await getServerSession(authOptions);
    
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: "No autorizado" },
    //     { status: 401 }
    //   );
    // }
    
    await connectToDatabase();
    const body = await request.json();
    
    // Si es una aplicación a un proyecto
    if (body.accion === "aplicar") {
      return await handleAplicarProyecto(body, session);
    }
    
    // Si es matching de expertos (código original)
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

// Función para manejar la aplicación a un proyecto
async function handleAplicarProyecto(body, session) {
  const { proyectoId, expertoId } = body;
  
  if (!proyectoId || !expertoId) {
    return NextResponse.json(
      { success: false, error: "Faltan parámetros requeridos" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    
    // Verificar si ya existe una aplicación
    const aplicacionExistente = await ExpertoMatch.findOne({
      proyectoId,
      expertoId,
      estado: { $in: ["pendiente", "aceptado"] }
    });

    if (aplicacionExistente) {
      return NextResponse.json(
        { success: false, error: "Ya has aplicado a este proyecto" },
        { status: 400 }
      );
    }

    // Crear nueva aplicación
    const nuevaAplicacion = new ExpertoMatch({
      proyectoId,
      expertoId,
      estado: "pendiente",
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });

    await nuevaAplicacion.save();

    // Crear notificación para el cliente
    const notificacion = new NotificacionExperto({
      tipo: "nueva_aplicacion",
      titulo: "Nueva aplicación recibida",
      mensaje: `Un experto ha aplicado a tu proyecto`,
      proyectoId,
      expertoId,
      leida: false,
      fechaCreacion: new Date()
    });

    await notificacion.save();

    return NextResponse.json({
      success: true,
      message: "Aplicación enviada exitosamente",
      data: nuevaAplicacion
    });

  } catch (error) {
    console.error("Error al aplicar al proyecto:", error);
    return NextResponse.json(
      { success: false, error: "Error al procesar la aplicación" },
      { status: 500 }
    );
  }
}

// GET - Obtener matches existentes
export async function GET(request) {
  try {
    // Para el MVP, no requerimos autenticación
    // const session = await getServerSession(authOptions);
    
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: "No autorizado" },
    //     { status: 401 }
    //   );
    // }
    
    const { searchParams } = new URL(request.url);
    const empresa = searchParams.get("empresa");
    const estado = searchParams.get("estado");
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;
    
    // Construir filtros
    const filtros = {};
    if (empresa) filtros.nombreEmpresa = { $regex: empresa, $options: 'i' };
    if (estado) filtros.estado = estado;
    
    // Para el MVP, retornamos datos mock
    const mockMatches = [
      {
        _id: "match_001",
        proyectoId: "proyecto_001",
        expertoId: {
          _id: "pedro_001",
          nombre: "Pedro García",
          semblanza: "Experto en servicios digitales",
          industrias: ["Tecnología", "Consultoría"],
          categorias: "Servicios Digitales,Negocios,STEAM",
          gradoExperiencia: "Senior"
        },
        puntuacionMatch: 85,
        estado: "pendiente",
        fechaCreacion: new Date().toISOString()
      }
    ];
    
    return NextResponse.json({
      success: true,
      data: mockMatches,
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        pages: 1,
      },
    });
    
  } catch (error) {
    console.error("Error en GET expert-matching:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Error interno del servidor" 
      },
      { status: 500 }
    );
  }
} 