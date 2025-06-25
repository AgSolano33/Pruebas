"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaBell, FaEye, FaCheck, FaTimes, FaIndustry, FaChartLine, FaCalendar, FaDollarSign } from "react-icons/fa";

export default function NotificacionesExperto() {
  const { data: session } = useSession();
  const [notificaciones, setNotificaciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [notificacionSeleccionada, setNotificacionSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotificaciones();
    }
  }, [session, filtroEstado]);

  const fetchNotificaciones = async () => {
    try {
      setLoading(true);
      const url = filtroEstado === "todos" 
        ? "/api/expertos/notificaciones"
        : `/api/expertos/notificaciones?estado=${filtroEstado}`;
        
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setNotificaciones(result.data);
        setEstadisticas(result.estadisticas);
      } else {
        setError(result.error || 'Error al cargar las notificaciones');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadoNotificacion = async (notificacionId, nuevoEstado, respuesta = null) => {
    try {
      const response = await fetch("/api/expertos/notificaciones", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificacionId,
          estado: nuevoEstado,
          respuesta
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Actualizar la notificación en el estado local
        setNotificaciones(prev => 
          prev.map(notif => 
            notif._id === notificacionId 
              ? { ...notif, estado: nuevoEstado, ...(respuesta && { respuestaExperto: respuesta }) }
              : notif
          )
        );
        
        // Recargar estadísticas
        fetchNotificaciones();
        
        if (mostrarModal) {
          setMostrarModal(false);
          setNotificacionSeleccionada(null);
        }
      } else {
        setError(result.error || 'Error al actualizar la notificación');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "vista":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "aceptada":
        return "bg-green-100 text-green-800 border-green-200";
      case "rechazada":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "vista":
        return "Vista";
      case "aceptada":
        return "Aceptada";
      case "rechazada":
        return "Rechazada";
      default:
        return estado;
    }
  };

  const abrirModal = (notificacion) => {
    setNotificacionSeleccionada(notificacion);
    setMostrarModal(true);
    
    // Marcar como vista si está pendiente
    if (notificacion.estado === "pendiente") {
      actualizarEstadoNotificacion(notificacion._id, "vista");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A3D7C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-[#1A3D7C]">
                {Object.values(estadisticas).reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <FaBell className="text-2xl text-[#1A3D7C]" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {estadisticas.pendiente || 0}
              </p>
            </div>
            <FaBell className="text-2xl text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aceptadas</p>
              <p className="text-2xl font-bold text-green-600">
                {estadisticas.aceptada || 0}
              </p>
            </div>
            <FaCheck className="text-2xl text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rechazadas</p>
              <p className="text-2xl font-bold text-red-600">
                {estadisticas.rechazada || 0}
              </p>
            </div>
            <FaTimes className="text-2xl text-red-600" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center">
        <h3 className="text-lg font-semibold text-gray-700">Filtrar por estado:</h3>
        <div className="flex flex-wrap gap-2">
          {["todos", "pendiente", "vista", "aceptada", "rechazada"].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroEstado === estado
                  ? "bg-[#1A3D7C] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {estado === "todos" ? "Todos" : getEstadoTexto(estado)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de notificaciones */}
      {notificaciones.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <FaBell className="text-6xl mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No hay notificaciones</h3>
          <p>Las solicitudes de proyectos aparecerán aquí cuando hagas match</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notificaciones.map((notificacion) => (
            <div
              key={notificacion._id}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(notificacion.estado)}`}>
                    {getEstadoTexto(notificacion.estado)}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaChartLine />
                    <span>{notificacion.puntuacionMatch}% compatibilidad</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {new Date(notificacion.fechaCreacion).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#1A3D7C] mb-1">
                  {notificacion.nombreEmpresa}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {notificacion.nombreProyecto}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <FaIndustry />
                    <span>{notificacion.industria}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaChartLine />
                    <span>{notificacion.industriaMejor}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                  {notificacion.descripcionProyecto}
                </p>
                
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Servicios buscados:</h4>
                  <div className="flex flex-wrap gap-1">
                    {notificacion.categoriasServicioBuscado.map((categoria, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {categoria}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Análisis de compatibilidad:</h4>
                  <p className="text-sm text-gray-700">
                    {notificacion.analisisMatch}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => abrirModal(notificacion)}
                  className="flex-1 bg-[#1A3D7C] text-white px-4 py-2 rounded-lg hover:bg-[#0f2a5a] transition-colors"
                >
                  Ver detalles
                </button>
                
                {notificacion.estado === "vista" && (
                  <>
                    <button
                      onClick={() => actualizarEstadoNotificacion(notificacion._id, "aceptada")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => actualizarEstadoNotificacion(notificacion._id, "rechazada")}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Rechazar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {mostrarModal && notificacionSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-[#1A3D7C]">
                Detalles del Proyecto
              </h2>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Empresa:</h3>
                <p className="text-lg font-bold text-[#1A3D7C]">
                  {notificacionSeleccionada.nombreEmpresa}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Proyecto:</h3>
                <p className="text-gray-700">
                  {notificacionSeleccionada.nombreProyecto}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Industria:</h3>
                <p className="text-gray-700">
                  {notificacionSeleccionada.industria}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Descripción:</h3>
                <p className="text-gray-700">
                  {notificacionSeleccionada.descripcionProyecto}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Servicios buscados:</h3>
                <div className="flex flex-wrap gap-2">
                  {notificacionSeleccionada.categoriasServicioBuscado.map((categoria, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {categoria}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Análisis de compatibilidad:</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-3">
                    {notificacionSeleccionada.analisisMatch}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Industria mejor alineada: {notificacionSeleccionada.industriaMejor}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {notificacionSeleccionada.puntuacionMatch}% match
                    </span>
                  </div>
                </div>
              </div>
              
              {notificacionSeleccionada.razonesMatch.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700">Razones del match:</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {notificacionSeleccionada.razonesMatch.map((razon, index) => (
                      <li key={index}>{razon}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setMostrarModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cerrar
              </button>
              
              {notificacionSeleccionada.estado === "vista" && (
                <>
                  <button
                    onClick={() => actualizarEstadoNotificacion(notificacionSeleccionada._id, "aceptada")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Aceptar Proyecto
                  </button>
                  <button
                    onClick={() => actualizarEstadoNotificacion(notificacionSeleccionada._id, "rechazada")}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Rechazar Proyecto
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 