"use client";

import { useState, useEffect } from "react";
import { FaIndustry, FaChartLine, FaClock, FaUsers, FaEye, FaCalendar, FaDollarSign, FaFileAlt, FaCheckCircle, FaTimes, FaTachometerAlt } from "react-icons/fa";
import Modal from "@/components/Modal";
import ExpertoProyectoDashboard from "@/components/ExpertoProyectoDashboard";
import { useProyectosState } from "@/hooks/useProyectosState";
import postulacionesStore from "@/libs/postulacionesStore";

export default function ProyectosDisponibles({ expertoData }) {
  const [proyectosOriginales, setProyectosOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // Usar el hook para manejar el estado de los proyectos
  const proyectosConEstados = useProyectosState(proyectosOriginales);
  
  // Filtrar solo proyectos disponibles
  const proyectos = proyectosConEstados.filter(proyecto => 
    proyecto.estado === "publicado" || proyecto.estado === "en_espera"
  );
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [selectedProyectoForDashboard, setSelectedProyectoForDashboard] = useState(null);
  const [postulacionForm, setPostulacionForm] = useState({
    mensaje: '',
    presupuesto: '',
    plazo: '',
    disponibilidad: 'disponible',
    propuesta: ''
  });

  useEffect(() => {
    fetchProyectos();
  }, [filtroEstado]);



  const fetchProyectos = async () => {
    try {
      setLoading(true);
      const url = filtroEstado === "todos" 
        ? "/api/proyectos-publicados"
        : `/api/proyectos-publicados?estado=${filtroEstado}`;
        
      const response = await fetch(url);
      const result = await response.json();

      if (result.success && result.data) {
        setProyectosOriginales(result.data);
      } else {
        setError(result.error || 'Error al cargar los proyectos');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calcularCompatibilidad = (proyecto) => {
    if (!expertoData) return 0;
    
    let puntuacion = 0;
    
    // Matching por categorías
    if (expertoData.categoria && proyecto.categoriasServicioBuscado) {
      const categoriasExperto = expertoData.categoria.split(',').map(cat => cat.trim().toLowerCase());
      const categoriasProyecto = proyecto.categoriasServicioBuscado.map(cat => cat.toLowerCase());
      
      const matchesCategoria = categoriasProyecto.filter(catProyecto => 
        categoriasExperto.some(catExperto => catExperto.includes(catProyecto) || catProyecto.includes(catExperto))
      );
      
      puntuacion += (matchesCategoria.length / categoriasProyecto.length) * 40;
    }
    
    // Matching por experiencia y objetivo
    if (expertoData.experiencia_experto && proyecto.objetivoEmpresa) {
      const experienciaLower = expertoData.experiencia_experto.toLowerCase();
      const objetivoLower = proyecto.objetivoEmpresa.toLowerCase();
      
      const palabrasClave = [
        'desarrollo', 'tecnología', 'digital', 'negocios', 'investigación', 'innovación',
        'software', 'sistema', 'proceso', 'optimización', 'mejora', 'estrategia',
        'análisis', 'datos', 'consultoría', 'asesoría', 'implementación', 'gestión'
      ];
      
      const matches = palabrasClave.filter(palabra => 
        experienciaLower.includes(palabra) && objetivoLower.includes(palabra)
      );
      
      puntuacion += (matches.length / palabrasClave.length) * 30;
    }
    
    // Bonus por nivel de estudios
    if (expertoData.estudios_expertos) {
      const estudios = expertoData.estudios_expertos.toLowerCase();
      if (estudios.includes('doctorado')) puntuacion += 15;
      else if (estudios.includes('maestría')) puntuacion += 10;
      else if (estudios.includes('licenciatura')) puntuacion += 5;
    }
    
    return Math.min(Math.round(puntuacion), 100);
  };

  const getCompatibilidadColor = (puntuacion) => {
    if (puntuacion >= 80) return "text-green-600";
    if (puntuacion >= 60) return "text-blue-600";
    if (puntuacion >= 40) return "text-yellow-600";
    return "text-gray-600";
  };

  const getCompatibilidadBadgeColor = (puntuacion) => {
    if (puntuacion >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (puntuacion >= 60) return "bg-blue-100 text-blue-800 border-blue-200";
    if (puntuacion >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Verificar si el experto ya está postulado a un proyecto
  const verificarPostulacion = (proyecto) => {
    if (!expertoData || !proyecto._id) return null;
    
    const postulaciones = postulacionesStore.getPostulaciones(proyecto._id);
    const postulacionExistente = postulaciones.find(post => 
      post.experto._id === expertoData._id
    );
    
    return postulacionExistente;
  };

  const handleVerProyecto = (proyecto) => {
    setSelectedProyecto(proyecto);
    setModalOpen(true);
  };

  const handleOpenDashboard = (proyecto) => {
    setSelectedProyectoForDashboard(proyecto);
    setDashboardOpen(true);
  };

  const handlePostular = async (e) => {
    e.preventDefault();
    
    if (!selectedProyecto || !expertoData || !selectedProyecto._id) {
      alert('Error: Datos incompletos para la postulación');
      return;
    }
    
    // Crear la postulación
    const postulacion = {
      experto: expertoData,
      puntuacion: calcularCompatibilidad(selectedProyecto),
      mensaje: postulacionForm.mensaje,
      presupuesto: postulacionForm.presupuesto,
      plazo: postulacionForm.plazo,
      disponibilidad: postulacionForm.disponibilidad,
      propuesta: postulacionForm.propuesta,
      compatibilidad: calcularCompatibilidad(selectedProyecto)
    };
    
    console.log('Intentando agregar postulación:', { proyectoId: selectedProyecto._id, postulacion });
    
    // Agregar al store
    const success = postulacionesStore.agregarPostulacion(selectedProyecto._id, postulacion);
    
    if (success) {
      // Mostrar confirmación
      alert('¡Postulación enviada exitosamente! El cliente revisará tu propuesta.');
      
      // Cerrar modal y resetear formulario
      setModalOpen(false);
      setSelectedProyecto(null);
      setPostulacionForm({
        mensaje: '',
        presupuesto: '',
        plazo: '',
        disponibilidad: 'disponible',
        propuesta: ''
      });
    } else {
      alert('Error al enviar la postulación. Inténtalo de nuevo.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostulacionForm(prev => ({
      ...prev,
      [name]: value
    }));
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
        <h3 className="text-lg font-semibold text-gray-700">Filtrar proyectos:</h3>
        <div className="flex flex-wrap gap-2">
          {["todos", "publicado", "en_espera"].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroEstado === estado
                  ? "bg-[#1A3D7C] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {estado === "todos" ? "Todos" : estado === "publicado" ? "Publicados" : "En Espera"}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de proyectos */}
      {proyectos.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <FaUsers className="text-6xl mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No hay proyectos disponibles</h3>
          <p>Los proyectos que coincidan con tu perfil aparecerán aquí</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((proyecto) => {
            const compatibilidad = calcularCompatibilidad(proyecto);
            return (
              <div
                key={proyecto._id}
                className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
              >
                {/* Header de la tarjeta */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <FaIndustry className="text-blue-600" />
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {proyecto.estado === "publicado" ? "Disponible" : "En Espera"}
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
                <div className="p-4 flex-1 flex flex-col">
                  {/* Compatibilidad */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaChartLine />
                      Tu Compatibilidad
                    </h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Match con tu perfil
                        </span>
                        <span className={`text-xs font-semibold ${getCompatibilidadColor(compatibilidad)}`}>
                          {compatibilidad}% compatible
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            compatibilidad >= 80 ? 'bg-green-600' : 
                            compatibilidad >= 60 ? 'bg-blue-600' : 
                            compatibilidad >= 40 ? 'bg-yellow-600' : 'bg-gray-600'
                          }`}
                          style={{ width: `${compatibilidad}%` }}
                        ></div>
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

                  {/* Fecha de publicación */}
                  <div className="flex items-center justify-end text-xs text-gray-500 border-t border-gray-100 pt-3 mb-4">
                    <div className="flex items-center gap-1">
                      <FaClock />
                      <span>Publicado: {new Date(proyecto.fechaPublicacion).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="mt-auto space-y-2">
                    {(() => {
                      const postulacion = verificarPostulacion(proyecto);
                      
                      if (postulacion) {
                        // Ya está postulado
                        return (
                          <div className="space-y-2">
                            <div className="w-full px-3 py-2 bg-gray-100 text-gray-600 rounded text-sm font-semibold flex items-center gap-2 justify-center">
                              <FaCheckCircle />
                              {postulacion.estado === 'aceptada' ? 'Postulación Aceptada' : 
                               postulacion.estado === 'rechazada' ? 'Postulación Rechazada' : 
                               'Postulación Enviada'}
                            </div>
                            {postulacion.estado === 'aceptada' && proyecto.estado === "en_proceso" && (
                              <button
                                onClick={() => handleOpenDashboard(proyecto)}
                                className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold flex items-center gap-2 justify-center"
                              >
                                <FaTachometerAlt />
                                Dashboard del Proyecto
                              </button>
                            )}
                          </div>
                        );
                      } else if (proyecto.estado === "publicado" || proyecto.estado === "en_espera") {
                        // No está postulado, puede postularse
                        return (
                          <button
                            onClick={() => handleVerProyecto(proyecto)}
                            className="w-full px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-semibold flex items-center gap-2 justify-center"
                          >
                            <FaEye />
                            Ver Proyecto y Postular
                          </button>
                        );
                      } else if (proyecto.estado === "en_proceso") {
                        // Proyecto en proceso pero no está postulado
                        return (
                          <div className="w-full px-3 py-2 bg-gray-100 text-gray-600 rounded text-sm font-semibold flex items-center gap-2 justify-center">
                            <FaTimes />
                            Proyecto en Proceso
                          </div>
                        );
                      }
                      
                      return null;
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de postulación */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Postular al Proyecto</h2>
            <button
              onClick={() => setModalOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {selectedProyecto && (
            <>
              {/* Información del proyecto */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-lg text-[#1A3D7C] mb-2">
                  {selectedProyecto.nombreEmpresa}
                </h3>
                <p className="text-gray-600 mb-2">{selectedProyecto.nombreProyecto}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <FaIndustry />
                    <span>{selectedProyecto.industria}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaChartLine />
                    <span>{calcularCompatibilidad(selectedProyecto)}% compatible</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{selectedProyecto.objetivoEmpresa}</p>
              </div>

              {/* Formulario de postulación */}
              <form onSubmit={handlePostular} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje de presentación
                  </label>
                  <textarea
                    name="mensaje"
                    value={postulacionForm.mensaje}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Presenta tu experiencia y por qué eres la persona ideal para este proyecto..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-1" />
                      Presupuesto estimado
                    </label>
                    <input
                      type="text"
                      name="presupuesto"
                      value={postulacionForm.presupuesto}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ej: $5,000 - $8,000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaClock className="inline mr-1" />
                      Plazo estimado
                    </label>
                    <input
                      type="text"
                      name="plazo"
                      value={postulacionForm.plazo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ej: 4-6 semanas"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendar className="inline mr-1" />
                    Disponibilidad
                  </label>
                  <select
                    name="disponibilidad"
                    value={postulacionForm.disponibilidad}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="disponible">Disponible inmediatamente</option>
                    <option value="parcialmente_disponible">Disponible en 1-2 semanas</option>
                    <option value="no_disponible">Disponible en 1 mes o más</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaFileAlt className="inline mr-1" />
                    Propuesta detallada
                  </label>
                  <textarea
                    name="propuesta"
                    value={postulacionForm.propuesta}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describe tu enfoque, metodología y propuesta de solución para este proyecto..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#1A3D7C] text-white rounded-md hover:bg-[#0f2a5a] transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle />
                    Enviar Postulación
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </Modal>

      {/* Dashboard del Proyecto para Expertos */}
      <ExpertoProyectoDashboard
        proyecto={selectedProyectoForDashboard}
        experto={expertoData}
        isOpen={dashboardOpen}
        onClose={() => {
          setDashboardOpen(false);
          setSelectedProyectoForDashboard(null);
        }}
      />
    </div>
  );
} 