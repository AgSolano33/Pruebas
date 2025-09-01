// app/api/infoEmpresa/[id]/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import InfoEmpresa from "@/models/infoEmpresa";

export async function GET(_req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params; // 👈 es params.id, no userId
    if (!id) {
      return NextResponse.json({ error: "id requerido en la ruta" }, { status: 400 });
    }

    const empresa = await InfoEmpresa.findOne({ id_users: id }).lean();
    if (!empresa) return NextResponse.json({ error: "InfoEmpresa no encontrada" }, { status: 404 });

    return NextResponse.json(empresa, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al obtener InfoEmpresa" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params; // 👈 igual aquí
    if (!id) {
      return NextResponse.json({ error: "id requerido en la ruta" }, { status: 400 });
    }

    const body = await request.json();

    let empresa = await InfoEmpresa.findOne({ id_users: id });

    if (empresa) {
      // actualizar
      if (body.tipoNegocio !== undefined) empresa.tipoNegocio = body.tipoNegocio;
      if (body.name !== undefined) empresa.name = body.name;
      if (body.actividad !== undefined) empresa.actividad = body.actividad;
      if (body.descripcionActividad !== undefined) empresa.descripcionActividad = body.descripcionActividad;
      if (body.ubicacion !== undefined) empresa.ubicacion = body.ubicacion;
      if (body.sector !== undefined) empresa.sector = body.sector;
      if (body.numEmpleados !== undefined) empresa.numEmpleados = String(body.numEmpleados);
      if (body.ventasAnuales !== undefined) empresa.ventasAnuales = String(body.ventasAnuales);
      if (body.CP !== undefined) empresa.CP = body.CP;
      if (body.antiguedad !== undefined) empresa.antiguedad = body.antiguedad;

      if (!Array.isArray(empresa.id_users)) empresa.id_users = [];
      if (!empresa.id_users.find((x) => String(x) === String(id))) {
        empresa.id_users.push(id);
      }

      await empresa.save();
    } else {
      // crear
      empresa = await InfoEmpresa.create({
        id_users: [id], 
        tipoNegocio: body.tipoNegocio ?? "",
        name: body.name ?? "",
        actividad: body.actividad ?? "",
        descripcionActividad: body.descripcionActividad ?? "",
        ubicacion: body.ubicacion ?? "",
        sector: body.sector ?? "",
        numEmpleados: body.numEmpleados ? String(body.numEmpleados) : "0",
        ventasAnuales: body.ventasAnuales ? String(body.ventasAnuales) : "0",
        CP: body.CP ?? "",
        antiguedad: body.antiguedad ?? "",
      });
    }

    return NextResponse.json(empresa, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al guardar InfoEmpresa" }, { status: 500 });
  }
}
