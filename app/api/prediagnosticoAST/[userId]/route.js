export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PrediagnosticoAST from "@/models/PreDiagnosticoAST";

export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const { userId } = params || {};
    if (!userId) return NextResponse.json({ error: "Falta userId en la URL" }, { status: 400 });

    const last = await PrediagnosticoAST.findOne({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ last });
  } catch (err) {
    console.error("GET /prediagnosticoAST error:", err);
    return NextResponse.json({ error: err?.message || "Error consultando DB" }, { status: 500 });
  }
}