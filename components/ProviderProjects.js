"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaUsers, FaChartLine, FaClock, FaIndustry, FaEye, FaCheck, FaSpinner, FaFilter } from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";

export default function ProviderProjects() {
  const { data: session } = useSession();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroIndustria, setFiltroIndustria] = useState("todos");
  const [filtroCompatibilidad, setFiltroCompatibilidad] = useState("todos");
  const [proyectoDetalle, setProyectoDetalle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [aplicando, setAplicando] = useState(null);
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
  }, [session, filtroIndustria, filtroCompatibilidad]);

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
      console.log("Fetching projects for provider...");
      
      const response = await fetch("/api/proyectos-publicados?estado=publicado&userType=provider");
      const result = await response.json();
      
      console.log("Projects API response:", result);

      if (result.success && result.data) {
        console.log("Found projects:", result.data.length);
        
        // Calcular compatibilidad para cada proyecto
        const proyectosConCompatibilidad = await Promise.all(
          result.data.map(async (proyecto) => {
            try {
              console.log("Calculating compatibility for project:", proyecto._id);
              
              const compatibilidadResponse = await fetch("/api/expert-matching/calcular-compatibilidad", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  proyectoId: proyecto._id,
                  expertoId: session.user.id
                }),
              });
              
              const compatibilidadResult = await compatibilidadResponse.json();
              console.log("Compatibility result for project", proyecto._id, ":", compatibilidadResult);
              
              return {
                ...proyecto,
                compatibilidad: compatibilidadResult.success ? compatibilidadResult.data : {
                  puntuacion: 0,
                  razones: ["No se pudo calcular la compatibilidad"]
                }
              };
            } catch (error) {
              console.error('Error calculando compatibilidad:', error);
              return {
                ...proyecto,
                compatibilidad: {
                  puntuacion: 0,
                  razones: ["Error al calcular compatibilidad"]
                }
              };
            }
          })
        );

        console.log("Projects with compatibility:", proyectosConCompatibilidad);
        setProyectos(proyectosConCompatibilidad);
      } else {
        console.error("Error in API response:", result.error);
        setError(result.error || 'Error al cargar los proyectos');
      }
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      setError('Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  };

  const getCompatibilidadColor = (puntuacion) => {
    if (puntuacion >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (puntuacion >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (puntuacion >= 40) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getCompatibilidadTexto = (puntuacion) => {
    if (puntuacion >= 80) return "Excelente";
    if (puntuacion >= 60) return "Buena";
    if (puntuacion >= 40) return "Regular";
    return "Baja";
  };

  const handleVerDetalles = (proyecto) => {
    setProyectoDetalle(proyecto);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setProyectoDetalle(null);
  };

  const handleAplicar = async (proyectoId) => {
    setConfirmDialog({
      isOpen: true,
      title: "Aplicar al Proyecto",
      message: "¿Estás seguro de que quieres aplicar a este proyecto? El cliente será notificado de tu interés.",
      onConfirm: () => aplicarAlProyecto(proyectoId),
      type: "info"
    });
  };

  const aplicarAlProyecto = async (proyectoId) => {
    try {
      setAplicando(proyectoId);
      const response = await fetch("/api/expert-matching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accion: "aplicar",
          proyectoId: proyectoId,
          expertoId: session.user.id
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("¡Aplicación enviada exitosamente! El cliente será notificado.");
        // Recargar proyectos para actualizar el estado
        fetchProyectos();
      } else {
        toast.error(result.error || "Error al aplicar al proyecto");
      }
    } catch (error) {
      toast.error("Error al aplicar al proyecto");
    } finally {
      setAplicando(null);
    }
  };

  // Filtrar proyectos
  const proyectosFiltrados = proyectos.filter(proyecto => {
    const cumpleIndustria = filtroIndustria === "todos" || proyecto.industria === filtroIndustria;
    const cumpleCompatibilidad = filtroCompatibilidad === "todos" || 
      (filtroCompatibilidad === "alta" && proyecto.compatibilidad.puntuacion >= 60) ||
      (filtroCompatibilidad === "media" && proyecto.compatibilidad.puntuacion >= 40 && proyecto.compatibilidad.puntuacion < 60) ||
      (filtroCompatibilidad === "baja" && proyecto.compatibilidad.puntuacion < 40);
    
    return cumpleIndustria && cumpleCompatibilidad;
  });

  // Obtener industrias únicas
  const industrias = [...new Set(proyectos.map(p => p.industria))];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <FaSpinner className="text-4xl mx-auto mb-2" />
          <p className="text-lg font-semibold">Error al cargar proyectos</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Proyectos Disponibles</h2>
          <p className="text-gray-600">Encuentra proyectos que coincidan con tus habilidades y experiencia</p>
        </div>
        <div className="text-sm text-gray-500">
          {proyectosFiltrados.length} de {proyectos.length} proyectos
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="font-medium text-gray-700">Filtros:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={filtroIndustria}
              onChange={(e) => setFiltroIndustria(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="todos">Todas las industrias</option>
              {industrias.map(industria => (
                <option key={industria} value={industria}>{industria}</option>
              ))}
            </select>
            
            <select
              value={filtroCompatibilidad}
              onChange={(e) => setFiltroCompatibilidad(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="todos">Toda compatibilidad</option>
              <option value="alta">Alta compatibilidad (60%+)</option>
              <option value="media">Compatibilidad media (40-59%)</option>
              <option value="baja">Baja compatibilidad (&lt;40%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Proyectos */}
      {proyectosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaUsers className="text-6xl mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No hay proyectos disponibles</h3>
          <p className="text-gray-600">No se encontraron proyectos que coincidan con los filtros aplicados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectosFiltrados.map((proyecto) => (
            <div
              key={proyecto._id}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Header de la tarjeta */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <FaIndustry className="text-gray-500" />
                    <span className="text-sm text-gray-600">{proyecto.industria}</span>
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
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-4">
                {/* Compatibilidad */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaChartLine />
                    Tu Compatibilidad
                  </h4>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCompatibilidadColor(proyecto.compatibilidad.puntuacion)}`}>
                        {getCompatibilidadTexto(proyecto.compatibilidad.puntuacion)}
                      </span>
                      <span className="text-sm font-semibold text-blue-600">
                        {proyecto.compatibilidad.puntuacion}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {proyecto.compatibilidad.razones[0] || "Compatibilidad calculada automáticamente"}
                    </p>
                  </div>
                </div>

                {/* Categorías de servicio */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Servicios Buscados:</h4>
                  <div className="flex flex-wrap gap-1">
                    {proyecto.categoriasServicioBuscado.slice(0, 3).map((categoria, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {categoria}
                      </span>
                    ))}
                    {proyecto.categoriasServicioBuscado.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{proyecto.categoriasServicioBuscado.length - 3} más
                      </span>
                    )}
                  </div>
                </div>

                {/* Objetivo */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Objetivo:</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {proyecto.objetivoEmpresa}
                  </p>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerDetalles(proyecto)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <FaEye className="w-3 h-3" />
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => handleAplicar(proyecto._id)}
                    disabled={aplicando === proyecto._id}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      proyecto.compatibilidad.puntuacion >= 40
                        ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {aplicando === proyecto._id ? (
                      <FaSpinner className="w-3 h-3 animate-spin" />
                    ) : (
                      <FaCheck className="w-3 h-3" />
                    )}
                    {aplicando === proyecto._id ? "Aplicando..." : "Aplicar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalles */}
      {showModal && proyectoDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del modal */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {proyectoDetalle.nombreProyecto}
                  </h2>
                  <p className="text-gray-600">{proyectoDetalle.nombreEmpresa}</p>
                </div>
                <button
                  onClick={handleCerrarModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Información básica */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Información del Proyecto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-700">Industria:</span>
                      <p className="text-gray-900">{proyectoDetalle.industria}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Fecha de Publicación:</span>
                      <p className="text-gray-900">
                        {new Date(proyectoDetalle.fechaPublicacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compatibilidad */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaChartLine />
                    Tu Compatibilidad con este Proyecto
                  </h3>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCompatibilidadColor(proyectoDetalle.compatibilidad.puntuacion)}`}>
                            {getCompatibilidadTexto(proyectoDetalle.compatibilidad.puntuacion)}
                          </span>
                          <span className="text-2xl font-bold text-blue-600">
                            {proyectoDetalle.compatibilidad.puntuacion}%
                          </span>
                        </div>
                        <p className="text-gray-700">
                          {proyectoDetalle.compatibilidad.razones[0] || "Compatibilidad calculada automáticamente"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Razones de la Compatibilidad:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {proyectoDetalle.compatibilidad.razones.map((razon, index) => (
                            <li key={index} className="text-gray-700 text-sm">{razon}</li>
                          ))}
                        </ul>
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

                {/* Información del cliente */}
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
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={handleCerrarModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleAplicar(proyectoDetalle._id)}
                  disabled={aplicando === proyectoDetalle._id}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    proyectoDetalle.compatibilidad.puntuacion >= 40
                      ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {aplicando === proyectoDetalle._id ? (
                    <span className="flex items-center gap-2">
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Aplicando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FaCheck className="w-4 h-4" />
                      Aplicar al Proyecto
                    </span>
                  )}
                </button>
              </div>
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