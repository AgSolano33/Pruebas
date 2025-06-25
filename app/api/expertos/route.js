import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import Experto from "@/models/Experto";

// GET - Obtener todos los expertos o verificar perfil del usuario actual
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const checkProfile = searchParams.get('checkProfile');
    
    // Si se solicita verificar el perfil del usuario actual
    if (checkProfile === 'true') {
      const session = await getServerSession(authOptions);
      
      if (!session) {
        return NextResponse.json(
          { success: false, error: "No autorizado" },
          { status: 401 }
        );
      }
      
      const experto = await Experto.findOne({ userId: session.user.id }).lean();
      
      return NextResponse.json({
        success: true,
        hasProfile: !!experto,
        data: experto
      });
    }
    
    // Obtener todos los expertos (funcionalidad original)
    const expertos = await Experto.find({})
      .populate("userId", "name email image")
      .sort({ fechaCreacion: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: expertos,
      total: expertos.length
    });
  } catch (error) {
    console.error("Error al obtener expertos:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo experto
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
    const {
      nombre,
      semblanza,
      industrias,
      categorias,
      gradoExperiencia,
      experienciaProfesional,
      serviciosPropuestos,
    } = body;
    
    // Validar campos requeridos
    if (!nombre || !semblanza || !industrias || !categorias || 
        !gradoExperiencia || !experienciaProfesional || !serviciosPropuestos) {
      return NextResponse.json(
        { success: false, error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }
    
    // Validar que industrias sea un array y tenga entre 1 y 3 elementos
    if (!Array.isArray(industrias) || industrias.length === 0 || industrias.length > 3) {
      return NextResponse.json(
        { success: false, error: "Debes seleccionar al menos 1 industria y máximo 3" },
        { status: 400 }
      );
    }
    
    // Verificar si el usuario ya tiene un perfil de experto
    const expertoExistente = await Experto.findOne({ userId: session.user.id });
    if (expertoExistente) {
      return NextResponse.json(
        { success: false, error: "Ya tienes un perfil de experto registrado" },
        { status: 400 }
      );
    }
    
    // Crear nuevo experto
    const nuevoExperto = new Experto({
      userId: session.user.id,
      nombre,
      semblanza,
      industrias,
      categorias,
      gradoExperiencia,
      experienciaProfesional,
      serviciosPropuestos,
    });
    
    await nuevoExperto.save();
    
    return NextResponse.json({
      success: true,
      message: "Perfil de experto creado exitosamente",
      data: nuevoExperto,
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error al crear experto:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 