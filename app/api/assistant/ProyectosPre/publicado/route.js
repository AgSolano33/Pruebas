export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import ProyectoPreAST from "@/models/proyectosPreAST";
// import { getServerSession } from "next-auth"; // opcional, si validas sesión

export async function PATCH(req) {
  try {
    // const session = await getServerSession();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    // }

    const { id, publicado } = await req.json().catch(() => ({}));
    if (!id || typeof publicado !== "boolean") {
      return NextResponse.json({ error: "Faltan 'id' y/o 'publicado' boolean" }, { status: 400 });
    }

    await connectToDatabase();

    // Si quieres restringir por usuario, agrega userId: session.user.id
    const doc = await ProyectoPreAST.findOneAndUpdate(
      { _id: id }, 
      { $set: { publicado } },
      { new: true }
    );

    if (!doc) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });

    return NextResponse.json({ ok: true, proyecto: doc });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Error" }, { status: 500 });
  }
}
