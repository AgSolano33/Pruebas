import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/libs/mongodb';
import mongoose from 'mongoose';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    console.log("GET request params:", { userId });

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const db = mongoose.connection.db;

    // Verificar la colección y contar documentos
    const collections = await db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));

    const diagnosesCollection = db.collection("diagnoses");
    const totalDocuments = await diagnosesCollection.countDocuments();
    console.log("Total documents in diagnoses collection:", totalDocuments);

    // Buscar todos los diagnósticos del usuario usando $or para manejar diferentes formatos de userId
    const diagnoses = await diagnosesCollection
      .find({
        $or: [
          { userId: userId },
          { userId: new mongoose.Types.ObjectId(userId) }
        ]
      })
      .toArray();

    console.log("Found diagnoses count:", diagnoses.length);
    console.log("All diagnoses:", JSON.stringify(diagnoses, null, 2));

    if (!diagnoses || diagnoses.length === 0) {
      return NextResponse.json(
        { success: false, error: "No se encontraron diagnósticos" },
        { status: 404 }
      );
    }

    // Convertir ObjectId a string y fechas a ISO
    const formattedDiagnoses = diagnoses.map(diagnosis => ({
      ...diagnosis,
      _id: diagnosis._id.toString(),
      userId: diagnosis.userId?.toString(),
      createdAt: diagnosis.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: diagnosis.updatedAt?.toISOString() || new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: formattedDiagnoses
    });
  } catch (error) {
    console.error("Error in GET /api/diagnoses:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Se requiere el ID del diagnóstico' 
      }, { status: 400 });
    }

    await connectToDatabase();
    const db = mongoose.connection.db;
    const result = await db.collection('diagnoses').deleteOne({ 
      _id: new mongoose.Types.ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Diagnóstico no encontrado' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Diagnóstico eliminado exitosamente' 
    });

  } catch (error) {
    console.error('Error al eliminar diagnóstico:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error al eliminar diagnóstico' 
    }, { status: 500 });
  }
} 