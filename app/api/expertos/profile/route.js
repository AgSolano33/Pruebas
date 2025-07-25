import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { connectToDatabase } from "@/libs/mongodb";
import Experto from "@/models/Experto";

// GET - Obtener perfil del experto actual
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const experto = await Experto.findOne({ userId: session.user.id }).lean();
    
    if (!experto) {
      return NextResponse.json({
        success: true,
        data: null,
        hasProfile: false
      });
    }
    
    return NextResponse.json({
      success: true,
      data: experto,
      hasProfile: true
    });
    
  } catch (error) {
    console.error("Error al obtener perfil de experto:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST - Crear o actualizar perfil de experto
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const body = await request.json();
    
    const {
      nombre,
      email,
      telefono,
      ubicacion,
      linkedin,
      website,
      semblanza,
      gradoExperiencia,
      experienciaAnos,
      industrias,
      categorias,
      habilidades,
      especialidades,
      experienciaProfesional,
      proyectosDestacados,
      serviciosPropuestos,
      tarifas,
      certificaciones,
      educacion,
      disponibilidad,
      horariosDisponibles,
      tiposProyectos,
      tamanosProyectos,
      modalidadTrabajo
    } = body;
    
    // Validar campos requeridos básicos
    if (!nombre || !semblanza || !gradoExperiencia || !industrias) {
      return NextResponse.json(
        { success: false, error: "Los campos marcados con * son requeridos" },
        { status: 400 }
      );
    }
    
    // Validar que industrias sea un array y tenga entre 1 y 5 elementos
    if (!Array.isArray(industrias) || industrias.length === 0 || industrias.length > 5) {
      return NextResponse.json(
        { success: false, error: "Debes seleccionar al menos 1 industria y máximo 5" },
        { status: 400 }
      );
    }
    
    // Verificar si el usuario ya tiene un perfil de experto
    let experto = await Experto.findOne({ userId: session.user.id });
    
    if (experto) {
      // Actualizar perfil existente
      experto.nombre = nombre;
      experto.email = email || experto.email;
      experto.telefono = telefono;
      experto.ubicacion = ubicacion;
      experto.linkedin = linkedin;
      experto.website = website;
      experto.semblanza = semblanza;
      experto.gradoExperiencia = gradoExperiencia;
      experto.experienciaAnos = experienciaAnos;
      experto.industrias = industrias;
      experto.categorias = categorias;
      experto.habilidades = habilidades || [];
      experto.especialidades = especialidades || [];
      experto.experienciaProfesional = experienciaProfesional;
      experto.proyectosDestacados = proyectosDestacados;
      experto.serviciosPropuestos = serviciosPropuestos;
      experto.tarifas = tarifas;
      experto.certificaciones = certificaciones || [];
      experto.educacion = educacion;
      experto.disponibilidad = disponibilidad || "part-time";
      experto.horariosDisponibles = horariosDisponibles;
      experto.tiposProyectos = tiposProyectos || [];
      experto.tamanosProyectos = tamanosProyectos || [];
      experto.modalidadTrabajo = modalidadTrabajo || [];
      
      // Resetear estado a pendiente si se actualiza
      if (experto.estado === "aprobado") {
        experto.estado = "pendiente";
      }
      
      await experto.save();
      
      return NextResponse.json({
        success: true,
        message: "Perfil actualizado exitosamente",
        data: experto,
      });
    } else {
      // Crear nuevo perfil
      const nuevoExperto = new Experto({
        userId: session.user.id,
        nombre,
        email: email || session.user.email,
        telefono,
        ubicacion,
        linkedin,
        website,
        semblanza,
        gradoExperiencia,
        experienciaAnos,
        industrias,
        categorias,
        habilidades: habilidades || [],
        especialidades: especialidades || [],
        experienciaProfesional,
        proyectosDestacados,
        serviciosPropuestos,
        tarifas,
        certificaciones: certificaciones || [],
        educacion,
        disponibilidad: disponibilidad || "part-time",
        horariosDisponibles,
        tiposProyectos: tiposProyectos || [],
        tamanosProyectos: tamanosProyectos || [],
        modalidadTrabajo: modalidadTrabajo || [],
        servicios: [], // Array vacío de servicios
        estado: "pendiente"
      });
      
      await nuevoExperto.save();
      
      return NextResponse.json({
        success: true,
        message: "Perfil creado exitosamente",
        data: nuevoExperto,
      }, { status: 201 });
    }
    
  } catch (error) {
    console.error("Error al crear/actualizar perfil de experto:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 