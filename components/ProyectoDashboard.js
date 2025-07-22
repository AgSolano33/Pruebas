"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaUser, FaCheckCircle, FaClock, FaListUl, FaChartBar, FaUsers, FaRocket } from "react-icons/fa";

export default function ProyectoDashboard({ proyecto, isOpen, onClose, expertosData }) {
  const [tareas, setTareas] = useState({
    porHacer: [],
    enProceso: [],
    terminadas: []
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    titulo: '',
    descripcion: '',
    expertoAsignado: '',
    prioridad: 'media',
    fechaLimite: ''
  });
  const [expertosAsignados, setExpertosAsignados] = useState([]);

  useEffect(() => {
    if (isOpen && proyecto && expertosData) {
      // Simular expertos asignados al proyecto (los que tienen citas confirmadas)
      const expertos = expertosData.expertos_formulario || [];
      // Por ahora, asignar los primeros 3 expertos como ejemplo
      setExpertosAsignados(expertos.slice(0, 3));
      
      // Inicializar con algunas tareas de ejemplo
      setTareas({
        porHacer: [
          {
            id: 1,
            titulo: 'Análisis de requerimientos',
            descripcion: 'Realizar un análisis detallado de los requerimientos del proyecto',
            expertoAsignado: expertos[0]?.nombre_experto || 'Experto 1',
            prioridad: 'alta',
            fechaLimite: '2024-02-15',
            fechaCreacion: new Date().toISOString()
          },
          {
            id: 2,
            titulo: 'Diseño de arquitectura',
            descripcion: 'Crear el diseño de la arquitectura del sistema',
            expertoAsignado: expertos[1]?.nombre_experto || 'Experto 2',
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
            expertoAsignado: expertos[2]?.nombre_experto || 'Experto 3',
            prioridad: 'alta',
            fechaLimite: '2024-02-25',
            fechaCreacion: new Date().toISOString()
          }
        ],
        terminadas: []
      });
    }
  }, [isOpen, proyecto, expertosData]);

  const handleAddTask = (e) => {
    e.preventDefault();
    
    const task = {
      id: Date.now(),
      ...newTask,
      fechaCreacion: new Date().toISOString()
    };
    
    setTareas(prev => ({
      ...prev,
      porHacer: [...prev.porHacer, task]
    }));
    
    setNewTask({
      titulo: '',
      descripcion: '',
      expertoAsignado: '',
      prioridad: 'media',
      fechaLimite: ''
    });
    
    setShowAddTask(false);
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

  const deleteTask = (taskId, column) => {
    setTareas(prev => ({
      ...prev,
      [column]: prev[column].filter(t => t.id !== taskId)
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
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard del Proyecto</h2>
            <p className="text-lg text-gray-600">{proyecto.nombreEmpresa} - {proyecto.nombreProyecto}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Información del Proyecto */}
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

        {/* Expertos Asignados */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaUsers />
            Expertos Asignados al Proyecto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {expertosAsignados.map((experto, index) => (
              <div key={experto.ID} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{experto.nombre_experto}</h4>
                    <p className="text-sm text-gray-600">{experto.estudios_expertos}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Especialidades:</strong> {experto.categoria}
                </div>
                <div className="text-xs text-gray-500">
                  {experto.experiencia_experto.substring(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tablero Kanban */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaRocket />
              Avances del Proyecto
            </h3>
            <button
              onClick={() => setShowAddTask(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <FaPlus />
              Agregar Tarea
            </button>
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
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{tarea.expertoAsignado}</span>
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
                        Mover a En Proceso
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
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{tarea.expertoAsignado}</span>
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
                        Marcar Completada
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
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900">{tarea.titulo}</h5>
                      <FaCheckCircle className="text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tarea.descripcion}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{tarea.expertoAsignado}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPrioridadColor(tarea.prioridad)}`}>
                        {getPrioridadTexto(tarea.prioridad)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Completada el {new Date(tarea.fechaCreacion).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal para Agregar Tarea */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Agregar Nueva Tarea</h3>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la Tarea
                  </label>
                  <input
                    type="text"
                    value={newTask.titulo}
                    onChange={(e) => setNewTask(prev => ({ ...prev, titulo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={newTask.descripcion}
                    onChange={(e) => setNewTask(prev => ({ ...prev, descripcion: e.target.value }))}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experto Asignado
                  </label>
                  <select
                    value={newTask.expertoAsignado}
                    onChange={(e) => setNewTask(prev => ({ ...prev, expertoAsignado: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Seleccionar experto</option>
                    {expertosAsignados.map((experto) => (
                      <option key={experto.ID} value={experto.nombre_experto}>
                        {experto.nombre_experto}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={newTask.prioridad}
                    onChange={(e) => setNewTask(prev => ({ ...prev, prioridad: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Límite
                  </label>
                  <input
                    type="date"
                    value={newTask.fechaLimite}
                    onChange={(e) => setNewTask(prev => ({ ...prev, fechaLimite: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Crear Tarea
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 