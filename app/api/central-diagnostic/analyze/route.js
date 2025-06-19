import { NextResponse } from "next/server";
import { analyzeCentralDiagnostic } from "@/services/centralDiagnosticService";
import { connectToDatabase } from "@/libs/mongodb";

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Se requiere el ID del usuario" },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    const mongoose = await connectToDatabase();

    // Buscar el diagnóstico central del usuario
    const diagnosticData = await mongoose.connection.db
      .collection("central_diagnostics")
      .findOne({ userId });

    if (!diagnosticData) {
      return NextResponse.json(
        { error: "No se encontró el diagnóstico central para este usuario" },
        { status: 404 }
      );
    }

    // Realizar el análisis
    const analysis = await analyzeCentralDiagnostic(diagnosticData, userId);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error al analizar el diagnóstico central:", error);
    return NextResponse.json(
      { error: error.message || "Error al analizar el diagnóstico central" },
      { status: 500 }
    );
  }
} 