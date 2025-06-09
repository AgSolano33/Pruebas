"use client";

import { useState, useEffect } from "react";

export default function MetricsCards() {
  const [metrics, setMetrics] = useState({
    madurezDigital: 0,
    saludFinanciera: 0,
    eficienciaOperativa: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/Contact");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            // Aquí procesarías los datos para obtener las métricas
            // Por ahora usamos valores de ejemplo
            setMetrics({
              madurezDigital: 75,
              saludFinanciera: 60,
              eficienciaOperativa: 85
            });
          }
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  const MetricCard = ({ title, value }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4">{title}</h3>
      <div className="flex justify-center items-center">
        <span className="text-6xl font-bold text-[#00AEEF]">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard 
        title="Madurez Digital" 
        value={metrics.madurezDigital} 
      />
      <MetricCard 
        title="Salud Financiera" 
        value={metrics.saludFinanciera} 
      />
      <MetricCard 
        title="Eficiencia Operativa" 
        value={metrics.eficienciaOperativa} 
      />
    </div>
  );
} 