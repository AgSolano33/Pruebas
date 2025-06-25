"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaUsers, FaChartLine, FaClock, FaIndustry, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

export default function ProyectosTablero() {
  const { data: session } = useSession();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    if (session?.user?.id) {
      fetchProyectos();
    }
  }, [session, filtroEstado]);

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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 