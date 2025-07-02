import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import Experto from "@/models/Experto";

// GET - Obtener un experto específico por ID
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID de experto requerido" },
        { status: 400 }
      );
    }
    
    const experto = await Experto.findById(id)
      .populate("userId", "name email image")
      .lean();
    
    if (!experto) {
      return NextResponse.json(
        { success: false, error: "Experto no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: experto,
    });
    
  } catch (error) {
    console.error("Error al obtener experto:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un experto
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
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID de experto requerido" },
        { status: 400 }
      );
    }
    
    // Buscar el experto
    const experto = await Experto.findById(id);
    
    if (!experto) {
      return NextResponse.json(
        { success: false, error: "Experto no encontrado" },
        { status: 404 }
      );
    }
    
    // Verificar que el usuario sea el propietario del perfil o sea admin
    if (experto.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "No tienes permisos para actualizar este perfil" },
        { status: 403 }
      );
    }
    
    // Campos permitidos para actualizar
    const camposPermitidos = [
      "nombre",
      "semblanza",
      "industrias",
      "categorias",
      "gradoExperiencia",
      "experienciaProfesional",
      "serviciosPropuestos",
      "estado",
    ];
    
    // Actualizar solo los campos permitidos
    camposPermitidos.forEach(campo => {
      if (body[campo] !== undefined) {
        experto[campo] = body[campo];
      }
    });
    
    // Resetear estado a pendiente si se actualiza (solo si no se está aprobando)
    if (experto.estado === "aprobado" && body["estado"] !== "aprobado") {
      experto.estado = "pendiente";
    }
    
    await experto.save();
    
    return NextResponse.json({
      success: true,
      message: "Perfil de experto actualizado exitosamente",
      data: experto,
    });
    
  } catch (error) {
    console.error("Error al actualizar experto:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un experto
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
        { success: false, error: "ID de experto requerido" },
        { status: 400 }
      );
    }
    
    // Buscar el experto
    const experto = await Experto.findById(id);
    
    if (!experto) {
      return NextResponse.json(
        { success: false, error: "Experto no encontrado" },
        { status: 404 }
      );
    }
    
    // Verificar que el usuario sea el propietario del perfil o sea admin
    if (experto.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "No tienes permisos para eliminar este perfil" },
        { status: 403 }
      );
    }
    
    await Experto.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: "Perfil de experto eliminado exitosamente",
    });
    
  } catch (error) {
    console.error("Error al eliminar experto:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 