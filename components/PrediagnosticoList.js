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
      fetchPrediagnosticos();
      fetchPublishedProjects();
    }
  }, [session]);

  // Fetch prediagnósticos filtrados por usuario
  const fetchPrediagnosticos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/prediagnostico/${session.user.id}`);
      const data = await response.json();
      console.log("Prediagnósticos recibidos:", data);

      if (Array.isArray(data)) {
        setDiagnoses(data);
        setIsModalOpen(data.length === 0); // Abrir modal solo si no hay prediagnóstico
      } else {
        setError(data.error || "Error al cargar prediagnósticos");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar prediagnósticos");
    } finally {
      setLoading(false);
    }
  };

  // Fetch proyectos publicados
  const fetchPublishedProjects = async () => {
    try {
      const response = await fetch("/api/proyectos-publicados");
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const publishedSet = new Set();
        result.data.forEach((proyecto) => {
          const key = `${proyecto.nombreEmpresa}-${proyecto.nombreProyecto}`;
          publishedSet.add(key);
        });
        setPublishedProjects(publishedSet);
      }
    } catch (err) {
      console.error("Error al cargar proyectos publicados:", err);
    }
  };

  // Obtener nombre de empresa desde infoEmpresa
  const fetchEmpresaInfo = async (empresaId) => {
    try {
      const res = await fetch(`/api/empresa/${empresaId}`);
      const data = await res.json();
      return data.nombre || "Sin nombre de empresa";
    } catch (err) {
      console.error("Error al cargar infoEmpresa:", err);
      return "Sin nombre de empresa";
    }
  };

  // Eliminar diagnóstico
  const handleDelete = async (id) => {
    setConfirmDialog({
      isOpen: true,
      title: "Eliminar Diagnóstico",
      message: "¿Estás seguro de que deseas eliminar este diagnóstico? Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/diagnoses?id=${id}`, { method: "DELETE" });
          const result = await response.json();
          if (result.success) {
            setDiagnoses(diagnoses.filter(d => d._id !== id));
            toast.success("Diagnóstico eliminado exitosamente");
          } else {
            toast.error(result.error || "Error al eliminar el diagnóstico");
          }
        } catch (err) {
          toast.error("Error al eliminar el diagnóstico");
        }
        setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" });
      },
      type: "warning"
    });
  };

  // Publicar proyecto
  const handlePublish = async (diagnosis, matchIndex) => {
    const match = diagnosis["4. Posibles matches"]?.[matchIndex];
    if (!match) return;
    const nombreEmpresa = await fetchEmpresaInfo(diagnosis.empresaId);

    setConfirmDialog({
      isOpen: true,
      title: "Publicar Proyecto",
      message: `¿Deseas publicar el proyecto "${match["Titulo solucion propuesta"]}" para buscar expertos?`,
      onConfirm: async () => {
        setPublishingProject(`${diagnosis._id}-${matchIndex}`);
        try {
          const proyectoData = {
            empresa: { nombre: nombreEmpresa, sector: diagnosis["3. Categorias de proyecto"]?.Industria?.[0] || "General" },
            analisisObjetivos: {
              situacionActual: match["Titulo solucion propuesta"],
              viabilidad: match["Descripcion"],
              recomendaciones: diagnosis["3. Categorias de proyecto"]?.["Categorias de servicio buscado"] || [],
            },
          };

          const response = await fetch("/api/proyectos-publicados", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ proyectoData }),
          });
          const result = await response.json();
          if (result.success) {
            toast.success(`Proyecto "${match["Titulo solucion propuesta"]}" publicado. ${result.matches.length} expertos encontrados.`);
            const projectKey = `${nombreEmpresa}-${match["Titulo solucion propuesta"]}`;
            setPublishedProjects(prev => new Set([...prev, projectKey]));
            router.push("/dashboard?tab=proyectos");
          } else {
            toast.error(result.error || "Error al publicar proyecto");
          }
        } catch (err) {
          console.error(err);
          toast.error("Error al publicar proyecto");
        } finally {
          setPublishingProject(null);
        }
        setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" });
      },
      type: "info"
    });
  };

  const toggleCard = (diagnosisId) => {
    setExpandedCards(prev => ({ ...prev, [diagnosisId]: !prev[diagnosisId] }));
  };

  const handleViewDetails = (diagnosisId) => {
    router.push(`/diagnosis/${diagnosisId}`);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[200px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3D7C]"></div></div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="space-y-4">
      {/* Botón nuevo diagnóstico */}
      <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
           onClick={() => setIsModalOpen(true)}>
        <div className="flex items-center justify-center space-x-2 text-[#1A3D7C]">
          <FaPlus className="text-xl" />
          <span className="text-lg font-semibold">Nuevo Diagnóstico</span>
        </div>
      </div>

      {/* Lista de diagnósticos */}
      {diagnoses.length === 0 ? (
        <div className="text-center text-gray-500 p-4">No hay diagnósticos disponibles</div>
      ) : diagnoses.map(diagnosis => {
        const posiblesMatches = diagnosis["4. Posibles matches"] || [];
        const isExpanded = expandedCards[diagnosis._id];
        const nombreEmpresa = diagnosis.nombreEmpresa || "Sin nombre de empresa";

        return (
          <div key={diagnosis._id} className="bg-white rounded-lg shadow-md p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#1A3D7C]">{nombreEmpresa}</h3>
                <p className="text-sm text-gray-500">{new Date(diagnosis.createdAt).toLocaleString('es-ES')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => toggleCard(diagnosis._id)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2">
                  <FaChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  <span>{isExpanded ? 'Ocultar' : 'Ver'} Proyectos ({posiblesMatches.length})</span>
                </button>
                <button onClick={() => handleViewDetails(diagnosis._id)}
                        className="px-4 py-2 bg-[#1A3D7C] text-white rounded-lg hover:bg-blue-700">Ver detalles</button>
                <button onClick={() => handleDelete(diagnosis._id)}
                        className="p-2 text-red-600 hover:text-red-800"><FaTrash /></button>
              </div>
            </div>

            {/* Lista de matches */}
            {isExpanded && (
              <div className="space-y-3 border-t border-gray-200 pt-4">
                {posiblesMatches.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay proyectos identificados</p>
                ) : posiblesMatches.map((match, index) => {
                  const isPublishing = publishingProject === `${diagnosis._id}-${index}`;
                  const tituloProyecto = match["Titulo solucion propuesta"];
                  const projectKey = `${nombreEmpresa}-${tituloProyecto}`;
                  const isPublished = publishedProjects.has(projectKey);

                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 mb-2">{tituloProyecto}</h5>
                          <p className="text-sm text-gray-600 mb-3">{match["Descripcion"]}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-500">
                            <div><strong>Industria:</strong> {diagnosis["3. Categorias de proyecto"]?.Industry?.[0] || diagnosis["3. Categorias de proyecto"]?.Industria?.[0] || "No especificada"}</div>
                            <div><strong>Servicios:</strong> {diagnosis["3. Categorias de proyecto"]?.["Categorias de servicio buscado"]?.join(", ") || "No especificados"}</div>
                            <div><strong>Objetivos:</strong> {diagnosis["3. Categorias de proyecto"]?.["Objetivos de la empresa"]?.join(", ") || "No especificados"}</div>
                          </div>
                        </div>

                        <div className="ml-4">
                          {isPublished ? (
                            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200 flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="font-medium">Publicado</span>
                            </div>
                          ) : (
                            <button onClick={() => handlePublish(diagnosis, index)}
                                    disabled={isPublishing}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${isPublishing ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}>
                              {isPublishing ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : <><FaRocket /><span>Publicar</span></>}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FormDiagnostico onClose={() => setIsModalOpen(false)} />
      </Modal>

      {/* Confirm dialog */}
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
