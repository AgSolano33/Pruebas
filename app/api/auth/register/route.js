import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/libs/mongodb";
import User from "@/models/User";
import Role from "@/models/Role";
import crypto from "crypto";
import { sendVerificationEmail } from "@/libs/mailer"; 

export async function POST(req) {
  try {
    const { name, email, password, roleName } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Todos los campos son obligatorios" }), { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Usuario ya registrado" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = await Role.findOne({ name: roleName || "cliente" });
    if (!role) {
      return new Response(JSON.stringify({ error: "Rol no encontrado" }), { status: 400 });
    }

    // Generar token de verificación
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      roles: [role._id],
      hasAccess: true,
      verificationToken, // guardamos el token
      verified: false,   // por defecto no verificado
    });

    // Enviar correo de verificación
    await sendVerificationEmail(email, name, verificationToken);

    const populatedUser = await newUser.populate("roles", "name");

    return new Response(JSON.stringify({ 
      message: "Usuario creado correctamente. Revisa tu correo para verificar tu cuenta.", 
      user: populatedUser 
    }), { status: 201 });

  } catch (error) {
    console.error("Error en register:", error);
    return new Response(JSON.stringify({ error: "Error al crear el usuario" }), { status: 500 });
  }
}
