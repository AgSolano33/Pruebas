import { NextResponse } from 'next/server'
import connectDB from '@/libs/mongodb';
import DiagnosticoCentral from '@/models/DiagnosticoCentral';

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

    await connectDB();
    
    // Buscar diagnósticos que coincidan con el userId
    const diagnoses = await DiagnosticoCentral.find({ userId: userId })
      .lean()
      .exec();
    
    if (!diagnoses || diagnoses.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Transformar los datos para asegurar que tengan la estructura correcta
    const formattedDiagnoses = diagnoses.map(diagnosis => ({
      informacionpersonal: {
        nombre: diagnosis.informacionPersonal?.nombre || '',
        apellido: diagnosis.informacionPersonal?.apellido || '',
        email: diagnosis.informacionPersonal?.email || '',
        telefono: diagnosis.informacionPersonal?.telefono || '',
        puesto: diagnosis.informacionPersonal?.puesto || ''
      },
      informacionempresa: {
        sector: diagnosis.informacionEmpresa?.sector || '',
        nombreEmpresa: diagnosis.informacionEmpresa?.nombreEmpresa || '',
        ubicacion: diagnosis.informacionEmpresa?.ubicacion || '',
        codigoPostal: diagnosis.informacionEmpresa?.codigoPostal || '',
        descripcionActividad: diagnosis.informacionEmpresa?.descripcionActividad || '',
        tieneEmpleados: diagnosis.informacionEmpresa?.tieneEmpleados || false,
        numeroEmpleados: diagnosis.informacionEmpresa?.numeroEmpleados || 0,
        ventasAnuales: diagnosis.informacionEmpresa?.ventasAnuales || 0,
        antiguedad: diagnosis.informacionEmpresa?.antiguedad || 0
      }
    }));

    return NextResponse.json(formattedDiagnoses, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los diagnósticos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los diagnósticos' },
      { status: 500 }
    );
  }
} 