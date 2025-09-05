"use client";

import { useState, useEffect, useCallback } from "react";
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

  // Conteos y cache de proyectos por prediagnóstico
  const [projectCounts, setProjectCounts] = useState({});
  const [projectsByPred, setProjectsByPred] = useState({});

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning",
  });

  // --- Helpers ---
  const safeUUID = () => {
    try {
      // @ts-ignore
      if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    } catch {}
    return `tmp_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  };

  const normalizeDiagnostico = (raw) => {
    // 1) Asegura que 'resultado' sea objeto (a veces llega como JSON string)
    let r = raw?.resultado;
    if (typeof r === "string") {
      try {
        r = JSON.parse(r);
      } catch {
        r = null;
      }
    }

    // 2) Busca el título en varias variantes posibles
    const titulo =
      r?.NombreDiagnostico ??
      r?.nombreDiagnostico ??
      r?.["Nombre Diagnostico"] ??
      r?.["Nombre del Diagnostico"] ??
      r?.["Nombre del diagnóstico"] ??
      raw?.NombreDiagnostico ??
      raw?.titulo ??
      null;

    // 3) Normaliza IDs
    const pid = raw?.prediagnosticoId || raw?._id || raw?.id;

    // 4) Log útil si no encuentra título
    if (!titulo) {
      console.warn("Prediagnóstico sin título detectado:", { raw, resultado: r });
    }

    return {
      ...raw,
      _id: String(raw?._id || raw?.id || pid || safeUUID()),
      prediagnosticoId: String(pid || raw?._id || raw?.id || safeUUID()),
      tituloDiagnostico: String(titulo || "Diagnóstico sin título"),
      createdAt: raw?.createdAt || new Date().toISOString(),
    };
  };

  // --- Fetchers ---
  const fetchPrediagnosticos = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/prediagnostico/${session.user.id}`);
      if (!res.ok) throw new Error("No se pudo cargar prediagnósticos");
      const docs = await res.json(); // array directo
      const items = Array.isArray(docs) ? docs.map(normalizeDiagnostico) : [];

      items.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setDiagnoses(items);
      setIsModalOpen(items.length === 0);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Error al cargar prediagnósticos");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  const fetchUserProjects = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(
        `/api/assistant/ProyectosPre?userId=${encodeURIComponent(session.user.id)}`
      );
      if (!res.ok) throw new Error("No se pudieron cargar proyectos");
      const json = await res.json();
      const proyectos = Array.isArray(json?.proyectos) ? json.proyectos : [];

      const counts = {};
      const byPred = {};
      for (const p of proyectos) {
        const pid = String(p?.prediagnosticoId || "");
        if (!pid) continue;
        counts[pid] = (counts[pid] || 0) + 1;
        if (!byPred[pid]) byPred[pid] = [];
        byPred[pid].push(p);
      }

      setProjectCounts(counts);
      setProjectsByPred(byPred);
    } catch (e) {
      console.warn("No se pudieron precargar proyectos del usuario (se hará lazy fetch por pred).");
    }
  }, [session?.user?.id]);

  const fetchProjectsForPred = useCallback(
    async (prediagnosticoId) => {
      if (!session?.user?.id || !prediagnosticoId) return;
      try {
        const url = `/api/assistant/ProyectosPre?userId=${encodeURIComponent(
          session.user.id
        )}&prediagnosticoId=${encodeURIComponent(prediagnosticoId)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("No se pudieron cargar proyectos del prediagnóstico");
        const json = await res.json();
        const proyectos = Array.isArray(json?.proyectos) ? json.proyectos : [];

        setProjectsByPred((prev) => ({ ...prev, [prediagnosticoId]: proyectos }));
        setProjectCounts((prev) => ({ ...prev, [prediagnosticoId]: proyectos.length || 0 }));
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar proyectos asociados");
      }
    },
    [session?.user?.id]
  );

  // --- Effects ---
  useEffect(() => {
    if (session?.user?.id) {
      fetchPrediagnosticos();
      fetchUserProjects(); // precarga conteos; si falla, igual funciona con lazy
    }
  }, [session?.user?.id, fetchPrediagnosticos, fetchUserProjects]);

  // Auto-refresh al guardar desde el formulario (fallback por evento global)
  useEffect(() => {
    const onCreated = () => {
      fetchPrediagnosticos();
      fetchUserProjects();
    };
    window.addEventListener("prediagnostico:created", onCreated);
    return () => window.removeEventListener("prediagnostico:created", onCreated);
  }, [fetchPrediagnosticos, fetchUserProjects]);

  // --- Actions ---
  const handleDelete = async (id) => {
    setConfirmDialog({
      isOpen: true,
      title: "Eliminar Diagnóstico",
      message: "¿Estás seguro de eliminar este diagnóstico? Esta acción no se puede deshacer.",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/diagnoses?id=${id}`, { method: "DELETE" });
          const result = await response.json();
          if (result?.success) {
            setDiagnoses((prev) => prev.filter((d) => d._id !== id));
            toast.success("Diagnóstico eliminado");
          } else {
            toast.error(result?.error || "Error al eliminar");
          }
        } catch {
          toast.error("Error al eliminar");
        }
        setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" });
      },
      type: "warning",
    });
  };

  const handlePublishProyecto = async (proyecto, pid) => {
    if (!proyecto?._id) return;
    setPublishingProject(String(proyecto._id));
    try {
      const response = await fetch(`/api/assistant/ProyectosPre/publicado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: proyecto._id, publicado: true }),
      });
      const result = await response.json();
      if (response.ok && (result?.success ?? true)) {
        toast.success(`Proyecto "${proyecto.nombreProyecto}" publicado.`);
        await fetchProjectsForPred(pid); // refresca lista y conteo del pred
      } else {
        toast.error(result?.error || "Error al publicar");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al publicar");
    } finally {
      setPublishingProject(null);
    }
  };

  const toggleCard = async (diagnosisId, prediagnosticoId) => {
    setExpandedCards((prev) => ({ ...prev, [diagnosisId]: !prev[diagnosisId] }));
    if (!projectsByPred[prediagnosticoId]) {
      await fetchProjectsForPred(prediagnosticoId); // lazy fetch si no está en cache
    }
  };

  const handleViewDetails = (diagnosisId) => {
    router.push(`/diagnosis/${diagnosisId}`);
  };

  // --- Render ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3D7C]"></div>
      </div>
    );
  }
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="space-y-4">
      {/* Nuevo diagnóstico */}
      <div
        className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center justify-center space-x-2 text-[#1A3D7C]">
          <FaPlus className="text-xl" />
          <span className="text-lg font-semibold">Nuevo Diagnóstico</span>
        </div>
      </div>

      {/* Lista */}
      {diagnoses.length === 0 ? (
        <div className="text-center text-gray-500 p-4">No hay diagnósticos disponibles</div>
      ) : (
        diagnoses.map((diagnosis) => {
          const isExpanded = !!expandedCards[diagnosis._id];
          const pid = diagnosis.prediagnosticoId;
          const count = projectCounts[pid] || 0;

          return (
            <div key={diagnosis._id} className="bg-white rounded-lg shadow-md p-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#1A3D7C]">
                    {diagnosis.tituloDiagnostico}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(diagnosis.createdAt).toLocaleString("es-ES")}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleCard(diagnosis._id, pid)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FaChevronDown className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    <span>{isExpanded ? "Ocultar" : "Ver"} Proyectos ({count})</span>
                  </button>
                  <button
                    onClick={() => handleViewDetails(diagnosis._id)}
                    className="px-4 py-2 bg-[#1A3D7C] text-white rounded-lg hover:bg-blue-700"
                  >
                    Ver detalles
                  </button>
                  <button
                    onClick={() => handleDelete(diagnosis._id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Proyectos asociados */}
              {isExpanded && (
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  {!projectsByPred[pid] ? (
                    <p className="text-gray-500 text-center py-4">Cargando proyectos…</p>
                  ) : projectsByPred[pid].length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No hay proyectos asociados</p>
                  ) : (
                    projectsByPred[pid].map((proy) => {
                      const isPublishing = publishingProject === String(proy._id);
                      const estado = proy?.estado;
                      const publicado = !!proy?.publicado;

                      return (
                        <div key={String(proy._id)} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800 mb-1">
                                {proy.nombreProyecto}
                              </h5>
                              <p className="text-sm text-gray-600 mb-3">
                                {proy.resumenProyecto || proy.descripcionProyecto}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                {estado && (
                                  <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                                    Estado: {estado}
                                  </span>
                                )}
                                {publicado && (
                                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                                    Publicado
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="ml-4">
                              {publicado ? (
                                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="font-medium">Publicado</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handlePublishProyecto(proy, pid)}
                                  disabled={isPublishing}
                                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                    isPublishing
                                      ? "bg-gray-400 cursor-not-allowed text-white"
                                      : "bg-green-600 text-white hover:bg-green-700"
                                  }`}
                                >
                                  {isPublishing ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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

      {/* Modal: refresca al guardar */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FormDiagnostico
          onClose={() => setIsModalOpen(false)}
          onSaved={async () => {
            setIsModalOpen(false);
            await fetchPrediagnosticos();
            await fetchUserProjects();
          }}
        />
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
