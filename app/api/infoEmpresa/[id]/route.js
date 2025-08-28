import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import InfoEmpresa from "@/models/infoEmpresa";

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const body = await request.json();

    // Buscar la empresa por id_users
    let empresa = await InfoEmpresa.findOne({ id_users: userId });

    if (empresa) {
      // Mantener todo lo existente y actualizar solo los campos nuevos/recibidos
      empresa.tipoNegocio = body.tipoNegocio ?? empresa.tipoNegocio;
      empresa.name = body.name ?? empresa.name;
      empresa.actividad = body.actividad ?? empresa.actividad;
      empresa.descripcionActividad = body.descripcionActividad ?? empresa.descripcionActividad;
      empresa.numEmpleados = body.numEmpleados !== undefined ? Number(body.numEmpleados) : empresa.numEmpleados;
      empresa.ventasAnuales = body.ventasAnuales !== undefined ? Number(body.ventasAnuales) : empresa.ventasAnuales;

      await empresa.save();
    } else {
      // Crear nueva empresa
      empresa = await InfoEmpresa.create({
        id_users: [userId],
        tipoNegocio: body.tipoNegocio,
        name: body.name,
        actividad: body.actividad,
        descripcionActividad: body.descripcionActividad,
        numEmpleados: Number(body.numEmpleados),
        ventasAnuales: Number(body.ventasAnuales)
      });
    }

    return NextResponse.json(empresa, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al guardar InfoEmpresa" }, { status: 500 });
  }
}
