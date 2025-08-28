// app/api/infoEmpresa/[userId]/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import InfoEmpresa from "@/models/infoEmpresa";

// ✅ GET: obtener la info de empresa del usuario
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { userId } = params;

    // Soporta esquemas donde id_users es string o array:
    const empresa = await InfoEmpresa.findOne({
      $or: [
        { id_users: userId },          // cuando es string
        { id_users: { $in: [userId] } } // cuando es array
      ]
    }).lean();

    if (!empresa) {
      // Importante: 404 para que puedas detectar que aún no hay info
      return NextResponse.json({ error: "InfoEmpresa no encontrada" }, { status: 404 });
    }

    return NextResponse.json(empresa, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener InfoEmpresa" }, { status: 500 });
  }
}

// ✅ PUT: crea o actualiza (upsert manual) la info de empresa del usuario
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const body = await request.json();

    // Buscamos por id_users (string o array)
    let empresa = await InfoEmpresa.findOne({
      $or: [
        { id_users: userId },
        { id_users: { $in: [userId] } }
      ]
    });

    if (empresa) {
      // Actualiza solo campos provistos, mantiene el resto
      empresa.tipoNegocio = body.tipoNegocio ?? empresa.tipoNegocio;
      empresa.name = body.name ?? empresa.name;
      empresa.actividad = body.actividad ?? empresa.actividad;
      empresa.descripcionActividad = body.descripcionActividad ?? empresa.descripcionActividad;

      // Asegura tipos numéricos
      if (body.numEmpleados !== undefined && body.numEmpleados !== null && body.numEmpleados !== "") {
        empresa.numEmpleados = Number(body.numEmpleados);
      }
      if (body.ventasAnuales !== undefined && body.ventasAnuales !== null && body.ventasAnuales !== "") {
        empresa.ventasAnuales = Number(body.ventasAnuales);
      }

      await empresa.save();
    } else {
      // Crea nuevo doc; si tu schema define id_users como array, guardamos como array
      empresa = await InfoEmpresa.create({
        id_users: Array.isArray(body.id_users) ? body.id_users : [userId],
        tipoNegocio: body.tipoNegocio ?? "",
        name: body.name ?? "",
        actividad: body.actividad ?? "",
        descripcionActividad: body.descripcionActividad ?? "",
        numEmpleados: body.numEmpleados !== undefined && body.numEmpleados !== "" ? Number(body.numEmpleados) : 0,
        ventasAnuales: body.ventasAnuales !== undefined && body.ventasAnuales !== "" ? Number(body.ventasAnuales) : 0,
      });
    }

    return NextResponse.json(empresa, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al guardar InfoEmpresa" }, { status: 500 });
  }
}
