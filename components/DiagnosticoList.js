"use client";

import { useEffect, useState } from "react";

export default function DiagnosticoList() {
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnosticos = async () => {
      try {
        const response = await fetch("/api/diagnostico");
        if (!response.ok) throw new Error("Error al cargar los diagnósticos");
        const data = await response.json();
        setDiagnosticos(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnosticos();
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  if (diagnosticos.length === 0) {
    return <div className="text-center py-4">No hay diagnósticos registrados</div>;
  }

  return (
    <div className="space-y-4">
      {diagnosticos.map((diagnostico) => (
        <div
          key={diagnostico._id}
          className="bg-gray-50 rounded-lg p-4 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg">{diagnostico.nombreEmpresa}</h3>
              <p className="text-sm text-gray-600">
                Tipo: {diagnostico.tipoEmpresa === "empresa" ? "Empresa" : "Emprendedor independiente"}
              </p>
              <p className="text-sm text-gray-600">
                Contacto: {diagnostico.nombreContacto}
              </p>
              <p className="text-sm text-gray-600">Email: {diagnostico.email}</p>
              <p className="text-sm text-gray-600">Teléfono: {diagnostico.telefono}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Empleados: {diagnostico.numeroEmpleados}
              </p>
              <p className="text-sm text-gray-600">
                Giro: {diagnostico.giroActividad}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Descripción: {diagnostico.descripcionActividad}
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Registrado el: {new Date(diagnostico.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
} 