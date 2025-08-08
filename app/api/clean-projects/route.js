import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import ProyectoPublicado from "@/models/ProyectoPublicado";

// POST - Eliminar todos los proyectos
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
    
    // Eliminar todos los proyectos existentes
    const deleteResult = await ProyectoPublicado.deleteMany({});
    console.log(`Eliminados ${deleteResult.deletedCount} proyectos existentes`);
    
    return NextResponse.json({
      success: true,
      message: `Se eliminaron ${deleteResult.deletedCount} proyectos exitosamente.`,
      data: {
        eliminados: deleteResult.deletedCount
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error en la limpieza de proyectos:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Error interno del servidor" 
      },
      { status: 500 }
    );
  }
} 