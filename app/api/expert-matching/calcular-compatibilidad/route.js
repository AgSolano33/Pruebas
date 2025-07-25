import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import Experto from "@/models/Experto";
import ProyectoPublicado from "@/models/ProyectoPublicado";
import { connectToDatabase } from "@/libs/mongodb";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    await connectToDatabase();
    const { proyectoId, expertoId } = await request.json();

    if (!proyectoId || !expertoId) {
      return NextResponse.json({ success: false, error: "Faltan parámetros requeridos" }, { status: 400 });
    }

    // Obtener el perfil del experto
    const experto = await Experto.findOne({ userId: expertoId });
    if (!experto) {
      return NextResponse.json({ success: false, error: "Perfil de experto no encontrado" }, { status: 404 });
    }

    // Obtener el proyecto
    const proyecto = await ProyectoPublicado.findById(proyectoId);
    if (!proyecto) {
      return NextResponse.json({ success: false, error: "Proyecto no encontrado" }, { status: 404 });
    }

    // Calcular compatibilidad
    const compatibilidad = await calcularCompatibilidad(experto, proyecto);

    return NextResponse.json({
      success: true,
      data: compatibilidad
    });

  } catch (error) {
    console.error('Error al calcular compatibilidad:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Error interno del servidor" 
    }, { status: 500 });
  }
}

async function calcularCompatibilidad(experto, proyecto) {
  let puntuacion = 0;
  const razones = [];

  // 1. Compatibilidad de industria (30 puntos)
  const industriasComunes = experto.industrias.filter(industria => 
    proyecto.industria === industria
  );
  
  if (industriasComunes.length > 0) {
    puntuacion += 30;
    razones.push(`Experiencia en la industria: ${proyecto.industria}`);
  } else {
    razones.push(`Sin experiencia específica en ${proyecto.industria}`);
  }

  // 2. Compatibilidad de categorías de servicio (25 puntos)
  const categoriasComunes = experto.categoriasServicio?.filter(categoria =>
    proyecto.categoriasServicioBuscado.includes(categoria)
  ) || [];

  if (categoriasComunes.length > 0) {
    const puntosCategorias = Math.min(25, categoriasComunes.length * 8);
    puntuacion += puntosCategorias;
    razones.push(`Ofrece servicios requeridos: ${categoriasComunes.join(', ')}`);
  } else {
    razones.push("No ofrece los servicios específicos requeridos");
  }

  // 3. Nivel de experiencia (20 puntos)
  const nivelExperiencia = experto.gradoExperiencia;
  const experienciaAnos = parseInt(experto.experienciaAnos) || 0;
  
  if (nivelExperiencia === "expert" && experienciaAnos >= 10) {
    puntuacion += 20;
    razones.push("Experto con más de 10 años de experiencia");
  } else if (nivelExperiencia === "senior" && experienciaAnos >= 6) {
    puntuacion += 15;
    razones.push("Senior con experiencia sólida");
  } else if (nivelExperiencia === "mid-level" && experienciaAnos >= 3) {
    puntuacion += 10;
    razones.push("Mid-level con experiencia moderada");
  } else {
    razones.push("Nivel de experiencia junior");
  }

  // 4. Habilidades relevantes (15 puntos)
  const habilidadesRelevantes = experto.habilidades?.filter(habilidad => {
    const descripcionProyecto = proyecto.objetivoEmpresa.toLowerCase();
    return descripcionProyecto.includes(habilidad.toLowerCase());
  }) || [];

  if (habilidadesRelevantes.length > 0) {
    const puntosHabilidades = Math.min(15, habilidadesRelevantes.length * 3);
    puntuacion += puntosHabilidades;
    razones.push(`Habilidades relevantes: ${habilidadesRelevantes.slice(0, 3).join(', ')}`);
  }

  // 5. Especialidades (10 puntos)
  const especialidadesRelevantes = experto.especialidades?.filter(especialidad => {
    const descripcionProyecto = proyecto.objetivoEmpresa.toLowerCase();
    return descripcionProyecto.includes(especialidad.toLowerCase());
  }) || [];

  if (especialidadesRelevantes.length > 0) {
    puntuacion += 10;
    razones.push(`Especialidades relevantes: ${especialidadesRelevantes.slice(0, 2).join(', ')}`);
  }

  // 6. Análisis de servicios del experto (si tiene servicios configurados)
  if (experto.servicios && experto.servicios.length > 0) {
    const serviciosRelevantes = experto.servicios.filter(servicio => {
      // Verificar si algún servicio del experto coincide con las categorías buscadas
      return servicio.categoriasServicio?.some(categoria =>
        proyecto.categoriasServicioBuscado.includes(categoria)
      );
    });

    if (serviciosRelevantes.length > 0) {
      puntuacion += 5;
      razones.push(`Tiene servicios configurados que coinciden con el proyecto`);
    }
  }

  // Asegurar que la puntuación no exceda 100
  puntuacion = Math.min(100, Math.max(0, puntuacion));

  // Determinar nivel de compatibilidad
  let nivelCompatibilidad = "baja";
  if (puntuacion >= 80) nivelCompatibilidad = "excelente";
  else if (puntuacion >= 60) nivelCompatibilidad = "alta";
  else if (puntuacion >= 40) nivelCompatibilidad = "media";

  return {
    puntuacion: Math.round(puntuacion),
    nivelCompatibilidad,
    razones: razones.slice(0, 5), // Máximo 5 razones
    detalles: {
      industriasComunes: industriasComunes.length,
      categoriasComunes: categoriasComunes.length,
      habilidadesRelevantes: habilidadesRelevantes.length,
      especialidadesRelevantes: especialidadesRelevantes.length,
      nivelExperiencia,
      experienciaAnos
    }
  };
} 