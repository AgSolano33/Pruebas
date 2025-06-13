"use client";

import { useState, useEffect } from "react";

export default function MetricsCards() {
  const [metrics, setMetrics] = useState({
    madurezDigital: 0,
    saludFinanciera: 0,
    eficienciaOperativa: 0,
    recursosHumanos: 0,
    marketingVentas: 0,
    innovacionDesarrollo: 0,
    experienciaCliente: 0,
    gestionRiesgos: 0
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
       
        const response = await fetch("/api/analysis-results");
       
        
        if (response.ok) {
          const result = await response.json();
         
          
          if (result.success && result.data) {
            const data = result.data;
            setMetrics(data.metricasPorcentuales);
            setAnalysis(data.analisisMetricas);
          }
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
        setError("Error al cargar las métricas");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

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
    return <div className="text-center p-4">Cargando métricas...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Madurez Digital" 
          value={metrics.madurezDigital}
          analysis={analysis?.madurezDigital}
        />
        <MetricCard 
          title="Salud Financiera" 
          value={metrics.saludFinanciera}
          analysis={analysis?.saludFinanciera}
        />
        <MetricCard 
          title="Eficiencia Operativa" 
          value={metrics.eficienciaOperativa}
          analysis={analysis?.eficienciaOperativa}
        />
        <MetricCard 
          title="Recursos Humanos" 
          value={metrics.recursosHumanos}
          analysis={analysis?.recursosHumanos}
        />
        <MetricCard 
          title="Marketing y Ventas" 
          value={metrics.marketingVentas}
          analysis={analysis?.marketingVentas}
        />
        <MetricCard 
          title="Innovación y Desarrollo" 
          value={metrics.innovacionDesarrollo}
          analysis={analysis?.innovacionDesarrollo}
        />
        <MetricCard 
          title="Experiencia del Cliente" 
          value={metrics.experienciaCliente}
          analysis={analysis?.experienciaCliente}
        />
        <MetricCard 
          title="Gestión de Riesgos" 
          value={metrics.gestionRiesgos}
          analysis={analysis?.gestionRiesgos}
        />
      </div>
    </div>
  );
} 