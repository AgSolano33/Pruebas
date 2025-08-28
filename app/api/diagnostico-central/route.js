import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/libs/mongodb';
import DiagnosticoCentral from '@/models/DiagnosticoCentral';
import mongoose from 'mongoose';
import { analyzeCentralDiagnostic } from '@/services/centralDiagnosticService';
import { sanitizeObject } from '@/libs/sanitize';
export const dynamic = "force-dynamic"; // evita SSG/ISR
export const revalidate = 0;            // (opcional) no caches

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
  // DEACTIVATED: Central diagnostico functionality is temporarily disabled
  return NextResponse.json(
    { error: 'El diagnóstico central está temporalmente desactivado' },
    { status: 503 }
  );
  
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Obtener los datos del diagnóstico
    const data = await request.json();
    
    // Sanitizar los datos antes de procesarlos
    const sanitizedData = sanitizeObject(data);
    
    console.log('Received data:', JSON.stringify(sanitizedData, null, 2));

    // Validar que el email exista y no sea null
    if (!sanitizedData.informacionPersonal || !sanitizedData.informacionPersonal.email) {
      console.log('Email validation failed:', sanitizedData.informacionPersonal);
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      );
    }

    // Extraer y validar el email
    const email = sanitizedData.informacionPersonal.email.trim();
    if (!email) {
      return NextResponse.json(
        { error: 'El email no puede estar vacío' },
        { status: 400 }
      );
    }

    // Verificar si ya existe un diagnóstico para este usuario
    console.log('Checking for existing diagnosis with userId:', sanitizedData.userId, 'and email:', email);
    const existingDiagnostico = await DiagnosticoCentral.findOne({ 
      userId: sanitizedData.userId,
      email: email
    });

    console.log('Existing diagnosis found:', existingDiagnostico ? 'Yes' : 'No');

    if (existingDiagnostico) {
      return NextResponse.json(
        { error: 'Ya existe un diagnóstico para este usuario y email' },
        { status: 400 }
      );
    }

    // Verificar si ya existe un análisis para este usuario en analysis_results
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    console.log('Checking for existing analysis with userId:', sanitizedData.userId);
    const existingAnalysis = await db.collection('analysis_results').findOne({ userId: sanitizedData.userId });
    console.log('Existing analysis found:', existingAnalysis ? 'Yes' : 'No');
    if (existingAnalysis) {
      return NextResponse.json(
        { error: 'Ya existe un análisis para este usuario. No se puede crear un nuevo diagnóstico central.' },
        { status: 400 }
      );
    }

    // Crear el nuevo diagnóstico con el email en ambos lugares
    const diagnosticoData = {
      userId: sanitizedData.userId,
      email: email, // Asegurarnos de que el email esté en la raíz
      informacionPersonal: {
        ...sanitizedData.informacionPersonal,
        email: email // Mantener el email en informacionPersonal
      },
      informacionEmpresa: sanitizedData.informacionEmpresa,
      proyectoObjetivos: sanitizedData.proyectoObjetivos,
      evaluacionAreas: sanitizedData.evaluacionAreas
    };

    // Crear el nuevo diagnóstico
    console.log('Creating new diagnosis with data:', JSON.stringify(diagnosticoData, null, 2));
    const diagnostico = new DiagnosticoCentral(diagnosticoData);
    console.log('Diagnosis model created, attempting to save...');
    await diagnostico.save();
    console.log('Diagnosis saved successfully');

    // Lanzar el análisis en background (no bloquea la respuesta)
    analyzeCentralDiagnostic(diagnosticoData, sanitizedData.userId)
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