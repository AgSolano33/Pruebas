"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaUsers, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner,
  FaEye, FaTachometerAlt, FaTimes, FaBan
} from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";
// import Modal from "@/components/Modal"; // 👈 matches: comentado
// import ProyectoContextMenu from "@/components/ProyectoContextMenu"; // 👈 matches: comentado
// import PostulacionesExpertos from "@/components/PostulacionesExpertos"; // 👈 matches: comentado
import { useProyectosState } from "@/hooks/useProyectosState";

export default function ProyectosTablero() {
  const { data: session } = useSession();
  const router = useRouter();

  const [proyectosOriginales, setProyectosOriginales] = useState([]);
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
    type: "warning",
  });

  // === matches: todo comentado ===
  // const [seleccionado, setSeleccionado] = useState({});
  // const [modalOpen, setModalOpen] = useState(false);
  // const [allMatches, setAllMatches] = useState([]);
  // const [matches, setMatches] = useState([]);
  // const [loadingMatches, setLoadingMatches] = useState(false);
  // const [selectedProyecto, setSelectedProyecto] = useState(null);
  // const [errorMatches, setErrorMatches] = useState(null);
  // const [expertosData, setExpertosData] = useState(null);
  // const [contextMenuOpen, setContextMenuOpen] = useState(false);
  // const [selectedProyectoForContext, setSelectedProyectoForContext] = useState(null);
  // const [shouldRecalculateMatches, setShouldRecalculateMatches] = useState(false);
  // const [postulacionesOpen, setPostulacionesOpen] = useState(false);
  // const [selectedProyectoForPostulaciones, setSelectedProyectoForPostulaciones] = useState(null);

  // Hook del usuario (lo mantengo por compatibilidad con tu estado global)
  const proyectos = useProyectosState(proyectosOriginales);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProyectos();
    }
  }, [session, filtroEstado]);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showModal) handleCerrarModal();
    };
    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  // === matches: todo comentado ===
  // useEffect(() => {
  //   const fetchAllMatches = async () => { ... };
  //   fetchAllMatches();
  // }, []);

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      if (!session?.user?.id) return;

      const params = new URLSearchParams({ userId: session.user.id });
      if (filtroEstado !== "todos") params.set("estado", filtroEstado);

      const url = `/api/assistant/ProyectosPre?${params.toString()}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Error al cargar proyectos");

      // data: { ok, count, proyectos }
      setProyectosOriginales(Array.isArray(data?.proyectos) ? data.proyectos : []);
    } catch (err) {
      setError(err.message || "Error al cargar proyectos");
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
      case "aprobacion":
        return "bg-purple-100 text-purple-800 border-purple-200";
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
      case "aprobacion":
        return <FaCheckCircle className="text-purple-600" />;
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
      case "aprobacion":
        return "Aprobación";
      default:
        return estado || "—";
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
    const proyecto = proyectos.find((p) => p._id === proyectoId);

    setConfirmDialog({
      isOpen: true,
      title: "Cancelar Proyecto",
      message: `¿Cancelar el proyecto "${proyecto?.nombreProyecto}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        setCancelandoProyecto(proyectoId);
        try {
          // Nuevo endpoint: PATCH cambia estado => cancelado
          const response = await fetch("/api/assistant/ProyectosPre", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: proyectoId,
              estado: "cancelado",
            }),
          });

          const result = await response.json();

          if (!response.ok) throw new Error(result?.error || "Error al cancelar");

          toast.success("Proyecto cancelado");
          // Actualiza localmente
          setProyectosOriginales((prev) =>
            prev.map((p) => (p._id === proyectoId ? { ...p, estado: "cancelado" } : p))
          );
        } catch (error) {
          console.error("Error al cancelar proyecto:", error);
          toast.error(error.message || "Error al cancelar el proyecto");
        } finally {
          setCancelandoProyecto(null);
          setConfirmDialog({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: null,
            type: "warning",
          });
        }
      },
      type: "warning",
    });
  };

  // === matches: todo comentado ===
  // const handleOpenDashboard = (proyecto) => { router.push(`/dashboard/proyecto/${proyecto._id}`); };
  // const handleOpenPostulaciones = (proyecto) => { ... };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A3D7C]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center">
        <h3 className="text-lg font-semibold text-gray-700">Filtrar por estado:</h3>
        <div className="flex flex-wrap gap-2">
          {["todos", "publicado", "en_espera", "en_proceso", "completado", "cancelado", "aprobacion"].map(
            (estado) => (
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
            )
          )}
        </div>
      </div>

      {/* Tablero */}
      {proyectos.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <FaUsers className="text-6xl mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No hay proyectos</h3>
          <p>Cuando generes o publiques proyectos, aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((proyecto) => (
            <div
              key={proyecto._id}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
            >
              {/* Header de la tarjeta */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {getEstadoIcon(proyecto.estado)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(
                        proyecto.estado
                      )}`}
                    >
                      {getEstadoTexto(proyecto.estado)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {new Date(proyecto.updatedAt || proyecto.createdAt || Date.now()).toLocaleDateString(
                        "es-ES"
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#1A3D7C] mb-1">
                  {proyecto.nombreProyecto}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {proyecto.resumenProyecto || "—"}
                </p>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-4 flex-1 flex flex-col">
                {/* Descripción */}
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Descripción del Proyecto
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-4">
                    {proyecto.descripcionProyecto || "—"}
                  </p>
                </div>

                {/* Estadísticas simples */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 mb-4">
                  <div className="flex items-center gap-1">
                    <FaUsers />
                    <span>Prediagnóstico: {String(proyecto.prediagnosticoId).slice(-6)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>
                      {new Date(proyecto.createdAt || Date.now()).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="mt-auto flex flex-col gap-2 p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerDetalles(proyecto)}
                      className="flex-1 bg-[#1A3D7C] text-white px-4 py-2 rounded-lg hover:bg-[#0f2a5a] transition-colors flex items-center justify-center gap-2 text-xs"
                    >
                      <FaEye />
                      Ver Detalles
                    </button>

                    {/* Cancelar (si no está cancelado) */}
                    {proyecto.estado !== "cancelado" && (
                      <button
                        onClick={() => handleCancelarProyecto(proyecto._id)}
                        disabled={cancelandoProyecto === proyecto._id}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center justify-center gap-2 text-xs"
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

                  {/* matches: oculto
                  {proyecto.estado === "en_proceso" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDashboard(proyecto);
                      }}
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold flex items-center gap-2 justify-center"
                    >
                      <FaTachometerAlt />
                      Dashboard del Proyecto
                    </button>
                  )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalles (sin matches) */}
      {showModal && proyectoDetalle && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleCerrarModal}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#1A3D7C]">Detalles del Proyecto</h2>
              <button
                onClick={handleCerrarModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Información General</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Proyecto:</span>
                      <p className="text-gray-900">{proyectoDetalle.nombreProyecto}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Estado:</span>
                      <span
                        className={`ml-2 px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(
                          proyectoDetalle.estado
                        )}`}
                      >
                        {getEstadoTexto(proyectoDetalle.estado)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Prediagnóstico ID:</span>
                      <p className="text-gray-900 font-mono text-xs">
                        {proyectoDetalle.prediagnosticoId}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">ID del Proyecto:</span>
                      <p className="text-gray-900 font-mono text-xs">{proyectoDetalle._id}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Fechas</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Creado:</span>
                      <p className="text-gray-900">
                        {new Date(proyectoDetalle.createdAt || Date.now()).toLocaleString("es-ES")}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Actualizado:</span>
                      <p className="text-gray-900">
                        {new Date(proyectoDetalle.updatedAt || Date.now()).toLocaleString("es-ES")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen y descripción */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Resumen</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 leading-relaxed">
                    {proyectoDetalle.resumenProyecto || "—"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Descripción</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 leading-relaxed">
                    {proyectoDetalle.descripcionProyecto || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
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

      {/* === matches: todo comentado === */}
      {/* <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}> ... </Modal> */}
      {/* <ProyectoContextMenu ... /> */}
      {/* <PostulacionesExpertos ... /> */}
    </div>
  );
}
