// Ejemplo de uso del nuevo sistema de estados de proyectos

// 1. Crear proyectos (se crean en estado 'aprobacion' por defecto)
const crearProyectos = async (userId, prediagnosticoId) => {
  const response = await fetch('/api/assistant/ProyectosPre', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      prediagnosticoId,
      // ... otros datos del prediagnóstico
    })
  });
  
  const result = await response.json();
  console.log('Proyectos creados:', result.proyectos);
  return result.proyectos;
};

// 2. Obtener proyectos por estado
const obtenerProyectosPorEstado = async (userId, estado) => {
  const response = await fetch(`/api/assistant/ProyectosPre/${userId}?estado=${estado}`);
  const result = await response.json();
  console.log(`Proyectos en estado ${estado}:`, result.proyectos);
  return result.proyectos;
};

// 3. Publicar un proyecto (cambia a 'publicado' y hace matching)
const publicarProyecto = async (proyectoId, userId, datosAdicionales) => {
  const response = await fetch('/api/assistant/ProyectosPre/publicado', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      proyectoId,
      userId,
      datosAdicionales: {
        nombreEmpresa: "Mi Empresa S.A.",
        industria: "Tecnología",
        presupuesto: "50000",
        plazo: "3 meses",
        ...datosAdicionales
      }
    })
  });
  
  const result = await response.json();
  console.log('Proyecto publicado:', result.data);
  console.log('Matches encontrados:', result.matches);
  return result;
};

// 4. Cambiar estado de un proyecto
const cambiarEstadoProyecto = async (proyectoId, userId, nuevoEstado, datosAdicionales = {}) => {
  const response = await fetch(`/api/assistant/ProyectosPre/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      proyectoId,
      nuevoEstado,
      datosAdicionales
    })
  });
  
  const result = await response.json();
  console.log(`Proyecto ${nuevoEstado}:`, result.data);
  return result;
};

// 5. Obtener estadísticas de proyectos
const obtenerEstadisticas = async (userId) => {
  const response = await fetch(`/api/assistant/ProyectosPre/estadisticas?userId=${userId}`);
  const result = await response.json();
  console.log('Estadísticas:', result.data);
  return result.data;
};

// 6. Flujo completo de ejemplo
const flujoCompletoProyecto = async () => {
  const userId = "user123";
  const prediagnosticoId = "pred456";
  
  try {
    // Paso 1: Crear proyectos
    console.log("1. Creando proyectos...");
    const proyectos = await crearProyectos(userId, prediagnosticoId);
    const primerProyecto = proyectos[0];
    
    // Paso 2: Obtener proyectos en aprobación
    console.log("2. Obteniendo proyectos en aprobación...");
    const proyectosAprobacion = await obtenerProyectosPorEstado(userId, "aprobacion");
    
    // Paso 3: Publicar el primer proyecto
    console.log("3. Publicando proyecto...");
    const proyectoPublicado = await publicarProyecto(
      primerProyecto._id, 
      userId,
      {
        nombreEmpresa: "Mi Empresa S.A.",
        industria: "Tecnología"
      }
    );
    
    // Paso 4: Cambiar a en proceso cuando se asigne un experto
    console.log("4. Cambiando a en proceso...");
    await cambiarEstadoProyecto(
      primerProyecto._id, 
      userId, 
      "en_proceso",
      {
        expertoAsignado: "experto123",
        fechaInicio: new Date().toISOString()
      }
    );
    
    // Paso 5: Completar el proyecto
    console.log("5. Completando proyecto...");
    await cambiarEstadoProyecto(
      primerProyecto._id, 
      userId, 
      "completado",
      {
        fechaFin: new Date().toISOString(),
        resultado: "Proyecto completado exitosamente"
      }
    );
    
    // Paso 6: Obtener estadísticas finales
    console.log("6. Obteniendo estadísticas...");
    const estadisticas = await obtenerEstadisticas(userId);
    
    console.log("Flujo completado exitosamente!");
    return estadisticas;
    
  } catch (error) {
    console.error("Error en el flujo:", error);
    throw error;
  }
};

// 7. Funciones de utilidad
const obtenerProyectosActivos = async (userId) => {
  return await obtenerProyectosPorEstado(userId, "en_proceso");
};

const obtenerProyectosPublicados = async (userId) => {
  return await obtenerProyectosPorEstado(userId, "publicado");
};

const cancelarProyecto = async (proyectoId, userId, motivo) => {
  return await cambiarEstadoProyecto(proyectoId, userId, "cancelado", {
    motivoCancelacion: motivo,
    fechaCancelacion: new Date().toISOString()
  });
};

// Exportar funciones para uso en otros archivos
export {
  crearProyectos,
  obtenerProyectosPorEstado,
  publicarProyecto,
  cambiarEstadoProyecto,
  obtenerEstadisticas,
  flujoCompletoProyecto,
  obtenerProyectosActivos,
  obtenerProyectosPublicados,
  cancelarProyecto
};
