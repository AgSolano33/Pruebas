import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/libs/mongodb';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log("GET request for diagnosis ID:", id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const db = mongoose.connection.db;

    // Buscar el diagnóstico específico por ID
    const diagnosis = await db.collection("diagnoses").findOne({
      _id: new mongoose.Types.ObjectId(id)
    });

    console.log("Found diagnosis:", diagnosis);

    if (!diagnosis) {
      return NextResponse.json(
        { success: false, error: "No se encontró el diagnóstico" },
        { status: 404 }
      );
    }

    // Convertir ObjectId a string y fechas a ISO
    const formattedDiagnosis = {
      ...diagnosis,
      _id: diagnosis._id.toString(),
      userId: diagnosis.userId?.toString(),
      createdAt: diagnosis.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: diagnosis.updatedAt?.toISOString() || new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: formattedDiagnosis
    });
  } catch (error) {
    console.error("Error in GET /api/diagnoses/[id]:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 