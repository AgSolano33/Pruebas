import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import User from "@/models/User";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// Actualizar usuario por ID
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          studies: body.nivelEstudios,
          genero: body.genero,
          telefono: body.telefono,
        },
      },
      { new: true } // para que regrese el usuario ya actualizado
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    return NextResponse.json(
      { error: "Error actualizando usuario" },
      { status: 500 }
    );
  }
}
