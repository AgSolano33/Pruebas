import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import DiagnosticoCentral from '@/models/DiagnosticoCentral';

export async function GET() {
  try {
    await connectDB();
    console.log("Conectando a la base de datos...");
    
    // Buscamos todos los documentos de la colección diagnosticocentrals
    const diagnoses = await DiagnosticoCentral.find()
      .lean()
      .exec();
    
    console.log("Datos encontrados en la base de datos:", JSON.stringify(diagnoses, null, 2));
    
    if (!diagnoses || diagnoses.length === 0) {
      console.log("No se encontraron datos en la base de datos");
      return NextResponse.json([], { status: 200 });
    }

    // Transformamos los datos para asegurar que tengan la estructura correcta
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

    console.log("Datos formateados:", JSON.stringify(formattedDiagnoses, null, 2));

    return NextResponse.json(formattedDiagnoses, { status: 200 });
  } catch (error) {
    console.error('Error al obtener diagnósticos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los diagnósticos' },
      { status: 500 }
    );
  }
} 