import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import Experto from "@/models/Experto";
import { connectToDatabase } from "@/libs/mongodb";

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = params;
    const data = await request.json();

    // Buscar el perfil del experto
    const experto = await Experto.findOne({ userId: session.user.id });
    if (!experto) {
      return NextResponse.json({ success: false, error: "Perfil de experto no encontrado" }, { status: 404 });
    }

    // Buscar el servicio específico
    const servicio = experto.servicios.id(id);
    if (!servicio) {
      return NextResponse.json({ success: false, error: "Servicio no encontrado" }, { status: 404 });
    }

    // Actualizar los campos del servicio
    servicio.nombre = data.nombre;
    servicio.descripcion = data.descripcion;
    servicio.precio = data.precio;
    servicio.moneda = data.moneda;
    servicio.tipoPrecio = data.tipoPrecio;
    servicio.tiempoEstimado = data.tiempoEstimado;
    servicio.industriasServicio = data.industriasServicio || [];
    servicio.categoriasServicio = data.categoriasServicio || [];
    servicio.objetivosCliente = data.objetivosCliente || [];
    servicio.fechaActualizacion = new Date();

    await experto.save();

    // Recategorizar el servicio con IA
    try {
      await categorizarServicioConIA(experto._id, id, data);
    } catch (error) {
      console.error('Error en categorización IA:', error);
    }

    return NextResponse.json({ 
      success: true, 
      data: servicio,
      message: "Servicio actualizado exitosamente" 
    });

  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor" 
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = params;

    // Buscar el perfil del experto
    const experto = await Experto.findOne({ userId: session.user.id });
    if (!experto) {
      return NextResponse.json({ success: false, error: "Perfil de experto no encontrado" }, { status: 404 });
    }

    // Eliminar el servicio específico
    const servicioEliminado = experto.servicios.id(id);
    if (!servicioEliminado) {
      return NextResponse.json({ success: false, error: "Servicio no encontrado" }, { status: 404 });
    }

    servicioEliminado.deleteOne();
    await experto.save();

    return NextResponse.json({ 
      success: true, 
      message: "Servicio eliminado exitosamente" 
    });

  } catch (error) {
    console.error('Error al eliminar servicio:', error);
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