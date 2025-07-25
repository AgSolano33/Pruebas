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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediagnosticoData = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        // Obtener datos del prediagnóstico
        const response = await fetch(`/api/prediagnostico?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            // Tomar el prediagnóstico más reciente
            const prediagnostico = data[0];
            
            // Mapear los datos del prediagnóstico al formato esperado
            setDiagnosticoData({
              informacionpersonal: {
                nombre: prediagnostico.nombre || "",
                apellido: prediagnostico.apellido || "",
                email: prediagnostico.email || "",
                telefono: prediagnostico.telefono || "",
                puesto: prediagnostico.tipoEmpresa || ""
              },
              informacionempresa: {
                sector: prediagnostico.giroActividad || "",
                nombreEmpresa: prediagnostico.nombreEmpresaProyecto || "",
                ubicacion: "No especificado", // No hay campo de ubicación en prediagnóstico
                ventasAnuales: prediagnostico.ventasAnualesEstimadas || 0,
                antiguedad: 0 // No hay campo de antigüedad en prediagnóstico
              }
            });
          } else {
            // Si no hay prediagnóstico, usar datos de la sesión como fallback
            setDiagnosticoData({
              informacionpersonal: {
                nombre: session.user.name || "",
                apellido: "",
                email: session.user.email || "",
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
          }
        }
      } catch (error) {
        console.error("Error fetching prediagnostico data:", error);
        // Fallback a datos de sesión en caso de error
        setDiagnosticoData({
          informacionpersonal: {
            nombre: session.user.name || "",
            apellido: "",
            email: session.user.email || "",
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
      } finally {
        setLoading(false);
      }
    };

    fetchPrediagnosticoData();
  }, [session]);

  if (!session) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Por favor inicia sesión para ver tu diagnóstico</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Cargando información del prediagnóstico...</p>
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