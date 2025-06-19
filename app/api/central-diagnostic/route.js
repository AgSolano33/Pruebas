import { NextResponse } from "next/server";
import { createAndAnalyzeCentralDiagnostic } from "@/services/centralDiagnosticService";

export async function POST(request) {
  try {
    const { diagnosticData, userId } = await request.json();

    if (!diagnosticData || !userId) {
      return NextResponse.json(
        { error: "Se requieren los datos del diagnóstico y el ID del usuario" },
        { status: 400 }
      );
    }

    // Crear y analizar el diagnóstico central
    const result = await createAndAnalyzeCentralDiagnostic(diagnosticData, userId);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error al crear y analizar el diagnóstico central:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear y analizar el diagnóstico central" },
      { status: 500 }
    );
  }
} 