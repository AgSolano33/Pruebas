"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function PrediagnosticoList() {
  const { data: session } = useSession();
  const [prediagnosticos, setPrediagnosticos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);

  const fetchPrediagnosticos = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/prediagnostico?userId=${session.user.id}`);
      if (!response.ok) throw new Error("Error al cargar los prediagnósticos");
      const data = await response.json();
      setPrediagnosticos(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar los prediagnósticos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("¿Estás seguro de que deseas eliminar este prediagnóstico?")) {
      return;
    }

    try {
      const response = await fetch(`/api/prediagnostico?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el prediagnóstico");
      
      toast.success("Prediagnóstico eliminado exitosamente");
      setPrediagnosticos(prediagnosticos.filter(p => p._id !== id));
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar el prediagnóstico");
    }
  };

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  useEffect(() => {
    if (session?.user?.id) {
    fetchPrediagnosticos();
    }
  }, [session]);

  if (isLoading) {
    return <div className="text-center py-4">Cargando...</div>;
  }
  
  return (
    <div className="flex flex-wrap gap-3 justify-start">
      {[{ esAgregar: true }, ...prediagnosticos].map((item, index) => (
        <div
          key={item._id || 'agregar'}
          className="w-full sm:w-[calc(50%-6px)] md:w-[calc(33.333%-8px)] h-[350px] bg-white shadow-md rounded-lg p-4 transition-all hover:shadow-xl"
        >
          {item.esAgregar ? (
            <div className="flex flex-col items-center justify-center h-full cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-indigo-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-xl font-semibold text-gray-700 text-center">
                Agregar Nuevo Prediagnóstico
              </p>
            </div>
          ) : (
            <div
              onClick={() => toggleCard(item._id)}
              className="cursor-pointer h-full flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 mr-2">
                  {item.nombreEmpresaProyecto}
                </h3>
                <button
                  onClick={(e) => handleDelete(item._id, e)}
                  className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-full transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 line-clamp-4">
                {item.descripcionActividad}
              </p>
            </div>
          )}
        </div>
      ))}
    
      {prediagnosticos.length === 0 && (
        <div className="w-full text-center py-4">
          No hay prediagnósticos registrados
        </div>
      )}

      {/* Modal para detalles */}
      {expandedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {prediagnosticos.find(p => p._id === expandedCard)?.nombreEmpresaProyecto}
              </h2>
              <button
                onClick={() => setExpandedCard(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Email:</strong> {prediagnosticos.find(p => p._id === expandedCard)?.email}</p>
              <p><strong>Teléfono:</strong> {prediagnosticos.find(p => p._id === expandedCard)?.telefono}</p>
              <p><strong>Tipo de Empresa:</strong> {prediagnosticos.find(p => p._id === expandedCard)?.tipoEmpresa}</p>
              <p><strong>Giro:</strong> {prediagnosticos.find(p => p._id === expandedCard)?.giroActividad}</p>
              <p><strong>Empleados:</strong> {prediagnosticos.find(p => p._id === expandedCard)?.tieneEmpleados === "si" ? prediagnosticos.find(p => p._id === expandedCard)?.numeroEmpleados : "No tiene"}</p>
              <p><strong>Ventas Anuales:</strong> ${prediagnosticos.find(p => p._id === expandedCard)?.ventasAnualesEstimadas?.toLocaleString()}</p>
              <p className="col-span-2"><strong>Descripción:</strong> {prediagnosticos.find(p => p._id === expandedCard)?.descripcionActividad}</p>
              <p className="col-span-2"><strong>Mayor Obstáculo:</strong> {prediagnosticos.find(p => p._id === expandedCard)?.mayorObstaculo}</p>
              <p className="col-span-2"><strong>Objetivos:</strong> {prediagnosticos.find(p => p._id === expandedCard)?.objetivosAcciones}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}