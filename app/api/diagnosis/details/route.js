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
    const diagnosis = await Diagnosis.findOne({ email }, 'informacionpersonal informacionempresa');

    if (!diagnosis) {
      return NextResponse.json(
        { error: 'Diagnóstico no encontrado para el correo electrónico proporcionado' },
        { status: 404 }
      );
    }

    return NextResponse.json(diagnosis, { status: 200 });

  } catch (error) {
    console.error('Error al obtener detalles del diagnóstico:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud de detalles del diagnóstico' },
      { status: 500 }
    );
  }
} 