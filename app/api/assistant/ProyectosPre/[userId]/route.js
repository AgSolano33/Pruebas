import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import ProyectoPre from "@/models/proyectosPreAST";

/**
 * Soporta:
 *  - /api/assistant/ProyectosPre/[userId]?publicado=true&limit=10
 *  - /api/assistant/ProyectosPre?userId=...&publicado=true&limit=10
 */
export async function GET(req, ctx) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // 1) userId desde segmento dinámico o query
    const userIdFromPath = ctx?.params?.userId;
    const userIdFromQuery = searchParams.get("userId");
    const userId = (userIdFromPath || userIdFromQuery || "").trim();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId es requerido" },
        { status: 400 }
      );
    }

    // 2) Otros filtros opcionales
    const prediagnosticoId = searchParams.get("prediagnosticoId");
    const publicadoParam = searchParams.get("publicado"); // "true" | "false" | null
    const estadoParam = searchParams.get("estado");
    const limitParam = Number(searchParams.get("limit") || 0);

    // 3) Construir filtro
    const filter = { userId };
    if (prediagnosticoId) filter.prediagnosticoId = prediagnosticoId;
    if (publicadoParam === "true") filter.publicado = true;
    if (publicadoParam === "false") filter.publicado = false;
    if (estadoParam) filter.estado = estadoParam;

    // 4) Query
    let query = ProyectoPre.find(filter).sort({ fechaActualizacion: -1 });
    if (limitParam > 0) query = query.limit(limitParam);

    const proyectos = await query.lean();

    return NextResponse.json({
      success: true,
      count: Array.isArray(proyectos) ? proyectos.length : 0,
      proyectos,
    });
  } catch (err) {
    console.error("[GET ProyectosPre] error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar estado de un proyecto
export async function PUT(req, ctx) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const userIdFromPath = ctx?.params?.userId;
    const userIdFromQuery = searchParams.get("userId");
    const userId = (userIdFromPath || userIdFromQuery || "").trim();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId es requerido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { proyectoId, nuevoEstado, datosAdicionales } = body;

    if (!proyectoId || !nuevoEstado) {
      return NextResponse.json(
        { success: false, error: "proyectoId y nuevoEstado son requeridos" },
        { status: 400 }
      );
    }

    // Validar que el nuevo estado es válido
    const estadosValidos = ["publicado", "en_espera", "en_proceso", "completado", "cancelado", "aprobacion"];
    if (!estadosValidos.includes(nuevoEstado)) {
      return NextResponse.json(
        { success: false, error: "Estado no válido. Estados válidos: " + estadosValidos.join(", ") },
        { status: 400 }
      );
    }

    // Buscar el proyecto
    const proyecto = await ProyectoPre.findOne({
      _id: proyectoId,
      userId: userId
    });

    if (!proyecto) {
      return NextResponse.json(
        { success: false, error: "Proyecto no encontrado o no autorizado" },
        { status: 404 }
      );
    }

    // Actualizar el estado y datos adicionales
    const updateData = {
      estado: nuevoEstado,
      fechaActualizacion: new Date()
    };

    // Si se está publicando, actualizar fecha de publicación y publicado
    if (nuevoEstado === "publicado") {
      updateData.publicado = true;
      updateData.fechaPublicacion = new Date();
    } else if (nuevoEstado === "cancelado" || nuevoEstado === "completado") {
      updateData.publicado = false;
    }

    // Agregar datos adicionales si se proporcionan
    if (datosAdicionales) {
      Object.assign(updateData, datosAdicionales);
    }

    const proyectoActualizado = await ProyectoPre.findByIdAndUpdate(
      proyectoId,
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Proyecto ${nuevoEstado} exitosamente`,
      data: proyectoActualizado
    });

  } catch (err) {
    console.error("[PUT ProyectosPre] error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
