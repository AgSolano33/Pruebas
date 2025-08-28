import { connectToDatabase } from "@/libs/mongodb";
import User from "@/models/User";

// 👇 Fuerza que esta API sea dinámica y no intente prerenderse
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token requerido" }),
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Token inválido o expirado" }),
        { status: 400 }
      );
    }

    user.verified = true;
    user.verificationToken = null;
    await user.save();

    return new Response(
      JSON.stringify({ message: "Correo verificado correctamente ✅" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en verify:", error);
    return new Response(
      JSON.stringify({ error: "Error al verificar el usuario" }),
      { status: 500 }
    );
  }
}
