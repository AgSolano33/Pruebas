import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/libs/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const { name, email, password, userType } = await request.json();
    
    // Validaciones
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    if (userType && !["provider", "client"].includes(userType)) {
      return NextResponse.json(
        { error: "Tipo de usuario inválido" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email" },
        { status: 400 }
      );
    }
    
    // Encriptar contraseña con bcrypt (cost factor 12 para producción)
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Crear usuario
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      userType: userType || null,
    });
    
    return NextResponse.json(
      { 
        message: "Usuario creado exitosamente",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 