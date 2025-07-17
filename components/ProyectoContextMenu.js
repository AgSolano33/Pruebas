"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaStar, FaIndustry, FaCheckCircle, FaCalendar, FaClock, FaComments, FaHourglassHalf, FaCheck, FaTimes as FaTimesIcon } from "react-icons/fa";

export default function ProyectoContextMenu({ proyecto, isOpen, onClose, expertosData }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [meetingRequests, setMeetingRequests] = useState({}); // Track meeting requests
  const [meetingForm, setMeetingForm] = useState({
    date: '',
    time: '',
    duration: '30',
    message: ''
  });

  useEffect(() => {
    if (isOpen && proyecto && expertosData) {
      calculateMatches();
    }
  }, [isOpen, proyecto, expertosData]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Disable scroll on body
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scroll on body
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to re-enable scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (showMeetingModal) {
      setMeetingForm({
        date: '',
        time: '',
        duration: '30',
        message: ''
      });
    }
  }, [showMeetingModal]);

  const calculateMatches = () => {
    setLoading(true);
    
    // Simular cálculo de matches usando los datos mock
    const expertos = expertosData.expertos_formulario || [];
    const matchesCalculados = expertos.map(experto => {
      // Algoritmo mejorado de matching basado en categorías y experiencia
      let puntuacion = 0;
      
      // Matching por categorías (más preciso)
      if (experto.categoria && proyecto.categoriasServicioBuscado) {
        const categoriasExperto = experto.categoria.split(',').map(cat => cat.trim().toLowerCase());
        const categoriasProyecto = proyecto.categoriasServicioBuscado.map(cat => cat.toLowerCase());
        
        // Buscar coincidencias exactas y parciales
        const matchesCategoria = categoriasProyecto.filter(catProyecto => 
          categoriasExperto.some(catExperto => {
            // Coincidencia exacta (máxima puntuación)
            if (catExperto === catProyecto) return true;
            
            // Coincidencia parcial (puntuación media)
            if (catExperto.includes(catProyecto) || catProyecto.includes(catExperto)) return true;
            
            // Coincidencias por palabras clave específicas
            const palabrasClave = {
              'servicios digitales': ['digital', 'tecnología', 'software', 'web', 'app', 'digitalización'],
              'negocios': ['negocio', 'empresa', 'estrategia', 'consultoría', 'gestión'],
              'investigación': ['investigación', 'análisis', 'datos', 'estudio', 'reporte'],
              'steam': ['tecnología', 'ciencia', 'ingeniería', 'matemáticas', 'arte'],
              'soluciones personalizadas': ['personalizado', 'custom', 'específico', 'adaptado'],
              'digitalización de procesos': ['digitalización', 'procesos', 'digital', 'automatización'],
              'optimización de procesos': ['optimización', 'procesos', 'mejora', 'eficiencia'],
              'capacitación y formación': ['capacitación', 'formación', 'entrenamiento', 'educación']
            };
            
            const palabrasExperto = palabrasClave[catExperto] || [];
            const palabrasProyecto = palabrasClave[catProyecto] || [];
            
            return palabrasExperto.some(palabra => 
              palabrasProyecto.some(palabraProyecto => 
                palabra.includes(palabraProyecto) || palabraProyecto.includes(palabra)
              )
            );
          })
        );
        
        // Puntuación más alta para coincidencias exactas
        const coincidenciasExactas = categoriasProyecto.filter(catProyecto => 
          categoriasExperto.includes(catProyecto)
        );
        
        puntuacion += (coincidenciasExactas.length / categoriasProyecto.length) * 60; // Coincidencias exactas
        puntuacion += ((matchesCategoria.length - coincidenciasExactas.length) / categoriasProyecto.length) * 30; // Coincidencias parciales
      }
      
      // Matching por industria (más flexible)
      if (experto.categoria && proyecto.industria) {
        const categoriasExperto = experto.categoria.toLowerCase();
        const industriaProyecto = proyecto.industria.toLowerCase();
        
        // Coincidencias directas
        if (categoriasExperto.includes(industriaProyecto) || industriaProyecto.includes(categoriasExperto)) {
          puntuacion += 25;
        }
        
        // Coincidencias por sector
        const sectores = {
          'tecnología': ['software', 'digital', 'tech', 'informática'],
          'servicios': ['consultoría', 'asesoría', 'servicios'],
          'manufactura': ['industrial', 'producción', 'fabricación'],
          'comercio': ['retail', 'ventas', 'comercial']
        };
        
        Object.entries(sectores).forEach(([sector, palabras]) => {
          if (palabras.some(palabra => industriaProyecto.includes(palabra))) {
            if (palabras.some(palabra => categoriasExperto.includes(palabra))) {
              puntuacion += 15;
            }
          }
        });
      }
      
      // Matching por experiencia y objetivo (más flexible)
      if (experto.experiencia_experto && proyecto.objetivoEmpresa) {
        const experienciaLower = experto.experiencia_experto.toLowerCase();
        const objetivoLower = proyecto.objetivoEmpresa.toLowerCase();
        
        // Palabras clave expandidas
        const palabrasClave = [
          'desarrollo', 'tecnología', 'digital', 'negocios', 'investigación', 'innovación',
          'software', 'sistema', 'proceso', 'optimización', 'mejora', 'estrategia',
          'análisis', 'datos', 'consultoría', 'asesoría', 'implementación', 'gestión'
        ];
        
        const matches = palabrasClave.filter(palabra => 
          experienciaLower.includes(palabra) && objetivoLower.includes(palabra)
        );
        
        puntuacion += (matches.length / palabrasClave.length) * 25;
      }
      
      // Bonus por nivel de estudios
      if (experto.estudios_expertos) {
        const estudios = experto.estudios_expertos.toLowerCase();
        if (estudios.includes('doctorado')) puntuacion += 10;
        else if (estudios.includes('maestría')) puntuacion += 8;
        else if (estudios.includes('licenciatura')) puntuacion += 5;
      }
      
      // Bonus por experiencia específica mencionada
      if (experto.experiencia_experto && proyecto.objetivoEmpresa) {
        const experienciaLower = experto.experiencia_experto.toLowerCase();
        const objetivoLower = proyecto.objetivoEmpresa.toLowerCase();
        
        // Contar palabras específicas que coinciden
        const palabrasEspecificas = ['proyecto', 'empresa', 'cliente', 'implementación', 'solución'];
        const matchesEspecificos = palabrasEspecificas.filter(palabra => 
          experienciaLower.includes(palabra) && objetivoLower.includes(palabra)
        );
        
        puntuacion += matchesEspecificos.length * 2;
      }
      
      // Asegurar que la puntuación no exceda 100
      puntuacion = Math.min(puntuacion, 100);
      
      return {
        experto,
        puntuacion: Math.round(puntuacion),
        match: puntuacion >= 20 // Umbral de 20% para matches de calidad
      };
    });
    
    // Filtrar solo los que tienen match y ordenar por puntuación
    const matchesFiltrados = matchesCalculados
      .filter(match => match.match)
      .sort((a, b) => b.puntuacion - a.puntuacion)
      .slice(0, 5); // Top 5 matches
    
    setMatches(matchesFiltrados);
    setLoading(false);
  };

  const getMatchColor = (puntuacion) => {
    if (puntuacion >= 80) return "text-green-600";
    if (puntuacion >= 60) return "text-blue-600";
    if (puntuacion >= 40) return "text-yellow-600";
    return "text-gray-600";
  };

  const getMatchBadgeColor = (puntuacion) => {
    if (puntuacion >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (puntuacion >= 60) return "bg-blue-100 text-blue-800 border-blue-200";
    if (puntuacion >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleContactarExperto = (experto) => {
    // Verificar si ya hay una solicitud pendiente
    if (meetingRequests[experto.ID]?.status === 'pending') {
      alert('Ya tienes una solicitud de reunión pendiente con este experto. Espera su confirmación.');
      return;
    }
    
    setSelectedExpert(experto);
    setShowMeetingModal(true);
  };

  const handleMeetingSubmit = (e) => {
    e.preventDefault();
    
    // Crear solicitud de reunión
    const meetingRequest = {
      id: Date.now(),
      expertoId: selectedExpert.ID,
      proyectoId: proyecto.id || proyecto._id,
      date: meetingForm.date,
      time: meetingForm.time,
      duration: meetingForm.duration,
      message: meetingForm.message,
      status: 'pending', // pending, confirmed, rejected, cancelled
      createdAt: new Date().toISOString()
    };
    
    // Actualizar estado de solicitudes
    setMeetingRequests(prev => ({
      ...prev,
      [selectedExpert.ID]: meetingRequest
    }));
    
    // Simular envío de solicitud de reunión
    alert(`Solicitud de reunión enviada al experto para el ${meetingForm.date} a las ${meetingForm.time}. Te notificaremos cuando confirme la cita.`);
    
    // Cerrar modal y resetear formulario
    setShowMeetingModal(false);
    setSelectedExpert(null);
    setMeetingForm({
      date: '',
      time: '',
      duration: '30',
      message: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generar fechas disponibles (próximos 7 días)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  // Generar horarios disponibles
  const getAvailableTimes = () => {
    return [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];
  };

  // Obtener estado de la solicitud de reunión
  const getMeetingStatus = (expertoId) => {
    return meetingRequests[expertoId];
  };

  // Obtener icono y color del estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return { icon: FaHourglassHalf, color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200' };
      case 'confirmed':
        return { icon: FaCheck, color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' };
      case 'rejected':
        return { icon: FaTimesIcon, color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' };
      default:
        return { icon: FaHourglassHalf, color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-200' };
    }
  };

  // Obtener texto del estado
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Esperando confirmación';
      case 'confirmed':
        return 'Cita confirmada';
      case 'rejected':
        return 'Cita rechazada';
      default:
        return 'Estado desconocido';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed !mt-0 pt-16 inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-8">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{proyecto.nombreEmpresa}</h2>
              <p className="text-lg text-gray-600">{proyecto.nombreProyecto}</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Proyecto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Industria</p>
                <p className="font-medium">{proyecto.industria}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Estado</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                  proyecto.estado === "en_espera" ? "bg-orange-100 text-orange-800 border-orange-200" :
                  proyecto.estado === "publicado" ? "bg-blue-100 text-blue-800 border-blue-200" :
                  proyecto.estado === "en_proceso" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                  proyecto.estado === "completado" ? "bg-green-100 text-green-800 border-green-200" :
                  "bg-gray-100 text-gray-800 border-gray-200"
                }`}>
                  {proyecto.estado === "en_espera" ? "En Espera" :
                   proyecto.estado === "publicado" ? "Publicado" :
                   proyecto.estado === "en_proceso" ? "En Proceso" :
                   proyecto.estado === "completado" ? "Completado" :
                   proyecto.estado}
                </span>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Objetivo</p>
                <p className="text-gray-900">{proyecto.objetivoEmpresa}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-2">Servicios Buscados</p>
                <div className="flex flex-wrap gap-2">
                  {proyecto.categoriasServicioBuscado.map((categoria, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
                    >
                      {categoria}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Expertos que hacen Match */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Expertos que hacen el mejor Match</h3>
              {loading && (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                  Calculando matches...
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Analizando compatibilidad con expertos...</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-8">
                <FaUser className="text-6xl mx-auto mb-4 text-gray-300" />
                <h4 className="text-xl font-semibold mb-2 text-gray-600">No se encontraron matches</h4>
                <p className="text-gray-500">No hay expertos que coincidan con los requisitos de este proyecto</p>
              </div>
            ) : (
              <div>
                {matches.map((match, index) => {
                  const meetingStatus = getMeetingStatus(match.experto.ID);
                  const statusInfo = meetingStatus ? getStatusIcon(meetingStatus.status) : null;
                  const StatusIcon = statusInfo?.icon;
                  
                  return (
                    <div
                      key={match.experto.ID}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50 mb-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-indigo-600 text-xl" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              Experto #{index + 1}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              {match.experto.estudios_expertos && (
                                <div className="flex items-center gap-1">
                                  <FaGraduationCap className="text-gray-400" />
                                  <span>{match.experto.estudios_expertos}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-400" />
                                <span>Verificado</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getMatchBadgeColor(match.puntuacion)}`}>
                            {match.puntuacion}% Match
                          </span>
                          {meetingStatus && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`}>
                              <StatusIcon className="text-xs" />
                              {getStatusText(meetingStatus.status)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Especialidades</p>
                        <div className="flex flex-wrap gap-1">
                          {match.experto.categoria && match.experto.categoria.split(',').map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {cat.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {match.experto.experiencia_experto && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">Perfil Profesional</p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {match.experto.experiencia_experto.length > 200 
                              ? `${match.experto.experiencia_experto.substring(0, 200)}...` 
                              : match.experto.experiencia_experto}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Disponible para:</span> Proyectos similares
                        </div>
                        {meetingStatus ? (
                          <div className="flex gap-2">
                            {meetingStatus.status === 'pending' && (
                              <button 
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed text-sm font-medium flex items-center gap-2"
                                disabled
                              >
                                <FaHourglassHalf />
                                Solicitud Enviada
                              </button>
                            )}
                            {meetingStatus.status === 'confirmed' && (
                              <button 
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                              >
                                <FaCheck />
                                Cita Confirmada
                              </button>
                            )}
                            {meetingStatus.status === 'rejected' && (
                              <button 
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                              >
                                <FaTimesIcon />
                                Cita Rechazada
                              </button>
                            )}
                          </div>
                        ) : (
                          <button 
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                            onClick={() => handleContactarExperto(match.experto)}
                          >
                            <FaEnvelope />
                            Contactar Experto
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Agendar Reunión */}
      {showMeetingModal && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header del Modal */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Agendar Reunión</h3>
                <p className="text-sm text-gray-600">Programa una cita con el experto</p>
              </div>
              <button
                onClick={() => setShowMeetingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Formulario de Reunión */}
            <form onSubmit={handleMeetingSubmit} className="p-6 space-y-4">
              {/* Información del Experto */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Experto Seleccionado</h4>
                    <p className="text-sm text-gray-600">
                      {selectedExpert.estudios_expertos} • Verificado
                    </p>
                  </div>
                </div>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendar className="inline mr-2 text-gray-400" />
                  Fecha de la Reunión
                </label>
                <select
                  name="date"
                  value={meetingForm.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Selecciona una fecha</option>
                  {getAvailableDates().map(date => {
                    const dateObj = new Date(date);
                    const formattedDate = dateObj.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                    return (
                      <option key={date} value={date}>
                        {formattedDate}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Hora */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline mr-2 text-gray-400" />
                  Hora de la Reunión
                </label>
                <select
                  name="time"
                  value={meetingForm.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Selecciona una hora</option>
                  {getAvailableTimes().map(time => (
                    <option key={time} value={time}>
                      {time} hrs
                    </option>
                  ))}
                </select>
              </div>

              {/* Duración */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline mr-2 text-gray-400" />
                  Duración
                </label>
                <select
                  name="duration"
                  value={meetingForm.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1.5 horas</option>
                </select>
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaComments className="inline mr-2 text-gray-400" />
                  Mensaje para el Experto
                </label>
                <textarea
                  name="message"
                  value={meetingForm.message}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe brevemente el objetivo de la reunión y cualquier información relevante sobre tu proyecto..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMeetingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 