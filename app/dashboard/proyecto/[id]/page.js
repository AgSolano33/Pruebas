"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaClock,
  FaListUl,
  FaUsers,
  FaCheckCircle,
  FaPlay,
  FaPause,
  FaStop,
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaRocket,
  FaChartBar,
} from "react-icons/fa";

export default function ProyectoDashboardPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();

  // --- Estado del componente
  const [proyecto, setProyecto] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // --- Helpers: userId efectivo SIN tocar auth
  const getEffectiveUserId = () => {
    const qs =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const fromQS = qs?.get("forceUserId");
    const fromLS =
      typeof window !== "undefined"
        ? window.localStorage.getItem("mongoUserId")
        : null;
    const fromSession =
      session?.user?.id || session?.user?._id || session?.user?.userId || "";
    return (fromQS || fromLS || fromSession || "").trim();
  };

  // --- Configuración de estados
  const estadosConfig = {
    aprobacion: {
      label: "En Aprobación",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: FaClock,
      descripcion: "Proyecto en revisión, pendiente de aprobación"
    },
    publicado: {
      label: "Publicado",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: FaEye,
      descripcion: "Proyecto visible para expertos"
    },
    en_espera: {
      label: "En Espera",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: FaPause,
      descripcion: "Esperando expertos disponibles"
    },
    en_proceso: {
      label: "En Proceso",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: FaPlay,
      descripcion: "Proyecto en desarrollo activo"
    },
    completado: {
      label: "Completado",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: FaCheck,
      descripcion: "Proyecto finalizado exitosamente"
    },
    cancelado: {
      label: "Cancelado",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: FaTimes,
      descripcion: "Proyecto cancelado"
    }
  };

  // --- Logs breves (puedes quitar después)
  useEffect(() => {
    if (session) {
      console.log("[DEBUG] session.user:", session.user);
    }
  }, [session]);

  // --- Cargar proyectos y estadísticas
  const fetchProyectos = async () => {
    try {
      setLoading(true);

      const effectiveUserId = getEffectiveUserId();
      if (!effectiveUserId) {
        setError(
          "No se encontró userId. Usa ?forceUserId=<id> o localStorage.setItem('mongoUserId','<id>')"
        );
        setProyectos([]);
        setProyecto(null);
        return;
      }

      // Cargar proyectos con filtro de estado
      const estadoParam = filtroEstado !== "todos" ? `&estado=${filtroEstado}` : "";
      const url = `/api/assistant/ProyectosPre/${encodeURIComponent(effectiveUserId)}${estadoParam}`;

      console.log("[DEBUG] Fetch proyectos:", url);

      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const lista = Array.isArray(data?.proyectos) ? data.proyectos : [];
      setProyectos(lista);

      // Cargar estadísticas
      await fetchEstadisticas(effectiveUserId);

      // Seleccionar proyecto
      let seleccionado = null;
      if (params?.id) {
        const targetId = Array.isArray(params.id) ? params.id[0] : params.id;
        seleccionado = lista.find(
          (p) => String(p._id) === String(targetId) || String(p.id) === String(targetId)
        );
      }
      if (!seleccionado && lista.length > 0) {
        seleccionado = lista[0];
      }

      setProyecto(seleccionado);
      setError(null);
    } catch (err) {
      setError(err?.message || "Error al cargar proyectos");
      setProyectos([]);
      setProyecto(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Cargar estadísticas
  const fetchEstadisticas = async (userId) => {
    try {
      const res = await fetch(`/api/assistant/ProyectosPre/estadisticas?userId=${userId}`, {
        cache: "no-store"
      });
      const data = await res.json();
      
      if (res.ok) {
        setEstadisticas(data.data);
      }
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    }
  };

  // --- Funciones para cambiar estado
  const cambiarEstadoProyecto = async (proyectoId, nuevoEstado, datosAdicionales = {}) => {
    try {
      setCambiandoEstado(true);
      const effectiveUserId = getEffectiveUserId();
      
      const res = await fetch(`/api/assistant/ProyectosPre/${effectiveUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proyectoId,
          nuevoEstado,
          datosAdicionales
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Error al cambiar estado');
      }

      toast.success(`Proyecto ${nuevoEstado} exitosamente`);
      
      // Actualizar el proyecto local
      setProyecto(prev => prev?._id === proyectoId ? data.data : prev);
      
      // Recargar lista de proyectos
      await fetchProyectos();
      
    } catch (err) {
      toast.error(err.message || 'Error al cambiar estado del proyecto');
      console.error('Error al cambiar estado:', err);
    } finally {
      setCambiandoEstado(false);
    }
  };

  // --- Función para publicar proyecto con matching
  const publicarProyecto = async (proyectoId, datosAdicionales = {}) => {
    try {
      setCambiandoEstado(true);
      const effectiveUserId = getEffectiveUserId();
      
      const res = await fetch('/api/assistant/ProyectosPre/publicado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proyectoId,
          userId: effectiveUserId,
          datosAdicionales
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Error al publicar proyecto');
      }

      toast.success(data.message || 'Proyecto publicado exitosamente');
      
      // Actualizar el proyecto local
      setProyecto(prev => prev?._id === proyectoId ? data.data : prev);
      
      // Recargar lista de proyectos
      await fetchProyectos();
      
    } catch (err) {
      toast.error(err.message || 'Error al publicar proyecto');
      console.error('Error al publicar proyecto:', err);
    } finally {
      setCambiandoEstado(false);
    }
  };

  // --- Disparar la carga una vez que tenemos la página lista
  useEffect(() => {
    fetchProyectos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, session?.user, filtroEstado]); // si cambia user, id de la ruta o filtro, recarga

  // --- Derivados de UI
  const totalProyectos = proyectos.length;
  const proyectosEnProceso = proyectos.filter(p => p.estado === 'en_proceso').length;
  const proyectosPublicados = proyectos.filter(p => p.estado === 'publicado').length;
  const proyectosCompletados = proyectos.filter(p => p.estado === 'completado').length;
  
  // Calcular progreso basado en el estado del proyecto actual
  const calcularProgreso = (estado) => {
    const progresoPorEstado = {
      aprobacion: 10,
      publicado: 25,
      en_espera: 30,
      en_proceso: 60,
      completado: 100,
      cancelado: 0
    };
    return progresoPorEstado[estado] || 0;
  };
  
  const progreso = proyecto ? calcularProgreso(proyecto.estado) : 0;

  // --- Funciones auxiliares
  const obtenerConfigEstado = (estado) => {
    return estadosConfig[estado] || estadosConfig.aprobacion;
  };

  const puedeCambiarA = (estadoActual, nuevoEstado) => {
    const transicionesPermitidas = {
      aprobacion: ['publicado', 'cancelado'],
      publicado: ['en_espera', 'en_proceso', 'cancelado'],
      en_espera: ['publicado', 'cancelado'],
      en_proceso: ['completado', 'cancelado'],
      completado: [],
      cancelado: []
    };
    return transicionesPermitidas[estadoActual]?.includes(nuevoEstado) || false;
  };

  // --- UI de estados
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A3D7C]" />
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
            No hay proyectos publicados que coincidan con esta vista.
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

  // --- Render (front intacto, pero datos solo del proyecto)
  return (
    <div className="min-h-screen bg-gray-50 border-red-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-grey-200 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6 ">
            <div className="flex items-center gap-20 ">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                <FaArrowLeft />
                Regresar
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 max-w-2xl text-center">
                  {proyecto?.nombreProyecto || "Proyecto"}
                </h1>
              </div>
              <div className="flex flex-col gap-2 ">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  DETALLES DEL PROYECTO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <FaListUl className="text-blue-600 text-xl" />
              <span className="font-semibold text-blue-900 text-lg">
                Total Proyectos
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {totalProyectos}
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <FaEye className="text-green-600 text-xl" />
              <span className="font-semibold text-green-900 text-lg">
                Publicados
              </span>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {proyectosPublicados}
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <FaPlay className="text-yellow-600 text-xl" />
              <span className="font-semibold text-yellow-900 text-lg">
                En Proceso
              </span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">
              {proyectosEnProceso}
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <FaCheck className="text-emerald-600 text-xl" />
              <span className="font-semibold text-emerald-900 text-lg">
                Completados
              </span>
            </div>
            <div className="text-3xl font-bold text-emerald-600">
              {proyectosCompletados}
            </div>
          </div>
        </div>

        {/* Información del proyecto */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Estado del proyecto */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {(() => {
                    const config = obtenerConfigEstado(proyecto?.estado);
                    const IconComponent = config.icon;
                    return (
                      <>
                        <div className={`px-3 py-1 rounded-full border ${config.color} flex items-center gap-2`}>
                          <IconComponent className="text-sm" />
                          <span className="font-medium text-sm">{config.label}</span>
                        </div>
                        <span className="text-sm text-gray-500">{config.descripcion}</span>
                      </>
                    );
                  })()}
                </div>
                
                {/* Progreso visual */}
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${progreso}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{progreso}%</span>
                </div>
              </div>

              {/* Información del proyecto */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Resumen</h4>
                  <p className="text-sm text-gray-700">
                    {proyecto?.resumenProyecto || "Sin resumen"}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {proyecto?.descripcionProyecto || "Sin descripción"}
                  </p>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Creado:</span>
                    <p className="text-gray-600">
                      {proyecto?.createdAt ? new Date(proyecto.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Actualizado:</span>
                    <p className="text-gray-600">
                      {proyecto?.updatedAt ? new Date(proyecto.updatedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de acciones */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
              
              <div className="space-y-3">
                {/* Botón de publicación especial */}
                {proyecto?.estado === 'aprobacion' && (
                  <button
                    onClick={() => publicarProyecto(proyecto._id, {
                      nombreEmpresa: "Mi Empresa",
                      industria: "General"
                    })}
                    disabled={cambiandoEstado}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FaRocket />
                    {cambiandoEstado ? 'Publicando...' : 'Publicar Proyecto'}
                  </button>
                )}

                {/* Botones de cambio de estado */}
                {proyecto?.estado && proyecto.estado !== 'completado' && proyecto.estado !== 'cancelado' && (
                  <div className="space-y-2">
                    {Object.entries(estadosConfig).map(([estado, config]) => {
                      if (estado === proyecto.estado || !puedeCambiarA(proyecto.estado, estado)) {
                        return null;
                      }
                      
                      const IconComponent = config.icon;
                      return (
                        <button
                          key={estado}
                          onClick={() => cambiarEstadoProyecto(proyecto._id, estado)}
                          disabled={cambiandoEstado}
                          className={`w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 ${
                            estado === 'cancelado' 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          <IconComponent />
                          {cambiandoEstado ? 'Cambiando...' : `Cambiar a ${config.label}`}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Botón de cancelación */}
                {proyecto?.estado && proyecto.estado !== 'completado' && proyecto.estado !== 'cancelado' && (
                  <button
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de que quieres cancelar este proyecto?')) {
                        cambiarEstadoProyecto(proyecto._id, 'cancelado', {
                          motivoCancelacion: 'Cancelado por el usuario',
                          fechaCancelacion: new Date().toISOString()
                        });
                      }
                    }}
                    disabled={cambiandoEstado}
                    className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FaTimes />
                    {cambiandoEstado ? 'Cancelando...' : 'Cancelar Proyecto'}
                  </button>
                )}

                {/* Información adicional para proyectos publicados */}
                {proyecto?.estado === 'publicado' && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      <FaEye className="inline mr-1" />
                      Este proyecto es visible para expertos
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lista de proyectos con filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Tus proyectos ({proyectos.length})
            </h3>
            
            {/* Filtro por estado */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                {Object.entries(estadosConfig).map(([estado, config]) => (
                  <option key={estado} value={estado}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proyectos.map((p) => {
              const config = obtenerConfigEstado(p.estado);
              const IconComponent = config.icon;
              
              return (
                <div
                  key={p._id || p.id}
                  className={`p-4 rounded-lg border ${
                    p._id === proyecto?._id ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">
                        {p.nombreProyecto || "Proyecto"}
                      </h4>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
                        <IconComponent />
                        <span>{config.label}</span>
                      </div>
                    </div>
                    {p._id === proyecto?._id ? (
                      <FaCheckCircle className="text-green-500 mt-1" />
                    ) : null}
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {p.resumenProyecto || "Sin resumen"}
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setProyecto(p)}
                      className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors"
                    >
                      Ver detalles
                    </button>
                    
                    <span className="text-xs text-gray-500">
                      {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {proyectos.length === 0 && (
              <div className="col-span-full text-center py-8">
                <div className="text-gray-500 mb-2">
                  {filtroEstado === 'todos' 
                    ? 'No tienes proyectos creados todavía.'
                    : `No tienes proyectos en estado "${estadosConfig[filtroEstado]?.label || filtroEstado}".`
                  }
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Crear Proyecto
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
