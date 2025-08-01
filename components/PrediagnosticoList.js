"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaChevronDown, FaTrash, FaPlus, FaRocket } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import FormDiagnostico from "@/components/FormDiagnostico";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";

export default function PrediagnosticoList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [publishingProject, setPublishingProject] = useState(null);
  const [publishedProjects, setPublishedProjects] = useState(new Set());
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning"
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchDiagnoses();
      fetchPublishedProjects();
    }
  }, [session]);

  const fetchDiagnoses = async () => {
    try {
      const response = await fetch(`/api/diagnoses?userId=${session.user.id}`);
      const result = await response.json();

      if (result.success && result.data) {
        // Filtrar diagnósticos que tengan cualquiera de los dos formatos
        const filteredDiagnoses = result.data.filter(diagnosis => {
          const situacionActual = diagnosis["1. Situacion actual de la empresa y objetivos"] || 
                                diagnosis["1. Situación actual de la empresa y objetivos"];

          if (!situacionActual) return false;

          // Verificar si tiene cualquiera de los dos formatos de diagnóstico general
          return situacionActual["Diagnostico general"] || 
                 situacionActual["Diagnóstico general"] ||
                 situacionActual["Diagnóstico general de necesidades y retos principales"];
        });

        setDiagnoses(filteredDiagnoses);
      } else {
        setError(result.error || 'Error al cargar los diagnósticos');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublishedProjects = async () => {
    try {
      const response = await fetch("/api/proyectos-publicados");
      const result = await response.json();
      
      if (result.success && result.data) {
        // Crear un Set con los proyectos publicados
        const publishedSet = new Set();
        result.data.forEach(proyecto => {
          // Crear una clave única basada en el nombre del proyecto y empresa
          const key = `${proyecto.nombreEmpresa}-${proyecto.nombreProyecto}`;
          publishedSet.add(key);
        });
        setPublishedProjects(publishedSet);
      }
    } catch (error) {
      console.error("Error al cargar proyectos publicados:", error);
    }
  };

  const handleDelete = async (id) => {
    setConfirmDialog({
      isOpen: true,
      title: "Eliminar Diagnóstico",
      message: "¿Estás seguro de que deseas eliminar este diagnóstico? Esta acción no se puede deshacer.",
      onConfirm: async () => {
      try {
        const response = await fetch(`/api/diagnoses?id=${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          setDiagnoses(diagnoses.filter(d => d._id !== id));
            toast.success('Diagnóstico eliminado exitosamente');
        } else {
            toast.error(result.error || 'Error al eliminar el diagnóstico');
        }
      } catch (error) {
          toast.error('Error al eliminar el diagnóstico');
      }
        setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" });
      },
      type: "warning"
    });
  };

  const handlePublish = async (diagnosis, matchIndex) => {
    const match = diagnosis["4. Posibles matches"][matchIndex];
    const nombreEmpresa = getDiagnosticoInfo(diagnosis);
    
    setConfirmDialog({
      isOpen: true,
      title: "Publicar Proyecto",
      message: `¿Estás seguro de que deseas publicar el proyecto "${match["Titulo solucion propuesta"]}" para buscar expertos?`,
      onConfirm: async () => {
    setPublishingProject(`${diagnosis._id}-${matchIndex}`);
    
    try {
      // Preparar los datos del proyecto para el análisis
      const proyectoData = {
        empresa: {
          nombre: nombreEmpresa,
          sector: diagnosis["3. Categorias de proyecto"]?.Industria?.[0] || "General",
        },
        analisisObjetivos: {
          situacionActual: match["Titulo solucion propuesta"],
          viabilidad: match["Descripcion"],
          recomendaciones: diagnosis["3. Categorias de proyecto"]?.["Categorias de servicio buscado"] || [],
        },
      };

      const response = await fetch("/api/proyectos-publicados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ proyectoData }),
      });

      const result = await response.json();

      if (result.success) {
            toast.success(`¡Proyecto "${match["Titulo solucion propuesta"]}" publicado exitosamente! Se encontraron ${result.matches.length} expertos compatibles.`);
        // Marcar el proyecto como publicado usando la misma clave
        const tituloProyecto = match["Titulo solucion propuesta"];
        const projectKey = `${nombreEmpresa}-${tituloProyecto}`;
        setPublishedProjects(prev => new Set([...prev, projectKey]));
        // Redirigir al tablero de proyectos
        router.push("/dashboard?tab=proyectos");
      } else {
            toast.error(`Error al publicar: ${result.error}`);
      }
    } catch (error) {
      console.error("Error al publicar proyecto:", error);
          toast.error("Error al publicar el proyecto. Por favor, intenta de nuevo.");
    } finally {
      setPublishingProject(null);
    }
        setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" });
      },
      type: "info"
    });
  };

  const handleViewDetails = (diagnosisId) => {
    router.push(`/diagnosis/${diagnosisId}`);
  };

  const toggleCard = (diagnosisId) => {
    setExpandedCards(prev => ({ ...prev, [diagnosisId]: !prev[diagnosisId] }));
  };

  const getDiagnosticoInfo = (diagnosis) => {
    const situacionActual = diagnosis["1. Situacion actual de la empresa y objetivos"] || 
                           diagnosis["1. Situación actual de la empresa y objetivos"];
    
    if (!situacionActual) return "Sin nombre de empresa";

    // Intentar obtener el diagnóstico general con todos los formatos posibles
    const diagnosticoGeneral = situacionActual["Diagnostico general"] || 
                              situacionActual["Diagnóstico general"] ||
                              situacionActual["Diagnóstico general de necesidades y retos principales"];

    if (!diagnosticoGeneral) return "Sin nombre de empresa";
    const texto = Array.isArray(diagnosticoGeneral) ? diagnosticoGeneral[0] : diagnosticoGeneral;
    if (!texto) return "Sin nombre de empresa";
    const match = texto.match(/La empresa ['"]([^'"]+)['"]/);
    return match ? match[1] : "Sin nombre de empresa";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3D7C]"></div>
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
    <div className="space-y-4">
      {/* Botón de nuevo diagnóstico */}
      <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
           onClick={() => setIsModalOpen(true)}>
        <div className="flex items-center justify-center space-x-2 text-[#1A3D7C]">
          <FaPlus className="text-xl" />
          <span className="text-lg font-semibold">Nuevo Diagnóstico</span>
        </div>
      </div>

      {/* Lista de diagnósticos */}
      {diagnoses.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          No hay diagnósticos disponibles
        </div>
      ) : (
        diagnoses.map((diagnosis) => {
          const nombreEmpresa = getDiagnosticoInfo(diagnosis);
          const posiblesMatches = diagnosis["4. Posibles matches"] || [];
          const isExpanded = expandedCards[diagnosis._id];

          return (
            <div key={diagnosis._id} className="bg-white rounded-lg shadow-md p-4">
              {/* Header del diagnóstico */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#1A3D7C]">
                    {nombreEmpresa}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(diagnosis.createdAt).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleCard(diagnosis._id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <FaChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    <span>{isExpanded ? 'Ocultar' : 'Ver'} Proyectos ({posiblesMatches.length})</span>
                  </button>
                  <button
                    onClick={() => handleViewDetails(diagnosis._id)}
                    className="px-4 py-2 bg-[#1A3D7C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver más detalles
                  </button>
                  <button
                    onClick={() => handleDelete(diagnosis._id)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar diagnóstico"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Lista de proyectos (matches) */}
              {isExpanded && (
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <h4 className="text-md font-semibold text-gray-700 mb-3">
                    Proyectos Identificados:
                  </h4>
                  
                  {posiblesMatches.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No hay proyectos identificados en este diagnóstico
                    </p>
                  ) : (
                    posiblesMatches.map((match, index) => {
                      const isPublishing = publishingProject === `${diagnosis._id}-${index}`;
                      const nombreEmpresa = getDiagnosticoInfo(diagnosis);
                      const tituloProyecto = match["Titulo solucion propuesta"];
                      const projectKey = `${nombreEmpresa}-${tituloProyecto}`;
                      const isPublished = publishedProjects.has(projectKey);
                      
                      return (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800 mb-2">
                                {match["Titulo solucion propuesta"]}
                              </h5>
                              <p className="text-sm text-gray-600 mb-3">
                                {match["Descripcion"]}
                              </p>
                              
                              {/* Información del proyecto */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-500">
                                <div>
                                  <strong>Industria:</strong> {diagnosis["3. Categorias de proyecto"]?.Industry?.[0] || diagnosis["3. Categorias de proyecto"]?.Industria?.[0] || "No especificada"}
                                </div>
                                <div>
                                  <strong>Servicios:</strong> {diagnosis["3. Categorias de proyecto"]?.["Categorias de servicio buscado"]?.join(", ") || "No especificados"}
                                </div>
                                <div>
                                  <strong>Objetivos:</strong> {diagnosis["3. Categorias de proyecto"]?.["Objetivos de la empresa"]?.join(", ") || "No especificados"}
                                </div>
                              </div>
                            </div>
                            
                            <div className="ml-4">
                              {isPublished ? (
                                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="font-medium">Publicado</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handlePublish(diagnosis, index)}
                                  disabled={isPublishing}
                                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                    isPublishing
                                      ? "bg-gray-400 text-white cursor-not-allowed"
                                      : "bg-green-600 text-white hover:bg-green-700"
                                  }`}
                                >
                                  {isPublishing ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                      <span>Publicando...</span>
                                    </>
                                  ) : (
                                    <>
                                      <FaRocket />
                                      <span>Publicar</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Modal para nuevo diagnóstico */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FormDiagnostico onClose={() => setIsModalOpen(false)} />
      </Modal>

      {/* Diálogo de confirmación */}
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