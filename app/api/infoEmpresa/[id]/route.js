// app/api/infoEmpresa/[userId]/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/libs/mongodb";
import InfoEmpresa from "@/models/infoEmpresa";

/**
 * Normaliza valores de entrada al tipo del esquema:
 * - numEmpleados y ventasAnuales: tu schema los define como String => guardamos como String
 */
function toStringOrEmpty(v) {
  if (v === undefined || v === null) return "";
  return String(v);
}

function tryObjectId(id) {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return null;
  }
}

// ✅ GET: obtener la info de empresa por userId
export async function GET(_req, { params }) {
  try {
    await connectToDatabase();
    const { userId } = params;

    const oid = tryObjectId(userId);

    // Buscar por distintas variantes (id_users como ObjectId en array)
    let empresa = await InfoEmpresa.findOne({
      $or: [
        oid ? { id_users: oid } : {},                // match directo
        oid ? { id_users: { $in: [oid] } } : {},     // match en array
        // Si en algún dato viejo guardaste userId como string:
        { id_users: userId },
        { id_users: { $in: [userId] } },
      ].filter((q) => Object.keys(q).length > 0),
    }).lean();

    // Auto-fix opcional: si no hay doc vinculado, pero existe uno "huérfano", lo vinculamos
    if (!empresa) {
      const orphan = await InfoEmpresa.findOne({
        $or: [
          { id_users: null },
          { id_users: [null] },
          { id_users: { $size: 0 } },
        ],
      });

      if (orphan && oid) {
        orphan.id_users = [oid];
        await orphan.save();
        empresa = orphan.toObject();
      }
    }

    if (!empresa) {
      return NextResponse.json({ error: "InfoEmpresa no encontrada" }, { status: 404 });
    }

    return NextResponse.json(empresa, { status: 200 });
  } catch (error) {
    console.error("[infoEmpresa GET] ", error);
    return NextResponse.json({ error: "Error al obtener InfoEmpresa" }, { status: 500 });
  }
}

// ✅ PUT: crea o actualiza (upsert) la info de empresa del usuario
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const body = await request.json();

    const oid = tryObjectId(userId);
    if (!oid) {
      return NextResponse.json({ error: "userId inválido" }, { status: 400 });
    }

    // Buscar doc del usuario (tanto si ya existe como si no)
    let empresa = await InfoEmpresa.findOne({
      $or: [{ id_users: oid }, { id_users: { $in: [oid] } }],
    });

    if (!empresa) {
      // Crear nuevo (upsert manual)
      empresa = await InfoEmpresa.create({
        id_users: [oid],
        name: toStringOrEmpty(body.name),
        sector: toStringOrEmpty(body.sector),
        ubicacion: toStringOrEmpty(body.ubicacion),
        CP: toStringOrEmpty(body.CP),
        numEmpleados: toStringOrEmpty(body.numEmpleados),
        actividad: toStringOrEmpty(body.actividad),
        descripcionActividad: toStringOrEmpty(body.descripcionActividad),
        ventasAnuales: toStringOrEmpty(body.ventasAnuales),
        antiguedad: toStringOrEmpty(body.antiguedad),
        tipoNegocio: toStringOrEmpty(body.tipoNegocio),
      });
    } else {
      // Asegura que el userId esté en el array (por si viene de datos viejos)
      const hasUser =
        (empresa.id_users || []).some((x) => String(x) === String(oid));
      if (!hasUser) {
        empresa.id_users = [...(empresa.id_users || []), oid];
      }

      // Actualiza solo los campos provistos (mantén strings según schema)
      if ("name" in body) empresa.name = toStringOrEmpty(body.name);
      if ("sector" in body) empresa.sector = toStringOrEmpty(body.sector);
      if ("ubicacion" in body) empresa.ubicacion = toStringOrEmpty(body.ubicacion);
      if ("CP" in body) empresa.CP = toStringOrEmpty(body.CP);
      if ("numEmpleados" in body) empresa.numEmpleados = toStringOrEmpty(body.numEmpleados);
      if ("actividad" in body) empresa.actividad = toStringOrEmpty(body.actividad);
      if ("descripcionActividad" in body) empresa.descripcionActividad = toStringOrEmpty(body.descripcionActividad);
      if ("ventasAnuales" in body) empresa.ventasAnuales = toStringOrEmpty(body.ventasAnuales);
      if ("antiguedad" in body) empresa.antiguedad = toStringOrEmpty(body.antiguedad);
      if ("tipoNegocio" in body) empresa.tipoNegocio = toStringOrEmpty(body.tipoNegocio);

      await empresa.save();
    }

    return NextResponse.json(empresa.toJSON ? empresa.toJSON() : empresa, { status: 200 });
  } catch (error) {
    console.error("[infoEmpresa PUT] ", error);
    return NextResponse.json({ error: "Error al guardar InfoEmpresa" }, { status: 500 });
  }
}
