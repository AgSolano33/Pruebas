"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaUsers, FaChartLine, FaClock, FaIndustry, FaCheckCircle, FaTimesCircle, FaSpinner, FaEye, FaTimes, FaBan } from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";

export default function ProyectosTablero() {
  const { data: session } = useSession();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [proyectoDetalle, setProyectoDetalle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelandoProyecto, setCancelandoProyecto] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning"
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchProyectos();
    }
  }, [session, filtroEstado]);

  // Manejar cierre del modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        handleCerrarModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      const url = filtroEstado === "todos" 
        ? "/api/proyectos-publicados"
        : `/api/proyectos-publicados?estado=${filtroEstado}`;
        
      const response = await fetch(url);
      const result = await response.json();

      if (result.success && result.data) {
        setProyectos(result.data);
      } else {
        setError(result.error || 'Error al cargar los proyectos');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "publicado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "en_espera":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "en_proceso":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completado":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "publicado":
        return <FaUsers className="text-blue-600" />;
      case "en_espera":
        return <FaClock className="text-orange-600" />;
      case "en_proceso":
        return <FaSpinner className="text-yellow-600" />;
      case "completado":
        return <FaCheckCircle className="text-green-600" />;
      case "cancelado":
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaUsers className="text-gray-600" />;
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case "publicado":
        return "Publicado";
      case "en_espera":
        return "En Espera";
      case "en_proceso":
        return "En Proceso";
      case "completado":
        return "Completado";
      case "cancelado":
        return "Cancelado";
      default:
        return estado;
    }
  };

  const handleVerDetalles = (proyecto) => {
    setProyectoDetalle(proyecto);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setProyectoDetalle(null);
  };

  const handleCancelarProyecto = async (proyectoId) => {
    const proyecto = proyectos.find(p => p._id === proyectoId);
    
    setConfirmDialog({
      isOpen: true,
      title: "Cancelar Proyecto",
      message: `¿Estás seguro de que deseas cancelar el proyecto "${proyecto?.nombreProyecto}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        setCancelandoProyecto(proyectoId);
        
        try {
          const response = await fetch("/api/proyectos-publicados", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              proyectoId,
              nuevoEstado: "cancelado"
            }),
          });

          const result = await response.json();

          if (result.success) {
            toast.success("Proyecto cancelado exitosamente");
            // Actualizar la lista de proyectos
            setProyectos(proyectos.map(proyecto => 
              proyecto._id === proyectoId 
                ? { ...proyecto, estado: "cancelado" }
                : proyecto
            ));
          } else {
            toast.error(result.error || "Error al cancelar el proyecto");
          }
        } catch (error) {
          console.error("Error al cancelar proyecto:", error);
          toast.error("Error al cancelar el proyecto");
        } finally {
          setCancelandoProyecto(null);
          setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" });
        }
      },
      type: "warning"
    });
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
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center">
        <h3 className="text-lg font-semibold text-gray-700">Filtrar por estado:</h3>
        <div className="flex flex-wrap gap-2">
          {["todos", "publicado", "en_espera", "en_proceso", "completado", "cancelado"].map((estado) => (
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

      {/* Tablero */}
      {proyectos.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <FaUsers className="text-6xl mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No hay proyectos publicados</h3>
          <p>Los proyectos que publiques aparecerán aquí</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((proyecto) => (
            <div
              key={proyecto._id}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Header de la tarjeta */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {getEstadoIcon(proyecto.estado)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(proyecto.estado)}`}>
                      {getEstadoTexto(proyecto.estado)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {new Date(proyecto.fechaPublicacion).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-[#1A3D7C] mb-1">
                  {proyecto.nombreEmpresa}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {proyecto.nombreProyecto}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FaIndustry />
                  <span>{proyecto.industria}</span>
                </div>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-4">
                {/* Análisis de OpenAI */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaChartLine />
                    Análisis de Compatibilidad
                  </h4>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">
                      {proyecto.analisisOpenAI.match}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        Industria: {proyecto.analisisOpenAI.industriaMejor}
                      </span>
                      <span className="text-xs font-semibold text-blue-600">
                        {proyecto.analisisOpenAI.puntuacionMatch}% match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Categorías de servicio */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Servicios Buscados:</h4>
                  <div className="flex flex-wrap gap-1">
                    {proyecto.categoriasServicioBuscado.map((categoria, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {categoria}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Objetivo */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Objetivo:</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {proyecto.objetivoEmpresa}
                  </p>
                </div>

                {/* Estadísticas */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1">
                    <FaUsers />
                    <span>{proyecto.matchesGenerados} expertos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>{new Date(proyecto.fechaPublicacion).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>

                {/* Botón de detalles */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerDetalles(proyecto)}
                      className="flex-1 bg-[#1A3D7C] text-white px-4 py-2 rounded-lg hover:bg-[#0f2a5a] transition-colors flex items-center justify-center gap-2"
                    >
                      <FaEye />
                      Ver Detalles
                    </button>
                    
                    {/* Botón de cancelar - solo mostrar si no está cancelado */}
                    {proyecto.estado !== "cancelado" && (
                      <button
                        onClick={() => handleCancelarProyecto(proyecto._id)}
                        disabled={cancelandoProyecto === proyecto._id}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center justify-center gap-2"
                      >
                        {cancelandoProyecto === proyecto._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaBan />
                        )}
                        {cancelandoProyecto === proyecto._id ? "Cancelando..." : "Cancelar"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalles */}
      {showModal && proyectoDetalle && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleCerrarModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#1A3D7C]">Detalles del Proyecto</h2>
              <button
                onClick={handleCerrarModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Información General</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Empresa:</span>
                      <p className="text-gray-900">{proyectoDetalle.nombreEmpresa}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Proyecto:</span>
                      <p className="text-gray-900">{proyectoDetalle.nombreProyecto}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Industria:</span>
                      <p className="text-gray-900">{proyectoDetalle.industria}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Estado:</span>
                      <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(proyectoDetalle.estado)}`}>
                        {getEstadoTexto(proyectoDetalle.estado)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Fechas y Estadísticas</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Fecha de Publicación:</span>
                      <p className="text-gray-900">
                        {new Date(proyectoDetalle.fechaPublicacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Expertos Encontrados:</span>
                      <p className="text-gray-900">{proyectoDetalle.matchesGenerados} expertos</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">ID del Proyecto:</span>
                      <p className="text-gray-900 font-mono text-sm">{proyectoDetalle._id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Objetivo del proyecto */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Objetivo del Proyecto</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 leading-relaxed">{proyectoDetalle.objetivoEmpresa}</p>
                </div>
              </div>

              {/* Categorías de servicio */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Servicios Buscados</h3>
                <div className="flex flex-wrap gap-2">
                  {proyectoDetalle.categoriasServicioBuscado.map((categoria, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-[#1A3D7C] text-white text-sm rounded-lg font-medium"
                    >
                      {categoria}
                    </span>
                  ))}
                </div>
              </div>

              {/* Análisis de OpenAI */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaChartLine />
                  Análisis de Compatibilidad
                </h3>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Análisis General</h4>
                      <p className="text-gray-700 leading-relaxed">{proyectoDetalle.analisisOpenAI.match}</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Industria Mejor:</span>
                        <p className="text-gray-900">{proyectoDetalle.analisisOpenAI.industriaMejor}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Puntuación de Match:</span>
                        <p className="text-gray-900 font-semibold text-lg">{proyectoDetalle.analisisOpenAI.puntuacionMatch}%</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Razones del análisis */}
                  {proyectoDetalle.analisisOpenAI.razones && proyectoDetalle.analisisOpenAI.razones.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Razones del Análisis</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {proyectoDetalle.analisisOpenAI.razones.map((razon, index) => (
                          <li key={index} className="text-gray-700">{razon}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del usuario */}
              {proyectoDetalle.userId && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Información del Cliente</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-700">Nombre:</span>
                        <p className="text-gray-900">{proyectoDetalle.userId.name || 'No disponible'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <p className="text-gray-900">{proyectoDetalle.userId.email || 'No disponible'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={handleCerrarModal}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />
    </div>
  );
} 