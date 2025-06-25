import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import NotificacionExperto from "@/models/NotificacionExperto";
import Experto from "@/models/Experto";

// GET - Obtener notificaciones del experto
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
    
    // Verificar que el usuario sea un experto
    const experto = await Experto.findOne({ userId: session.user.id });
    
    if (!experto) {
      return NextResponse.json(
        { success: false, error: "No eres un experto registrado" },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado");
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;
    
    // Construir filtros
    const filtros = { expertoId: experto._id };
    if (estado) filtros.estado = estado;
    
    const skip = (page - 1) * limit;
    
    const notificaciones = await NotificacionExperto.find(filtros)
      .populate("proyectoId", "nombreEmpresa nombreProyecto industria")
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await NotificacionExperto.countDocuments(filtros);
    
    // Contar notificaciones por estado
    const estadisticas = await NotificacionExperto.aggregate([
      { $match: { expertoId: experto._id } },
      { $group: { _id: "$estado", count: { $sum: 1 } } }
    ]);
    
    const estadisticasPorEstado = {};
    estadisticas.forEach(stat => {
      estadisticasPorEstado[stat._id] = stat.count;
    });
    
    return NextResponse.json({
      success: true,
      data: notificaciones,
      estadisticas: estadisticasPorEstado,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar estado de notificación (marcar como vista, aceptar, rechazar)
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
    
    // Verificar que el usuario sea un experto
    const experto = await Experto.findOne({ userId: session.user.id });
    
    if (!experto) {
      return NextResponse.json(
        { success: false, error: "No eres un experto registrado" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { notificacionId, estado, respuesta } = body;
    
    if (!notificacionId || !estado) {
      return NextResponse.json(
        { success: false, error: "ID de notificación y estado requeridos" },
        { status: 400 }
      );
    }
    
    // Verificar que la notificación pertenezca al experto
    const notificacion = await NotificacionExperto.findOne({
      _id: notificacionId,
      expertoId: experto._id
    });
    
    if (!notificacion) {
      return NextResponse.json(
        { success: false, error: "Notificación no encontrada" },
        { status: 404 }
      );
    }
    
    // Actualizar la notificación
    notificacion.estado = estado;
    
    if (respuesta && (estado === "aceptada" || estado === "rechazada")) {
      notificacion.respuestaExperto = {
        ...notificacion.respuestaExperto,
        ...respuesta
      };
    }
    
    await notificacion.save();
    
    return NextResponse.json({
      success: true,
      message: "Notificación actualizada exitosamente",
      data: notificacion,
    });
    
  } catch (error) {
    console.error("Error al actualizar notificación:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 