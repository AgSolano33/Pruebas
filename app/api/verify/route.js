import { connectToDatabase } from "@/libs/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return new Response(JSON.stringify({ error: "Token requerido" }), { status: 400 });
    }

    await connectToDatabase();

    // Buscar usuario con el token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return new Response(JSON.stringify({ error: "Token inválido o expirado" }), { status: 400 });
    }

    // Marcar como verificado
    user.verified = true;
    user.verificationToken = null; // eliminar el token
    await user.save();

    return new Response(JSON.stringify({ message: "Correo verificado correctamente" }), { status: 200 });

  } catch (error) {
    console.error("Error en verify:", error);
    return new Response(JSON.stringify({ error: "Error al verificar el usuario" }), { status: 500 });
  }
}