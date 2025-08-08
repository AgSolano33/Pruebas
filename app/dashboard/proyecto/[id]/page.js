"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaPlus,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaListUl,
  FaChartBar,
  FaUsers,
  FaRocket,
  FaTimes,
} from "react-icons/fa";
import postulacionesStore from "@/libs/postulacionesStore";
import tareasStore from "@/libs/tareasStore";

export default function ProyectoDashboardPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tareas, setTareas] = useState({
    porHacer: [],
    enProceso: [],
    terminadas: [],
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    titulo: "",
    descripcion: "",
    expertoAsignado: "",
    prioridad: "media",
    fechaLimite: "",
  });
  const [expertosAsignados, setExpertosAsignados] = useState([]);
  const [expertosData, setExpertosData] = useState(null);

  useEffect(() => {
    if (session?.user?.id && params.id) {
      fetchProyecto();
      fetchExpertosData();
    }
  }, [session, params.id]);

  useEffect(() => {
    if (proyecto && expertosData) {
      actualizarExpertosAsignados();
      cargarTareas();
    }
  }, [proyecto, expertosData]);

  // Suscribirse a cambios en el store de postulaciones
  useEffect(() => {
    if (proyecto) {
      const unsubscribe = postulacionesStore.subscribe(() => {
        actualizarExpertosAsignados();
      });
      return unsubscribe;
    }
  }, [proyecto]);

  // Suscribirse a cambios en el store de tareas
  useEffect(() => {
    if (proyecto) {
      const unsubscribe = tareasStore.subscribe(() => {
        cargarTareas();
      });
      return unsubscribe;
    }
  }, [proyecto]);

  const fetchProyecto = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/proyectos-publicados?id=${params.id}`);
      const result = await response.json();

      if (result.success && result.data) {
        setProyecto(result.data);
      } else {
        setError(result.error || "Error al cargar el proyecto");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpertosData = async () => {
    try {
      const response = await fetch("/expertos.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setExpertosData(data);
    } catch (error) {
      console.error("Error al cargar datos de expertos:", error);
      setExpertosData([]);
    }
  };

  const actualizarExpertosAsignados = () => {
    if (!proyecto) return;

    const postulaciones = postulacionesStore.getPostulaciones(proyecto._id);
    const expertosAceptados = postulaciones
      .filter((post) => post.estado === "aceptada")
      .map((post) => post.experto);

    if (expertosAceptados.length === 0) {
      setExpertosAsignados([
        {
          nombre: "Pedro García",
          _id: "pedro_001",
          semblanza: "Experto en servicios digitales",
        },
      ]);
    } else {
      setExpertosAsignados(expertosAceptados);
    }

    const tareasExistentes = tareasStore.getTareas(proyecto._id);
    if (
      tareasExistentes.porHacer.length === 0 &&
      tareasExistentes.enProceso.length === 0 &&
      tareasExistentes.terminadas.length === 0
    ) {
      tareasStore.inicializarTareasPorDefecto(
        proyecto._id,
        expertosAceptados[0]?.nombre || "Pedro García",
      );
    }
  };

  const cargarTareas = () => {
    if (!proyecto) return;

    const tareasDelProyecto = tareasStore.getTareas(proyecto._id);
    setTareas(tareasDelProyecto);
  };

  const handleAddTask = (e) => {
    e.preventDefault();

    const task = {
      ...newTask,
    };

    const success = tareasStore.agregarTarea(proyecto._id, task);

    if (success) {
      setNewTask({
        titulo: "",
        descripcion: "",
        expertoAsignado: expertosAsignados[0]?.nombre || "",
        prioridad: "media",
        fechaLimite: "",
      });
      setShowAddTask(false);
    }
  };

  const moveTask = (taskId, fromColumn, toColumn) => {
    const success = tareasStore.moverTarea(
      proyecto._id,
      taskId,
      fromColumn,
      toColumn,
    );
    if (!success) {
      console.log("Error al mover tarea");
    }
  };

  const deleteTask = (taskId, column) => {
    const success = tareasStore.eliminarTarea(proyecto._id, taskId, column);
    if (!success) {
      console.log("Error al eliminar tarea");
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return "bg-red-100 text-red-800 border-red-200";
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baja":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPrioridadTexto = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return "Alta";
      case "media":
        return "Media";
      case "baja":
        return "Baja";
      default:
        return "Sin prioridad";
    }
  };

  const calcularProgreso = () => {
    const total =
      tareas.porHacer.length +
      tareas.enProceso.length +
      tareas.terminadas.length;
    if (total === 0) return 0;
    return Math.round((tareas.terminadas.length / total) * 100);
  };

  const totalTareas =
    tareas.porHacer.length + tareas.enProceso.length + tareas.terminadas.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A3D7C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => router.back()}
            className="bg-[#1A3D7C] text-white px-6 py-2 rounded-lg hover:bg-[#0f2a5a] transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">
            Proyecto no encontrado
          </div>
          <button
            onClick={() => router.back()}
            className="bg-[#1A3D7C] text-white px-6 py-2 rounded-lg hover:bg-[#0f2a5a] transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 border-red-200">
      {/* Header Principal */}
      <div className="bg-white shadow-sm border-b border-grey-200 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6 ">
            {/* Lado izquierdo - Botón regresar y título */}
            <div className="flex items-center  gap-20 ">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                <FaArrowLeft />
                Regresar
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 max-w-2xl text-center">
                  {proyecto.nombreProyecto}
                </h1>
              </div>

              {/* Lado derecho - Botones de acción */}
              <div className="flex flex-col gap-2 ">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  DETALLES DEL PROYECTO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas del Proyecto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <FaListUl className="text-green-600 text-xl" />
              <span className="font-semibold text-green-900 text-lg">
                Total Tareas
              </span>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {totalTareas}
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <FaClock className="text-yellow-600 text-xl" />
              <span className="font-semibold text-yellow-900 text-lg">
                En Proceso
              </span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">
              {tareas.enProceso.length}
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <FaUsers className="text-purple-600 text-xl" />
              <span className="font-semibold text-purple-900 text-lg">
                Expertos
              </span>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {expertosAsignados.length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sección de Progreso */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex">
              <div className="flex-1 pl-10 p-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Progreso
                </h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg
                      className="w-32 h-32 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray={`${calcularProgreso()}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {calcularProgreso()}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Completadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">En Proceso</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-red-500 justify-center pr-10">
                <button
                  onClick={() => setShowAddTask(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Agregar Tarea
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Mis minutas
                </button>
              </div>
            </div>
          </div>

          {/* Sección de Expertos Asignados */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Expertos Asignados al Proyecto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expertosAsignados.map((experto, index) => (
                  <div
                    key={experto.ID || experto._id || index}
                    className="bg-gray-50 p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-indigo-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg">
                          {experto.nombre_experto ||
                            experto.nombre ||
                            "Alejandra"}
                        </h4>
                        <p className="text-sm text-gray-600">Experiencia</p>
                        <p className="text-xs text-gray-500">correo@gmail.co</p>
                        <p className="text-xs text-gray-500">614 345</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tablero Kanban */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Avances del Proyecto
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Por Hacer */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                Por Hacer ({tareas.porHacer.length})
              </h4>
              <div className="space-y-3">
                {tareas.porHacer.map((tarea) => (
                  <div
                    key={tarea.id}
                    className="bg-white p-4 rounded-lg border shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-medium text-gray-900">
                        {tarea.titulo}
                      </h5>
                      <button
                        onClick={() => deleteTask(tarea.id, "porHacer")}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {tarea.descripcion}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">
                        {tarea.expertoAsignado}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getPrioridadColor(tarea.prioridad)}`}
                      >
                        {getPrioridadTexto(tarea.prioridad)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Vence: {tarea.fechaLimite}
                      </span>
                      <button
                        onClick={() =>
                          moveTask(tarea.id, "porHacer", "enProceso")
                        }
                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
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
                  <div
                    key={tarea.id}
                    className="bg-white p-4 rounded-lg border shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-medium text-gray-900">
                        {tarea.titulo}
                      </h5>
                      <button
                        onClick={() => deleteTask(tarea.id, "enProceso")}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {tarea.descripcion}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">
                        {tarea.expertoAsignado}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getPrioridadColor(tarea.prioridad)}`}
                      >
                        {getPrioridadTexto(tarea.prioridad)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Vence: {tarea.fechaLimite}
                      </span>
                      <button
                        onClick={() =>
                          moveTask(tarea.id, "enProceso", "terminadas")
                        }
                        className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
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
                  <div
                    key={tarea.id}
                    className="bg-white p-4 rounded-lg border shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-medium text-gray-900">
                        {tarea.titulo}
                      </h5>
                      <FaCheckCircle className="text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {tarea.descripcion}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">
                        {tarea.expertoAsignado}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getPrioridadColor(tarea.prioridad)}`}
                      >
                        {getPrioridadTexto(tarea.prioridad)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Completada el{" "}
                      {new Date(tarea.fechaCreacion).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal para Agregar Tarea */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg border shadow-sm max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-medium text-gray-900 text-lg">
                  Nueva Tarea
                </h5>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    placeholder="Título de la tarea"
                    value={newTask.titulo}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        titulo: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    placeholder="Descripción"
                    value={newTask.descripcion}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        descripcion: e.target.value,
                      }))
                    }
                    rows="3"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asignar a
                  </label>
                  <select
                    value={newTask.expertoAsignado}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        expertoAsignado: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Seleccionar experto</option>
                    {expertosAsignados.map((experto) => (
                      <option
                        key={experto._id || experto.ID}
                        value={experto.nombre || experto.nombre_experto}
                      >
                        {experto.nombre || experto.nombre_experto}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridad
                    </label>
                    <select
                      value={newTask.prioridad}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          prioridad: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha límite
                    </label>
                    <input
                      type="date"
                      value={newTask.fechaLimite}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          fechaLimite: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
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
