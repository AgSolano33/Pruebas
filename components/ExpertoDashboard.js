"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaUser, FaCheckCircle, FaClock, FaListUl, FaChartBar, FaUsers, FaRocket } from "react-icons/fa";
import postulacionesStore from "@/libs/postulacionesStore";
import tareasStore from "@/libs/tareasStore";

export default function ExpertoDashboard({ proyecto, experto, isOpen, onClose }) {
  const [tareas, setTareas] = useState({
    porHacer: [],
    enProceso: [],
    terminadas: []
  });
  const [expertosAsignados, setExpertosAsignados] = useState([]);

  useEffect(() => {
    if (isOpen && proyecto && experto) {
      actualizarExpertosAsignados();
      cargarTareas();
    }
  }, [isOpen, proyecto, experto]);

  // Suscribirse a cambios en el store de postulaciones
  useEffect(() => {
    if (isOpen && proyecto) {
      const unsubscribe = postulacionesStore.subscribe(() => {
        actualizarExpertosAsignados();
      });
      return unsubscribe;
    }
  }, [isOpen, proyecto]);

  // Suscribirse a cambios en el store de tareas
  useEffect(() => {
    if (isOpen && proyecto) {
      const unsubscribe = tareasStore.subscribe(() => {
        cargarTareas();
      });
      return unsubscribe;
    }
  }, [isOpen, proyecto]);

  const actualizarExpertosAsignados = () => {
    if (!proyecto) return;
    
    // Obtener solo los expertos que han sido aceptados para este proyecto
    const postulaciones = postulacionesStore.getPostulaciones(proyecto._id);
    const expertosAceptados = postulaciones
      .filter(post => post.estado === 'aceptada')
      .map(post => post.experto);
    
    console.log('Expertos aceptados para el proyecto:', expertosAceptados);
    console.log('Estructura del primer experto:', expertosAceptados[0]);
    
    // Si no hay expertos aceptados, usar datos mock
    if (expertosAceptados.length === 0) {
      console.log('No hay expertos aceptados, usando datos mock');
      setExpertosAsignados([
        {
          nombre: "Pedro García",
          _id: "pedro_001",
          semblanza: "Experto en servicios digitales"
        }
      ]);
    } else {
      setExpertosAsignados(expertosAceptados);
    }
    
    console.log('Expertos asignados finales:', expertosAceptados.length > 0 ? expertosAceptados : [
      {
        nombre: "Pedro García",
        _id: "pedro_001",
        semblanza: "Experto en servicios digitales"
      }
    ]);
    
    // Inicializar con algunas tareas de ejemplo
    setTareas({
      porHacer: [
        {
          id: 1,
          titulo: 'Análisis de requerimientos',
          descripcion: 'Realizar un análisis detallado de los requerimientos del proyecto',
          expertoAsignado: expertosAceptados[0]?.nombre || 'Pedro García',
          prioridad: 'alta',
          fechaLimite: '2024-02-15',
          fechaCreacion: new Date().toISOString()
        },
        {
          id: 2,
          titulo: 'Diseño de arquitectura',
          descripcion: 'Crear el diseño de la arquitectura del sistema',
          expertoAsignado: expertosAceptados[0]?.nombre || 'Pedro García',
          prioridad: 'media',
          fechaLimite: '2024-02-20',
          fechaCreacion: new Date().toISOString()
        }
      ],
      enProceso: [
        {
          id: 3,
          titulo: 'Desarrollo del frontend',
          descripcion: 'Implementar la interfaz de usuario',
          expertoAsignado: expertosAceptados[0]?.nombre || 'Pedro García',
          prioridad: 'alta',
          fechaLimite: '2024-02-25',
          fechaCreacion: new Date().toISOString()
        }
      ],
      terminadas: []
    });
  };

  const cargarTareas = () => {
    if (!proyecto) return;
    
    const tareasDelProyecto = tareasStore.getTareas(proyecto._id);
    setTareas(tareasDelProyecto);
  };

  const moveTask = (taskId, fromColumn, toColumn) => {
    // Mover tarea usando el store
    const success = tareasStore.moverTarea(proyecto._id, taskId, fromColumn, toColumn);
    if (!success) {
      console.log('Error al mover tarea');
    }
  };

  const deleteTask = (taskId, column) => {
    // Eliminar tarea usando el store
    const success = tareasStore.eliminarTarea(proyecto._id, taskId, column);
    if (!success) {
      console.log('Error al eliminar tarea');
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'text-red-600';
      case 'media': return 'text-yellow-600';
      case 'baja': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPrioridadTexto = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
      default: return 'Sin prioridad';
    }
  };

  const calcularProgreso = () => {
    const totalTareas = tareas.porHacer.length + tareas.enProceso.length + tareas.terminadas.length;
    if (totalTareas === 0) return 0;
    return Math.round((tareas.terminadas.length / totalTareas) * 100);
  };

  const totalTareas = tareas.porHacer.length + tareas.enProceso.length + tareas.terminadas.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Dashboard del Proyecto - {proyecto?.nombreProyecto}
            </h2>
            <p className="text-gray-600">Panel de gestión para expertos</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Métricas */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaChartBar className="text-blue-600" />
                  <span className="font-semibold text-blue-900">Progreso</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{calcularProgreso()}%</div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calcularProgreso()}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaListUl className="text-green-600" />
                  <span className="font-semibold text-green-900">Total Tareas</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{totalTareas}</div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="text-yellow-600" />
                  <span className="font-semibold text-yellow-900">En Proceso</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600">{tareas.enProceso.length}</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaUsers className="text-purple-600" />
                  <span className="font-semibold text-purple-900">Expertos</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">{expertosAsignados.length}</div>
              </div>
            </div>
          </div>



          {/* Tablero Kanban */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaRocket />
                Avances del Proyecto
              </h3>
              <div className="text-sm text-gray-500">
                Solo puedes mover tareas, no agregar nuevas
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Por Hacer */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  Por Hacer ({tareas.porHacer.length})
                </h4>
                <div className="space-y-3">
                  {tareas.porHacer.map((tarea) => (
                    <div key={tarea.id} className="bg-white p-3 rounded-lg border shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">{tarea.titulo}</h5>
                        <button
                          onClick={() => deleteTask(tarea.id, 'porHacer')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{tarea.descripcion}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Asignado a: {tarea.expertoAsignado}</span>
                        <span>Vence: {tarea.fechaLimite}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPrioridadColor(tarea.prioridad)} bg-opacity-10`}>
                          {getPrioridadTexto(tarea.prioridad)}
                        </span>
                        <button
                          onClick={() => moveTask(tarea.id, 'porHacer', 'enProceso')}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          Mover a En Proceso
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* En Proceso */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  En Proceso ({tareas.enProceso.length})
                </h4>
                <div className="space-y-3">
                  {tareas.enProceso.map((tarea) => (
                    <div key={tarea.id} className="bg-white p-3 rounded-lg border shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">{tarea.titulo}</h5>
                        <button
                          onClick={() => deleteTask(tarea.id, 'enProceso')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{tarea.descripcion}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Asignado a: {tarea.expertoAsignado}</span>
                        <span>Vence: {tarea.fechaLimite}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPrioridadColor(tarea.prioridad)} bg-opacity-10`}>
                          {getPrioridadTexto(tarea.prioridad)}
                        </span>
                        <button
                          onClick={() => moveTask(tarea.id, 'enProceso', 'terminadas')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          Marcar Completada
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminadas */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  Terminadas ({tareas.terminadas.length})
                </h4>
                <div className="space-y-3">
                  {tareas.terminadas.map((tarea) => (
                    <div key={tarea.id} className="bg-white p-3 rounded-lg border shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">{tarea.titulo}</h5>
                        <button
                          onClick={() => deleteTask(tarea.id, 'terminadas')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{tarea.descripcion}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Asignado a: {tarea.expertoAsignado}</span>
                        <span>Vence: {tarea.fechaLimite}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPrioridadColor(tarea.prioridad)} bg-opacity-10`}>
                          {getPrioridadTexto(tarea.prioridad)}
                        </span>
                        <div className="flex items-center gap-1 text-green-600">
                          <FaCheckCircle />
                          <span className="text-xs">Completada</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 