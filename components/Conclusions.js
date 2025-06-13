"use client";

import { useState, useEffect } from "react";

export default function Conclusions() {
  const [conclusions, setConclusions] = useState({
    resumenEmpresa: {
      descripcion: "",
      fortalezas: [],
      debilidades: [],
      oportunidades: []
    },
    analisisObjetivos: {
      situacionActual: "",
      viabilidad: "",
      recomendaciones: []
    },
    proximosPasos: {
      inmediatos: [],
      cortoPlazo: [],
      medianoPlazo: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConclusions = async () => {
      try {
        const response = await fetch("/api/analysis-results");
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success && result.data) {
            const data = result.data;
            setConclusions({
              resumenEmpresa: data.resumenEmpresa,
              analisisObjetivos: data.analisisObjetivos,
              proximosPasos: data.proximosPasos
            });
          }
        }
      } catch (error) {
        console.error("Error fetching conclusions:", error);
        setError("Error al cargar las conclusiones");
      } finally {
        setLoading(false);
      }
    };

    fetchConclusions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Resumen de la Empresa</h3>
          <p className="text-gray-600 mb-4">{conclusions.resumenEmpresa.descripcion}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-[#1A3D7C] mb-2">Fortalezas</h4>
              <ul className="list-disc list-inside space-y-1">
                {conclusions.resumenEmpresa.fortalezas.map((fortaleza, index) => (
                  <li key={index} className="text-gray-600">{fortaleza}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#1A3D7C] mb-2">Debilidades</h4>
              <ul className="list-disc list-inside space-y-1">
                {conclusions.resumenEmpresa.debilidades.map((debilidad, index) => (
                  <li key={index} className="text-gray-600">{debilidad}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#1A3D7C] mb-2">Oportunidades</h4>
              <ul className="list-disc list-inside space-y-1">
                {conclusions.resumenEmpresa.oportunidades.map((oportunidad, index) => (
                  <li key={index} className="text-gray-600">{oportunidad}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Análisis de Objetivos</h3>
          <p className="text-gray-600 mb-2">{conclusions.analisisObjetivos.situacionActual}</p>
          <p className="text-gray-600 mb-4">{conclusions.analisisObjetivos.viabilidad}</p>
          
          <h4 className="font-medium text-[#1A3D7C] mb-2">Recomendaciones</h4>
          <ul className="list-disc list-inside space-y-2">
            {conclusions.analisisObjetivos.recomendaciones.map((rec, index) => (
              <li key={index} className="text-gray-600">{rec}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Próximos Pasos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-[#1A3D7C] mb-2">Inmediatos (30 días)</h4>
              <ul className="list-disc list-inside space-y-1">
                {conclusions.proximosPasos.inmediatos.map((paso, index) => (
                  <li key={index} className="text-gray-600">{paso}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#1A3D7C] mb-2">Corto Plazo (3 meses)</h4>
              <ul className="list-disc list-inside space-y-1">
                {conclusions.proximosPasos.cortoPlazo.map((paso, index) => (
                  <li key={index} className="text-gray-600">{paso}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#1A3D7C] mb-2">Mediano Plazo (6 meses)</h4>
              <ul className="list-disc list-inside space-y-1">
                {conclusions.proximosPasos.medianoPlazo.map((paso, index) => (
                  <li key={index} className="text-gray-600">{paso}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 