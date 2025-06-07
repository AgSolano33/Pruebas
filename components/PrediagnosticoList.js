"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PrediagnosticoList() {
  const [prediagnosticos, setPrediagnosticos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);

  const fetchPrediagnosticos = async () => {
    try {
      const response = await fetch("/api/prediagnostico");
      if (!response.ok) throw new Error("Error al cargar los prediagnósticos");
      const data = await response.json();
      setPrediagnosticos(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Evitar que el click se propague al card
    if (!confirm("¿Estás seguro de que deseas eliminar este prediagnóstico?")) {
      return;
    }

    try {
      const response = await fetch(`/api/prediagnostico?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el prediagnóstico");

      toast.success("Prediagnóstico eliminado exitosamente");
      fetchPrediagnosticos(); // Recargar la lista
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar el prediagnóstico");
    }
  };

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  useEffect(() => {
    fetchPrediagnosticos();
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  if (prediagnosticos.length === 0) {
    return <div className="text-center py-4">No hay prediagnósticos registrados</div>;
  }

  return (
    <div className="space-y-4">
      {prediagnosticos.map((prediagnostico) => (
        <div
          key={prediagnostico._id}
          onClick={() => toggleCard(prediagnostico._id)}
          className="bg-gray-50 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {prediagnostico.nombreEmpresaProyecto}
              </h3>
              <button
                onClick={(e) => handleDelete(prediagnostico._id, e)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">
                {prediagnostico.nombre} {prediagnostico.apellido}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {prediagnostico.email}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(prediagnostico.createdAt).toLocaleDateString()}
            </p>

            {expandedCard === prediagnostico._id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {prediagnostico.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Teléfono:</span> {prediagnostico.telefono}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Tipo de Empresa:</span>{" "}
                    {prediagnostico.tipoEmpresa}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Giro:</span> {prediagnostico.giroActividad}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Empleados:</span>{" "}
                    {prediagnostico.tieneEmpleados === "si"
                      ? prediagnostico.numeroEmpleados
                      : "No tiene"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Ventas Anuales:</span>{" "}
                    ${prediagnostico.ventasAnualesEstimadas?.toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Descripción:</span>{" "}
                    {prediagnostico.descripcionActividad}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Mayor Obstáculo:</span>{" "}
                    {prediagnostico.mayorObstaculo}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Objetivos:</span>{" "}
                    {prediagnostico.objetivosAcciones}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 