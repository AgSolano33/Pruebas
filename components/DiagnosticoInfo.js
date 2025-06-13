"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function DiagnosticoInfo() {
  const { data: session } = useSession();
  const [diagnosticoData, setDiagnosticoData] = useState({
    informacionpersonal: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      puesto: ""
    },
    informacionempresa: {
      sector: "",
      nombreEmpresa: "",
      ubicacion: "",
      ventasAnuales: 0,
      antiguedad: 0
    }
  });

  useEffect(() => {
    const fetchDiagnosticoData = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/Contact?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setDiagnosticoData(data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching diagnostico data:", error);
      }
    };

    fetchDiagnosticoData();
  }, [session]);

  if (!session) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Por favor inicia sesión para ver tu diagnóstico</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
      {/* Sección de Información Personal */}
      <div className="bg-white rounded-lg shadow-lg p-4 h-[400px] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-[#1A3D7C]">Información Personal</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-green-600">Nombre Completo</p>
            <p className="font-medium text-black">
              {diagnosticoData.informacionpersonal.nombre} {diagnosticoData.informacionpersonal.apellido}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-600">Email</p>
            <p className="font-medium text-black">{diagnosticoData.informacionpersonal.email}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-600">Teléfono</p>
            <p className="font-medium text-black">{diagnosticoData.informacionpersonal.telefono}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-600">Puesto</p>
            <p className="font-medium text-black">{diagnosticoData.informacionpersonal.puesto}</p>
          </div>
        </div>
      </div>

      {/* Sección de Información Empresarial */}
      <div className="bg-white rounded-lg shadow-lg p-4 h-[400px] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-[#1A3D7C]">Información de la Empresa</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-green-600">Sector</p>
            <p className="font-medium text-black">{diagnosticoData.informacionempresa.sector}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-600">Nombre de la Empresa</p>
            <p className="font-medium text-black">{diagnosticoData.informacionempresa.nombreEmpresa}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-600">Ubicación</p>
            <p className="font-medium text-black">{diagnosticoData.informacionempresa.ubicacion}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-600">Ventas Anuales</p>
            <p className="font-medium text-black">${diagnosticoData.informacionempresa.ventasAnuales?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-600">Antigüedad (años)</p>
            <p className="font-medium text-black">{diagnosticoData.informacionempresa.antiguedad}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 