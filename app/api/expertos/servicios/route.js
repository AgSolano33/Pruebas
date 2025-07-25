import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import Experto from "@/models/Experto";
import { connectToDatabase } from "@/libs/mongodb";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();

    // Buscar el perfil del experto
    const experto = await Experto.findOne({ userId: session.user.id });
    if (!experto) {
      return NextResponse.json({ success: false, error: "Perfil de experto no encontrado" }, { status: 404 });
    }

    // Crear el nuevo servicio
    const nuevoServicio = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      moneda: data.moneda,
      tipoPrecio: data.tipoPrecio,
      tiempoEstimado: data.tiempoEstimado,
      industriasServicio: data.industriasServicio || [],
      categoriasServicio: data.categoriasServicio || [],
      objetivosCliente: data.objetivosCliente || [],
      estado: "activo",
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };

    // Agregar el servicio al array de servicios del experto
    experto.servicios.push(nuevoServicio);
    await experto.save();

    // Categorizar el servicio con IA (opcional, puede ser asíncrono)
    try {
      await categorizarServicioConIA(experto._id, nuevoServicio._id, data);
    } catch (error) {
      console.error('Error en categorización IA:', error);
      // No fallar si la categorización IA falla
    }

    return NextResponse.json({ 
      success: true, 
      data: nuevoServicio,
      message: "Servicio creado exitosamente" 
    });

  } catch (error) {
    console.error('Error al crear servicio:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor" 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    await connectToDatabase();

    const experto = await Experto.findOne({ userId: session.user.id });
    if (!experto) {
      return NextResponse.json({ success: false, error: "Perfil de experto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: experto.servicios || [] 
    });

  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor" 
    }, { status: 500 });
  }
}

// Función para categorizar servicio con IA
async function categorizarServicioConIA(expertoId, servicioId, serviceData) {
  try {
    // Aquí implementarías la lógica de categorización con IA
    // Por ahora, crearemos una categorización básica basada en palabras clave
    
    const categorizacion = {
      industriasRecomendadas: serviceData.industriasServicio || [],
      serviciosRelacionados: serviceData.categoriasServicio || [],
      objetivosCompatibles: serviceData.objetivosCliente || [],
      nivelExperienciaRequerido: "mid-level",
      palabrasClave: extraerPalabrasClave(serviceData.descripcion),
      scoreConfianza: 0.8
    };

    // Actualizar el servicio con la categorización
    await Experto.updateOne(
      { 
        _id: expertoId,
        "servicios._id": servicioId 
      },
      { 
        $set: { 
          "servicios.$.categorizacionIA": categorizacion,
          "servicios.$.fechaActualizacion": new Date()
        } 
      }
    );

  } catch (error) {
    console.error('Error en categorización IA:', error);
    throw error;
  }
}

// Función auxiliar para extraer palabras clave
function extraerPalabrasClave(descripcion) {
  const palabrasComunes = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'como', 'pero', 'sus', 'me', 'hasta', 'hay', 'donde', 'han', 'quien', 'están', 'estado', 'desde', 'todo', 'nos', 'durante', 'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'ese', 'eso', 'ante', 'ellos', 'e', 'esto', 'mí', 'antes', 'algunos', 'qué', 'unos', 'yo', 'otro', 'otras', 'otra', 'él', 'tanto', 'esa', 'estos', 'mucho', 'quienes', 'nada', 'muchos', 'cual', 'poco', 'ella', 'estar', 'estas', 'algunas', 'algo', 'nosotros'];
  
  const palabras = descripcion.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(palabra => palabra.length > 3 && !palabrasComunes.includes(palabra));
  
  // Retornar las primeras 10 palabras únicas
  return [...new Set(palabras)].slice(0, 10);
} 