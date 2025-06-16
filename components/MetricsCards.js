"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function MetricsCards() {
  const { data: session } = useSession();
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        setError("No se encontró el ID de usuario para cargar las métricas.");
        return;
      }

      try {
        const response = await fetch(`/api/analysis-results?userId=${session.user.id}`);
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success && result.data) {
            setDiagnosis(result.data);
          } else {
            setError(result.error || "Error al cargar las métricas");
          }
        } else {
          const errorResult = await response.json();
          setError(errorResult.error || "Error al cargar las métricas");
        }
      } catch (error) {
        setError("Error al cargar las métricas: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDiagnosis();
    }
  }, [session]);

  const MetricCard = ({ title, value, analysis }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4">{title}</h3>
      <div className="flex justify-center items-center mb-4">
        <span className="text-6xl font-bold text-[#00AEEF]">{value}%</span>
      </div>
      {analysis && (
        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-2">{analysis.interpretacion}</p>
          <ul className="list-disc list-inside">
            {analysis.recomendaciones.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3D7C]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!diagnosis) {
    return <div className="text-center text-gray-500 p-4">No hay métricas disponibles</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Madurez Digital" 
          value={diagnosis.porcentajes?.madurezDigital || 0}
          analysis={diagnosis.analisisMetricas?.madurezDigital}
        />
        <MetricCard 
          title="Salud Financiera" 
          value={diagnosis.porcentajes?.saludFinanciera || 0}
          analysis={diagnosis.analisisMetricas?.saludFinanciera}
        />
        <MetricCard 
          title="Eficiencia Operativa" 
          value={diagnosis.porcentajes?.eficienciaOperativa || 0}
          analysis={diagnosis.analisisMetricas?.eficienciaOperativa}
        />
        <MetricCard 
          title="Recursos Humanos" 
          value={diagnosis.porcentajes?.recursosHumanos || 0}
          analysis={diagnosis.analisisMetricas?.recursosHumanos}
        />
        <MetricCard 
          title="Marketing y Ventas" 
          value={diagnosis.porcentajes?.marketingVentas || 0}
          analysis={diagnosis.analisisMetricas?.marketingVentas}
        />
        <MetricCard 
          title="Innovación y Desarrollo" 
          value={diagnosis.porcentajes?.innovacionDesarrollo || 0}
          analysis={diagnosis.analisisMetricas?.innovacionDesarrollo}
        />
        <MetricCard 
          title="Experiencia del Cliente" 
          value={diagnosis.porcentajes?.experienciaCliente || 0}
          analysis={diagnosis.analisisMetricas?.experienciaCliente}
        />
        <MetricCard 
          title="Gestión de Riesgos" 
          value={diagnosis.porcentajes?.gestionRiesgos || 0}
          analysis={diagnosis.analisisMetricas?.gestionRiesgos}
        />
      </div>
    </div>
  );
} 