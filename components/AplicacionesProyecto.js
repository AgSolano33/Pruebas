"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaUser, FaCheck, FaTimes, FaEye, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";

export default function AplicacionesProyecto({ proyectoId }) {
  const { data: session } = useSession();
  const [aplicaciones, setAplicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning"
  });

  useEffect(() => {
    if (proyectoId) {
      fetchAplicaciones();
    }
  }, [proyectoId]);

  const fetchAplicaciones = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expert-matching/proyecto-aplicaciones?proyectoId=${proyectoId}`);
      const result = await response.json();

      if (result.success) {
        setAplicaciones(result.data);
      } else {
        toast.error(result.error || 'Error al cargar aplicaciones');
      }
    } catch (error) {
      toast.error('Error al cargar aplicaciones');
    } finally {
      setLoading(false);
    }
  };

  const showConfirmDialog = (title, message, onConfirm, type = "warning") => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
      type
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
      type: "warning"
    });
  };

  const handleAceptarAplicacion = async (matchId, expertoNombre) => {
    showConfirmDialog(
      "Aceptar Aplicación",
      `¿Estás seguro de que deseas aceptar la aplicación de ${expertoNombre}?`,
      async () => {
        try {
          const response = await fetch('/api/expert-matching', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              proyectoId: matchId,
              accion: 'aceptar'
            }),
          });

          const result = await response.json();

          if (result.success) {
            toast.success('Aplicación aceptada exitosamente');
            fetchAplicaciones();
          } else {
            toast.error(result.error || 'Error al aceptar aplicación');
          }
        } catch (error) {
          toast.error('Error al aceptar aplicación');
        }
      },
      "success"
    );
  };

  const handleRechazarAplicacion = async (matchId, expertoNombre) => {
    showConfirmDialog(
      "Rechazar Aplicación",
      `¿Estás seguro de que deseas rechazar la aplicación de ${expertoNombre}?`,
      async () => {
        try {
          const response = await fetch('/api/expert-matching', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              proyectoId: matchId,
              accion: 'rechazar'
            }),
          });

          const result = await response.json();

          if (result.success) {
            toast.success('Aplicación rechazada');
            fetchAplicaciones();
          } else {
            toast.error(result.error || 'Error al rechazar aplicación');
          }
        } catch (error) {
          toast.error('Error al rechazar aplicación');
        }
      },
      "error"
    );
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "aceptado":
        return "bg-green-100 text-green-800 border-green-200";
      case "rechazado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "aceptado":
        return "Aceptado";
      case "rechazado":
        return "Rechazado";
      default:
        return estado;
    }
  };

  const getCompatibilidadColor = (puntuacion) => {
    if (puntuacion >= 80) return "text-green-600";
    if (puntuacion >= 60) return "text-blue-600";
    if (puntuacion >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A3D7C]"></div>
      </div>
    );
  }

  if (aplicaciones.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <FaUser className="text-4xl mx-auto mb-4 text-gray-300" />
        <h4 className="text-lg font-semibold mb-2">No hay aplicaciones aún</h4>
        <p className="text-sm">Los expertos que apliquen a este proyecto aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Aplicaciones Recibidas ({aplicaciones.length})
      </h3>
      
      <div className="space-y-4">
        {aplicaciones.map((aplicacion) => (
          <div
            key={aplicacion._id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {aplicacion.semblanza ? aplicacion.semblanza.split(' ').slice(0, 2).join(' ') : 'Experto'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {aplicacion.gradoExperiencia?.replace('-', ' ').toUpperCase() || 'Nivel no especificado'}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(aplicacion.estado)}`}>
                {getEstadoTexto(aplicacion.estado)}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Compatibilidad:</span>
                <span className={`text-sm font-semibold ${getCompatibilidadColor(aplicacion.puntuacionMatch)}`}>
                  {aplicacion.puntuacionMatch}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    aplicacion.puntuacionMatch >= 80 ? 'bg-green-500' :
                    aplicacion.puntuacionMatch >= 60 ? 'bg-blue-500' :
                    aplicacion.puntuacionMatch >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${aplicacion.puntuacionMatch}%` }}
                ></div>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-3">
              <p><strong>Industrias:</strong> {aplicacion.industriasExperto?.join(', ') || 'No especificadas'}</p>
              <p><strong>Servicios:</strong> {aplicacion.serviciosPropuestos || 'No especificados'}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Aplicó el {new Date(aplicacion.fechaCreacion).toLocaleDateString('es-ES')}
              </span>
              
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  title="Ver perfil completo"
                >
                  <FaEye />
                  Ver Perfil
                </button>
                
                {aplicacion.estado === "pendiente" && (
                  <>
                    <button
                      onClick={() => handleAceptarAplicacion(aplicacion._id, aplicacion.semblanza?.split(' ').slice(0, 2).join(' '))}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      title="Aceptar aplicación"
                    >
                      <FaCheck />
                      Aceptar
                    </button>
                    <button
                      onClick={() => handleRechazarAplicacion(aplicacion._id, aplicacion.semblanza?.split(' ').slice(0, 2).join(' '))}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      title="Rechazar aplicación"
                    >
                      <FaTimes />
                      Rechazar
                    </button>
                  </>
                )}
                
                {aplicacion.estado === "aceptado" && (
                  <button
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                    title="Contactar experto"
                  >
                    <FaEnvelope />
                    Contactar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />
    </div>
  );
} 