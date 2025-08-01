"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaStar, FaIndustry, FaCheckCircle, FaCalendar, FaClock, FaComments, FaHourglassHalf, FaCheck, FaTimes as FaTimesIcon, FaDollarSign, FaFileAlt, FaEye } from "react-icons/fa";
import Modal from "@/components/Modal";
import postulacionesStore from "@/libs/postulacionesStore";

export default function PostulacionesExpertos({ proyecto, isOpen, onClose, expertosData }) {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPostulacion, setSelectedPostulacion] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && proyecto) {
      cargarPostulaciones();
    }
  }, [isOpen, proyecto]);

  useEffect(() => {
    const unsubscribe = postulacionesStore.subscribe(() => {
      if (isOpen && proyecto) {
        cargarPostulaciones();
      }
    });
    
    return unsubscribe;
  }, [isOpen, proyecto]);

  const cargarPostulaciones = () => {
    setLoading(true);
    
    if (proyecto && proyecto._id) {
      const postulaciones = postulacionesStore.getPostulaciones(proyecto._id);
      console.log('Postulaciones cargadas para proyecto:', proyecto._id, postulaciones);
      setPostulaciones(postulaciones);
    } else {
      console.log('No hay proyecto válido para cargar postulaciones');
      setPostulaciones([]);
    }
    
    setLoading(false);
  };

  const handleAceptarPostulacion = (postulacionId) => {
    if (!proyecto) return;
    
    const success = postulacionesStore.aceptarPostulacion(proyecto._id, postulacionId);
    
    if (success) {
      alert('¡Postulación aceptada exitosamente! El proyecto ha cambiado a estado "En Proceso".');
      onClose();
    } else {
      alert('Error al aceptar la postulación.');
    }
  };

  const handleRechazarPostulacion = (postulacionId) => {
    if (!proyecto) return;
    
    const success = postulacionesStore.rechazarPostulacion(proyecto._id, postulacionId);
    
    if (success) {
      alert('Postulación rechazada');
    } else {
      alert('Error al rechazar la postulación.');
    }
  };

  const handleVerDetalles = (postulacion) => {
    setSelectedPostulacion(postulacion);
    setModalOpen(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'aceptada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rechazada':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'enviada':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente de Revisión';
      case 'aceptada':
        return 'Aceptada';
      case 'rechazada':
        return 'Rechazada';
      case 'enviada':
        return 'Enviada';
      default:
        return estado;
    }
  };

  const getCompatibilidadColor = (puntuacion) => {
    if (puntuacion >= 80) return "text-green-600";
    if (puntuacion >= 60) return "text-blue-600";
    if (puntuacion >= 40) return "text-yellow-600";
    return "text-gray-600";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1A3D7C] text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Postulaciones de Expertos</h2>
              <p className="text-blue-100">{proyecto?.nombreProyecto}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A3D7C]"></div>
            </div>
          ) : postulaciones.length === 0 ? (
            <div className="text-center py-12">
              <FaUser className="text-6xl mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">No hay postulaciones</h3>
              <p className="text-gray-600">Los expertos que se postulen aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-4">
              {postulaciones.map((postulacion) => (
                <div
                  key={postulacion.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-indigo-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {postulacion.experto.nombre_experto}
                        </h3>
                        <p className="text-sm text-gray-600">{postulacion.experto.estudios_expertos}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(postulacion.estado)}`}>
                        {getEstadoTexto(postulacion.estado)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(postulacion.fecha).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <FaIndustry className="text-gray-400" />
                      <span className="text-sm text-gray-600">{postulacion.experto.categoria}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-gray-400" />
                      <span className="text-sm text-gray-600">{postulacion.presupuesto}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      <span className="text-sm text-gray-600">{postulacion.plazo}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Compatibilidad</span>
                      <span className={`text-sm font-semibold ${getCompatibilidadColor(postulacion.compatibilidad)}`}>
                        {postulacion.compatibilidad}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          postulacion.compatibilidad >= 80 ? 'bg-green-600' : 
                          postulacion.compatibilidad >= 60 ? 'bg-blue-600' : 
                          postulacion.compatibilidad >= 40 ? 'bg-yellow-600' : 'bg-gray-600'
                        }`}
                        style={{ width: `${postulacion.compatibilidad}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {postulacion.mensaje}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerDetalles(postulacion)}
                      className="flex-1 px-4 py-2 bg-[#1A3D7C] text-white rounded-md hover:bg-[#0f2a5a] transition-colors flex items-center justify-center gap-2"
                    >
                      <FaEye />
                      Ver Detalles
                    </button>
                    
                    {postulacion.estado === 'pendiente' && (
                      <>
                        <button
                          onClick={() => handleAceptarPostulacion(postulacion.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <FaCheck />
                          Aceptar
                        </button>
                        <button
                          onClick={() => handleRechazarPostulacion(postulacion.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <FaTimesIcon />
                          Rechazar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de detalles */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Detalles de la Postulación</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {selectedPostulacion && (
              <div className="space-y-6">
                {/* Información del experto */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-[#1A3D7C] mb-2">
                    {selectedPostulacion.experto.nombre_experto}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Estudios:</span> {selectedPostulacion.experto.estudios_expertos}
                    </div>
                    <div>
                      <span className="font-medium">Categorías:</span> {selectedPostulacion.experto.categoria}
                    </div>
                    <div>
                      <span className="font-medium">Compatibilidad:</span> {selectedPostulacion.compatibilidad}%
                    </div>
                    <div>
                      <span className="font-medium">Estado:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(selectedPostulacion.estado)}`}>
                        {getEstadoTexto(selectedPostulacion.estado)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mensaje de presentación */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mensaje de Presentación</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedPostulacion.mensaje}
                  </p>
                </div>

                {/* Detalles de la propuesta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <FaDollarSign className="text-blue-600" />
                      <span className="font-medium text-blue-900">Presupuesto</span>
                    </div>
                    <p className="text-blue-700">{selectedPostulacion.presupuesto}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <FaClock className="text-green-600" />
                      <span className="font-medium text-green-900">Plazo</span>
                    </div>
                    <p className="text-green-700">{selectedPostulacion.plazo}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCalendar className="text-purple-600" />
                      <span className="font-medium text-purple-900">Disponibilidad</span>
                    </div>
                    <p className="text-purple-700">
                      {selectedPostulacion.disponibilidad === 'disponible' ? 'Disponible inmediatamente' :
                       selectedPostulacion.disponibilidad === 'parcialmente_disponible' ? 'Disponible en 1-2 semanas' :
                       'Disponible en 1 mes o más'}
                    </p>
                  </div>
                </div>

                {/* Propuesta detallada */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaFileAlt />
                    Propuesta Detallada
                  </h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedPostulacion.propuesta}
                  </p>
                </div>

                {/* Experiencia del experto */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Experiencia Profesional</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedPostulacion.experto.experiencia_experto || 'Sin experiencia especificada'}
                  </p>
                </div>

                {/* Acciones */}
                {selectedPostulacion.estado === 'pendiente' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        handleAceptarPostulacion(selectedPostulacion.id);
                        setModalOpen(false);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCheck />
                      Aceptar Postulación
                    </button>
                    <button
                      onClick={() => {
                        handleRechazarPostulacion(selectedPostulacion.id);
                        setModalOpen(false);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTimesIcon />
                      Rechazar Postulación
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
} 