import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/libs/mongodb';
import DiagnosticoCentral from '@/models/DiagnosticoCentral';
import mongoose from 'mongoose';
import { analyzeCentralDiagnostic } from '@/services/centralDiagnosticService';

export async function GET(request) {
  try {
    // Obtener el userId de la URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Se requiere el userId' },
        { status: 400 }
      );
    }

    console.log('Conectando a la base de datos...');
    await connectToDatabase();
    console.log('Conexión exitosa, buscando diagnóstico para userId:', userId);
    
    // Buscar el diagnóstico específico del usuario
    const diagnosis = await DiagnosticoCentral.findOne({ userId: userId })
      .lean()
      .exec();

    console.log('Resultado de la búsqueda:', diagnosis ? 'Encontrado' : 'No encontrado');

    if (!diagnosis) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(diagnosis, { status: 200 });
  } catch (error) {
    console.error('Error en GET /api/diagnostico-central:', error);
    return NextResponse.json(
      { error: 'Error al obtener el diagnóstico', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Obtener los datos del diagnóstico
    const data = await request.json();

    // Validar que el email exista y no sea null
    if (!data.informacionPersonal || !data.informacionPersonal.email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      );
    }

    // Extraer y validar el email
    const email = data.informacionPersonal.email.trim();
    if (!email) {
      return NextResponse.json(
        { error: 'El email no puede estar vacío' },
        { status: 400 }
      );
    }

    // Verificar si ya existe un diagnóstico para este usuario
    const existingDiagnostico = await DiagnosticoCentral.findOne({ 
      userId: data.userId,
      email: email
    });

    if (existingDiagnostico) {
      return NextResponse.json(
        { error: 'Ya existe un diagnóstico para este usuario y email' },
        { status: 400 }
      );
    }

    // Crear el nuevo diagnóstico con el email en ambos lugares
    const diagnosticoData = {
      userId: data.userId,
      email: email, // Asegurarnos de que el email esté en la raíz
      informacionPersonal: {
        ...data.informacionPersonal,
        email: email // Mantener el email en informacionPersonal
      },
      informacionEmpresa: data.informacionEmpresa,
      proyectoObjetivos: data.proyectoObjetivos,
      evaluacionAreas: data.evaluacionAreas
    };

    // Crear el nuevo diagnóstico
    const diagnostico = new DiagnosticoCentral(diagnosticoData);
    await diagnostico.save();

    // Lanzar el análisis en background (no bloquea la respuesta)
    analyzeCentralDiagnostic(diagnosticoData, data.userId)
      .then(() => console.log('Análisis completado exitosamente'))
      .catch((analysisError) => console.error('Error al realizar el análisis:', analysisError));

    return NextResponse.json({
      success: true,
      message: 'Diagnóstico guardado exitosamente. El análisis estará disponible en unos minutos.',
      diagnostico
    });

  } catch (error) {
    console.error('Error en POST /api/diagnostico-central:', error);
    return NextResponse.json(
      { error: error.message || 'Error al guardar el diagnóstico', details: error.stack },
      { status: 500 }
    );
  }
} 