// Store simple para manejar postulaciones y estados de proyectos
class PostulacionesStore {
  constructor() {
    // Usar localStorage para persistencia
    this.postulaciones = new Map();
    this.proyectosEstados = new Map();
    this.listeners = new Set();
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('postulacionesStore');
      if (stored) {
        const data = JSON.parse(stored);
        this.postulaciones = new Map(data.postulaciones || []);
        this.proyectosEstados = new Map(data.proyectosEstados || []);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  saveToStorage() {
    try {
      const data = {
        postulaciones: Array.from(this.postulaciones.entries()),
        proyectosEstados: Array.from(this.proyectosEstados.entries())
      };
      localStorage.setItem('postulacionesStore', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // Obtener postulaciones de un proyecto
  getPostulaciones(proyectoId) {
    if (!proyectoId) return [];
    return this.postulaciones.get(proyectoId) || [];
  }

  // Agregar una nueva postulación
  agregarPostulacion(proyectoId, postulacion) {
    if (!proyectoId || !postulacion) {
      console.log('Error: proyectoId o postulacion son null/undefined', { proyectoId, postulacion });
      return false;
    }
    
    const postulaciones = this.getPostulaciones(proyectoId);
    const nuevaPostulacion = {
      ...postulacion,
      id: `post_${Date.now()}_${Math.random()}`,
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    };
    
    postulaciones.push(nuevaPostulacion);
    this.postulaciones.set(proyectoId, postulaciones);
    
    console.log('Postulación agregada:', { proyectoId, nuevaPostulacion });
    console.log('Total postulaciones para este proyecto:', postulaciones.length);
    console.log('Estructura del experto:', nuevaPostulacion.experto);
    
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  // Aceptar una postulación
  aceptarPostulacion(proyectoId, postulacionId) {
    const postulaciones = this.getPostulaciones(proyectoId);
    const postulacion = postulaciones.find(p => p.id === postulacionId);
    
    if (postulacion) {
      postulacion.estado = 'aceptada';
      // Cambiar estado del proyecto a "en_proceso"
      this.proyectosEstados.set(proyectoId, 'en_proceso');
      this.saveToStorage();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Rechazar una postulación
  rechazarPostulacion(proyectoId, postulacionId) {
    const postulaciones = this.getPostulaciones(proyectoId);
    const postulacion = postulaciones.find(p => p.id === postulacionId);
    
    if (postulacion) {
      postulacion.estado = 'rechazada';
      this.saveToStorage();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Obtener estado de un proyecto
  getEstadoProyecto(proyectoId) {
    if (!proyectoId) return 'publicado';
    return this.proyectosEstados.get(proyectoId) || 'publicado';
  }

  // Establecer estado de un proyecto
  setEstadoProyecto(proyectoId, estado) {
    this.proyectosEstados.set(proyectoId, estado);
    this.notifyListeners();
  }

  // Suscribirse a cambios
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notificar a todos los listeners
  notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Limpiar todas las postulaciones (para debugging)
  limpiarPostulaciones() {
    this.postulaciones.clear();
    this.proyectosEstados.clear();
    this.notifyListeners();
    console.log('Store limpiado');
  }

  // Debug: mostrar estado actual del store
  debugStore() {
    console.log('Estado actual del store:');
    console.log('Postulaciones:', Array.from(this.postulaciones.entries()));
    console.log('Estados de proyectos:', Array.from(this.proyectosEstados.entries()));
  }
}

// Instancia global
const postulacionesStore = new PostulacionesStore();

export default postulacionesStore; 