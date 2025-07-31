"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaUser, FaCheckCircle, FaClock, FaListUl, FaChartBar, FaUsers, FaRocket, FaFileAlt, FaDollarSign, FaCalendar, FaTachometerAlt } from "react-icons/fa";

export default function ExpertoProyectoDashboard({ proyecto, experto, isOpen, onClose }) {
  const [tareas, setTareas] = useState({
    porHacer: [],
    enProceso: [],
    terminadas: []
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    fechaLimite: ''
  });

  useEffect(() => {
    if (isOpen && proyecto) {
      // Cargar tareas asignadas al experto para este proyecto específico
      cargarTareasProyecto();
    }
  }, [isOpen, proyecto]);

  const cargarTareasProyecto = () => {
    // Simular tareas asignadas al experto para este proyecto
    const tareasSimuladas = {
      porHacer: [
        {
          id: 1,
          titulo: "Análisis de requerimientos",
          descripcion: "Revisar y documentar todos los requerimientos del proyecto",
          prioridad: "alta",
          fechaLimite: "2024-02-15",
          asignadoPor: "Cliente",
          fechaCreacion: "2024-01-20"
        },
        {
          id: 2,
          titulo: "Diseño de arquitectura",
          descripcion: "Crear el diseño de la arquitectura del sistema",
          prioridad: "media",
          fechaLimite: "2024-02-20",
          asignadoPor: "Cliente",
          fechaCreacion: "2024-01-20"
        }
      ],
      enProceso: [
        {
          id: 3,
          titulo: "Configuración inicial",
          descripcion: "Configurar el entorno de desarrollo y herramientas",
          prioridad: "alta",
          fechaLimite: "2024-02-10",
          asignadoPor: "Cliente",
          fechaCreacion: "2024-01-18"
        }
      ],
      terminadas: [
        {
          id: 4,
          titulo: "Reunión de kickoff",
          descripcion: "Reunión inicial con el cliente para alinear expectativas",
          prioridad: "baja",
          fechaLimite: "2024-01-25",
          asignadoPor: "Cliente",
          fechaCreacion: "2024-01-15"
        }
      ]
    };
    
    console.log('Cargando tareas para el proyecto:', proyecto);
    console.log('Experto actual:', experto);
    setTareas(tareasSimuladas);
  };

  const moveTask = (taskId, fromColumn, toColumn) => {
    const task = tareas[fromColumn].find(t => t.id === taskId);
    if (!task) return;
    
    setTareas(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(t => t.id !== taskId),
      [toColumn]: [...prev[toColumn], task]
    }));
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    const total = tareas.porHacer.length + tareas.enProceso.length + tareas.terminadas.length;
    if (total === 0) return 0;
    return Math.round((tareas.terminadas.length / total) * 100);
  };

  const totalTareas = tareas.porHacer.length + tareas.enProceso.length + tareas.terminadas.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1A3D7C] text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Dashboard del Proyecto</h2>
              <p className="text-blue-100">{proyecto?.nombreProyecto}</p>
              <p className="text-blue-200 text-sm">Vista del Experto: {experto?.nombre}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaChartBar className="text-blue-600" />
                <span className="font-semibold text-blue-900">Mi Progreso</span>
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
                <span className="font-semibold text-green-900">Mis Tareas</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{totalTareas}</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaRocket className="text-purple-600" />
                <span className="font-semibold text-purple-900">Estado del Proyecto</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {proyecto?.estado === "en_proceso" ? "En Proceso" : proyecto?.estado}
              </div>
            </div>
          </div>
        </div>

        {/* Información del Proyecto */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaTachometerAlt />
            Información del Proyecto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Detalles del Proyecto</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Empresa:</span> {proyecto?.nombreEmpresa}</div>
                <div><span className="font-medium">Industria:</span> {proyecto?.industria}</div>
                <div><span className="font-medium">Objetivo:</span> {proyecto?.objetivoEmpresa}</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Servicios Requeridos</h4>
              <div className="flex flex-wrap gap-2">
                {proyecto?.categoriasServicioBuscado?.map((categoria, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {categoria}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tablero Kanban */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaRocket />
              Mis Tareas Asignadas
            </h3>
            <div className="text-sm text-gray-600">
              Solo puedes ver y completar las tareas que te han sido asignadas
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
                    <div className="mb-2">
                      <h5 className="font-medium text-gray-900">{tarea.titulo}</h5>
                      <p className="text-sm text-gray-600">{tarea.descripcion}</p>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Asignado por: {tarea.asignadoPor}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPrioridadColor(tarea.prioridad)}`}>
                        {getPrioridadTexto(tarea.prioridad)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Vence: {tarea.fechaLimite}</span>
                      <button
                        onClick={() => moveTask(tarea.id, 'porHacer', 'enProceso')}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Iniciar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* En Proceso */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                En Proceso ({tareas.enProceso.length})
              </h4>
              <div className="space-y-3">
                {tareas.enProceso.map((tarea) => (
                  <div key={tarea.id} className="bg-white p-3 rounded-lg border shadow-sm">
                    <div className="mb-2">
                      <h5 className="font-medium text-gray-900">{tarea.titulo}</h5>
                      <p className="text-sm text-gray-600">{tarea.descripcion}</p>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Asignado por: {tarea.asignadoPor}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPrioridadColor(tarea.prioridad)}`}>
                        {getPrioridadTexto(tarea.prioridad)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Vence: {tarea.fechaLimite}</span>
                      <button
                        onClick={() => moveTask(tarea.id, 'enProceso', 'terminadas')}
                        className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Completar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminadas */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Terminadas ({tareas.terminadas.length})
              </h4>
              <div className="space-y-3">
                {tareas.terminadas.map((tarea) => (
                  <div key={tarea.id} className="bg-white p-3 rounded-lg border shadow-sm">
                    <div className="mb-2">
                      <h5 className="font-medium text-gray-900">{tarea.titulo}</h5>
                      <p className="text-sm text-gray-600">{tarea.descripcion}</p>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">Asignado por: {tarea.asignadoPor}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPrioridadColor(tarea.prioridad)}`}>
                        {getPrioridadTexto(tarea.prioridad)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Vence: {tarea.fechaLimite}</span>
                      <span className="text-xs text-green-600 font-medium">✓ Completada</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 