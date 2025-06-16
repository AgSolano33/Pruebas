"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaChevronDown, FaTrash, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import FormDiagnostico from "@/components/FormDiagnostico";

export default function PrediagnosticoList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    if (session?.user?.id) {
      fetchDiagnoses();
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

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este diagnóstico?')) {
      try {
        const response = await fetch(`/api/diagnoses?id=${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          setDiagnoses(diagnoses.filter(d => d._id !== id));
        } else {
          setError(result.error || 'Error al eliminar el diagnóstico');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleViewDetails = (diagnosisId, solutionIndex) => {
    router.push(`/dashboard/diagnosis/${diagnosisId}?solution=${solutionIndex}`);
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

    const match = diagnosticoGeneral.match(/La empresa ['"]([^'"]+)['"]/);
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

          return (
            <div key={diagnosis._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#1A3D7C]">
                  {nombreEmpresa}
                </h3>
                <button
                  onClick={() => handleDelete(diagnosis._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Modal para nuevo diagnóstico */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FormDiagnostico onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}