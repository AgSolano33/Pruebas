import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import ProyectoPublicado from "@/models/ProyectoPublicado";
import { matchExpertosConProyecto } from "@/services/expertMatchingService";

// POST - Publicar un proyecto y realizar matching con expertos
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
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
    
    console.log('Iniciando publicación de proyecto...');
    
    // Crear el proyecto publicado primero
    const proyectoInfo = {
      nombreEmpresa: proyectoData.empresa?.nombre || '',
      nombreProyecto: proyectoData.analisisObjetivos?.situacionActual || '',
      industria: proyectoData.empresa?.sector || '',
      categoriasServicioBuscado: proyectoData.analisisObjetivos?.recomendaciones || [],
      objetivoEmpresa: proyectoData.analisisObjetivos?.viabilidad || '',
    };
    
    const nuevoProyecto = new ProyectoPublicado({
      userId: session.user.id,
      nombreEmpresa: proyectoInfo.nombreEmpresa,
      nombreProyecto: proyectoInfo.nombreProyecto,
      industria: proyectoInfo.industria,
      categoriasServicioBuscado: proyectoInfo.categoriasServicioBuscado,
      objetivoEmpresa: proyectoInfo.objetivoEmpresa,
      analisisOpenAI: {
        match: "Proyecto publicado para búsqueda de expertos",
        industriaMejor: proyectoInfo.industria,
        puntuacionMatch: 0,
        razones: ["Proyecto en espera de expertos aprobados"],
      },
      matchesGenerados: 0,
      estado: "en_espera",
    });
    
    await nuevoProyecto.save();
    
    // Realizar el matching con expertos usando el ID del proyecto creado
    const resultadoMatching = await matchExpertosConProyecto(proyectoData, nuevoProyecto._id);
    
    if (!resultadoMatching.success) {
      return NextResponse.json(
        { success: false, error: "Error en el matching de expertos" },
        { status: 500 }
      );
    }
    
    // Actualizar el proyecto con el análisis del mejor match
    const mejorMatch = resultadoMatching.data[0];
    
    nuevoProyecto.analisisOpenAI = {
      match: mejorMatch?.match || "Proyecto publicado para búsqueda de expertos",
      industriaMejor: mejorMatch?.industriaMejor || proyectoInfo.industria,
      puntuacionMatch: mejorMatch?.puntuacionMatch || 0,
      razones: mejorMatch?.razones || ["Proyecto en espera de expertos aprobados"],
    };
    nuevoProyecto.matchesGenerados = resultadoMatching.total || 0;
    nuevoProyecto.estado = resultadoMatching.sinExpertos ? "en_espera" : "publicado";
    
    await nuevoProyecto.save();
    
    const mensaje = resultadoMatching.sinExpertos 
      ? "Proyecto publicado exitosamente. Se realizará matching cuando haya expertos aprobados."
      : `Proyecto publicado exitosamente. ${resultadoMatching.total} expertos encontrados.`;
    
    return NextResponse.json({
      success: true,
      message: mensaje,
      data: nuevoProyecto,
      matches: resultadoMatching.data,
      sinExpertos: resultadoMatching.sinExpertos || false,
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error al publicar proyecto:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Error interno del servidor" 
      },
      { status: 500 }
    );
  }
}

// GET - Obtener proyectos publicados
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
    const estado = searchParams.get("estado");
    const industria = searchParams.get("industria");
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;
    const allProjects = searchParams.get("allProjects") === "true";
    
    // Construir filtros
    const filtros = {};
    
    // Solo filtrar por userId si no se solicita todos los proyectos (para expertos)
    if (!allProjects) {
      filtros.userId = session.user.id;
    }
    
    if (estado) filtros.estado = estado;
    if (industria) filtros.industria = { $regex: industria, $options: 'i' };
    
    const skip = (page - 1) * limit;
    
    const proyectos = await ProyectoPublicado.find(filtros)
      .populate("userId", "name email image")
      .sort({ fechaPublicacion: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await ProyectoPublicado.countDocuments(filtros);
    
    return NextResponse.json({
      success: true,
      data: proyectos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error("Error al obtener proyectos publicados:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 

// PUT - Actualizar estado del proyecto
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const body = await request.json();
    const { proyectoId, nuevoEstado } = body;
    
    if (!proyectoId || !nuevoEstado) {
      return NextResponse.json(
        { success: false, error: "ID del proyecto y nuevo estado son requeridos" },
        { status: 400 }
      );
    }
    
    // Verificar que el proyecto pertenece al usuario
    const proyecto = await ProyectoPublicado.findOne({
      _id: proyectoId,
      userId: session.user.id
    });
    
    if (!proyecto) {
      return NextResponse.json(
        { success: false, error: "Proyecto no encontrado o no autorizado" },
        { status: 404 }
      );
    }
    
    // Validar que el nuevo estado es válido
    const estadosValidos = ["publicado", "en_espera", "en_proceso", "completado", "cancelado"];
    if (!estadosValidos.includes(nuevoEstado)) {
      return NextResponse.json(
        { success: false, error: "Estado no válido" },
        { status: 400 }
      );
    }
    
    // Actualizar el estado del proyecto
    proyecto.estado = nuevoEstado;
    await proyecto.save();
    
    return NextResponse.json({
      success: true,
      message: `Proyecto ${nuevoEstado} exitosamente`,
      data: proyecto
    });
    
  } catch (error) {
    console.error("Error al actualizar proyecto:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 