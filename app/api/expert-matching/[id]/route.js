import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import ExpertoMatch from "@/models/ExpertoMatch";

// GET - Obtener un match específico
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID de match requerido" },
        { status: 400 }
      );
    }
    
    const match = await ExpertoMatch.findById(id)
      .populate("expertoId", "nombre semblanza industrias categorias gradoExperiencia")
      .lean();
    
    if (!match) {
      return NextResponse.json(
        { success: false, error: "Match no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: match,
    });
    
  } catch (error) {
    console.error("Error al obtener match:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar estado de un match
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const { id } = params;
    const body = await request.json();
    const { estado } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID de match requerido" },
        { status: 400 }
      );
    }
    
    if (!estado || !["pendiente", "aceptado", "rechazado", "contactado"].includes(estado)) {
      return NextResponse.json(
        { success: false, error: "Estado válido requerido" },
        { status: 400 }
      );
    }
    
    // Buscar el match
    const match = await ExpertoMatch.findById(id);
    
    if (!match) {
      return NextResponse.json(
        { success: false, error: "Match no encontrado" },
        { status: 404 }
      );
    }
    
    // Actualizar estado
    match.estado = estado;
    await match.save();
    
    return NextResponse.json({
      success: true,
      message: "Estado del match actualizado exitosamente",
      data: match,
    });
    
  } catch (error) {
    console.error("Error al actualizar match:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un match
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID de match requerido" },
        { status: 400 }
      );
    }
    
    // Buscar el match
    const match = await ExpertoMatch.findById(id);
    
    if (!match) {
      return NextResponse.json(
        { success: false, error: "Match no encontrado" },
        { status: 404 }
      );
    }
    
    await ExpertoMatch.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: "Match eliminado exitosamente",
    });
    
  } catch (error) {
    console.error("Error al eliminar match:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 