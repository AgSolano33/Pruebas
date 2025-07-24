import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import User from "@/models/User";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const { userType } = await request.json();

    if (!userType || !['client', 'provider'].includes(userType)) {
      return NextResponse.json(
        { success: false, error: "Tipo de usuario inválido" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { userType },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { userType: updatedUser.userType }
    });

  } catch (error) {
    console.error("Error al actualizar tipo de usuario:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 