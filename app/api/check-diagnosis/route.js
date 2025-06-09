import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import Diagnosis from '@/models/Diagnosis';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'El correo electrónico es requerido' },
        { status: 400 }
      );
    }

    await connectDB();
    const existingDiagnosis = await Diagnosis.findOne({ email });

    return NextResponse.json({
      exists: !!existingDiagnosis,
      diagnosis: existingDiagnosis
    });

  } catch (error) {
    console.error('Error al verificar diagnóstico:', error);
    return NextResponse.json(
      { error: 'Error al verificar el diagnóstico' },
      { status: 500 }
    );
  }
} 