class TareasStore {
  constructor() {
    // Usar localStorage para persistencia
    this.tareas = new Map(); // proyectoId -> { porHacer: [], enProceso: [], terminadas: [] }
    this.listeners = new Set();
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('tareasStore');
      if (stored) {
        const data = JSON.parse(stored);
        this.tareas = new Map(data.tareas || []);
      }
    } catch (error) {
      console.error('Error loading tareas from storage:', error);
    }
  }

  saveToStorage() {
    try {
      const data = {
        tareas: Array.from(this.tareas.entries())
      };
      localStorage.setItem('tareasStore', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving tareas to storage:', error);
    }
  }

  // Obtener tareas de un proyecto
  getTareas(proyectoId) {
    if (!proyectoId) return { porHacer: [], enProceso: [], terminadas: [] };
    return this.tareas.get(proyectoId) || { porHacer: [], enProceso: [], terminadas: [] };
  }

  // Establecer tareas de un proyecto
  setTareas(proyectoId, tareas) {
    if (!proyectoId) return false;
    
    this.tareas.set(proyectoId, tareas);
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  // Agregar una nueva tarea
  agregarTarea(proyectoId, tarea) {
    if (!proyectoId || !tarea) {
      console.log('Error: proyectoId o tarea son null/undefined', { proyectoId, tarea });
      return false;
    }
    
    const tareas = this.getTareas(proyectoId);
    const nuevaTarea = {
      ...tarea,
      id: `tarea_${Date.now()}_${Math.random()}`,
      fechaCreacion: new Date().toISOString()
    };
    
    tareas.porHacer.push(nuevaTarea);
    this.tareas.set(proyectoId, tareas);
    
    console.log('Tarea agregada:', { proyectoId, nuevaTarea });
    
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  // Mover una tarea entre columnas
  moverTarea(proyectoId, taskId, fromColumn, toColumn) {
    if (!proyectoId || !taskId || !fromColumn || !toColumn) {
      console.log('Error: datos incompletos para mover tarea', { proyectoId, taskId, fromColumn, toColumn });
      return false;
    }
    
    const tareas = this.getTareas(proyectoId);
    const task = tareas[fromColumn].find(t => t.id === taskId);
    
    if (!task) {
      console.log('Tarea no encontrada:', taskId);
      return false;
    }
    
    // Remover de la columna origen
    tareas[fromColumn] = tareas[fromColumn].filter(t => t.id !== taskId);
    // Agregar a la columna destino
    tareas[toColumn].push(task);
    
    this.tareas.set(proyectoId, tareas);
    
    console.log('Tarea movida:', { proyectoId, taskId, fromColumn, toColumn });
    
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  // Eliminar una tarea
  eliminarTarea(proyectoId, taskId, column) {
    if (!proyectoId || !taskId || !column) {
      console.log('Error: datos incompletos para eliminar tarea', { proyectoId, taskId, column });
      return false;
    }
    
    const tareas = this.getTareas(proyectoId);
    tareas[column] = tareas[column].filter(t => t.id !== taskId);
    
    this.tareas.set(proyectoId, tareas);
    
    console.log('Tarea eliminada:', { proyectoId, taskId, column });
    
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  // Inicializar tareas por defecto para un proyecto
  inicializarTareasPorDefecto(proyectoId, expertoAsignado) {
    if (!proyectoId) return false;
    
    const tareasPorDefecto = {
      porHacer: [
        {
          id: `tarea_1_${proyectoId}`,
          titulo: 'Análisis de requerimientos',
          descripcion: 'Realizar un análisis detallado de los requerimientos del proyecto',
          expertoAsignado: expertoAsignado || 'Pedro García',
          prioridad: 'alta',
          fechaLimite: '2024-02-15',
          fechaCreacion: new Date().toISOString()
        },
        {
          id: `tarea_2_${proyectoId}`,
          titulo: 'Diseño de arquitectura',
          descripcion: 'Crear el diseño de la arquitectura del sistema',
          expertoAsignado: expertoAsignado || 'Pedro García',
          prioridad: 'media',
          fechaLimite: '2024-02-20',
          fechaCreacion: new Date().toISOString()
        }
      ],
      enProceso: [
        {
          id: `tarea_3_${proyectoId}`,
          titulo: 'Desarrollo del frontend',
          descripcion: 'Implementar la interfaz de usuario',
          expertoAsignado: expertoAsignado || 'Pedro García',
          prioridad: 'alta',
          fechaLimite: '2024-02-25',
          fechaCreacion: new Date().toISOString()
        }
      ],
      terminadas: []
    };
    
    this.tareas.set(proyectoId, tareasPorDefecto);
    
    console.log('Tareas inicializadas para proyecto:', proyectoId);
    
    this.saveToStorage();
    this.notifyListeners();
    return true;
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

  // Limpiar todas las tareas (para debugging)
  limpiarTareas() {
    this.tareas.clear();
    this.notifyListeners();
    this.saveToStorage();
    console.log('Tareas limpiadas');
  }

  // Debug: mostrar estado actual del store
  debugStore() {
    console.log('Estado actual del tareasStore:');
    console.log('Tareas:', Array.from(this.tareas.entries()));
  }
}

// Instancia global
const tareasStore = new TareasStore();

export default tareasStore; 