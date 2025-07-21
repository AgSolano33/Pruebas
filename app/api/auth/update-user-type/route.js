import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const { userType } = await request.json();
    
    // Validaciones
    if (!userType || !["provider", "client"].includes(userType)) {
      return NextResponse.json(
        { error: "Tipo de usuario inválido" },
        { status: 400 }
      );
    }

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { userType },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        message: "Tipo de usuario actualizado exitosamente",
        userType: updatedUser.userType
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar tipo de usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 