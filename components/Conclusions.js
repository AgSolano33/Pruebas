"use client";

import { useState, useEffect } from "react";
import { FaBuilding, FaChartLine, FaClipboardList, FaLightbulb } from "react-icons/fa";

export default function Conclusions() {
  const [conclusions, setConclusions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConclusions = async () => {
      try {
        const response = await fetch('/api/analysis-results');
        const result = await response.json();

        if (result.success && result.data) {
          setConclusions(result.data);
        } else {
          setError(result.error || 'Error al cargar las conclusiones');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConclusions();
  }, []);

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

  if (!conclusions) {
    return (
      <div className="text-center text-gray-500 p-4">
        No hay conclusiones disponibles
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de la Empresa */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaBuilding className="text-[#1A3D7C] text-xl" />
          <h2 className="text-xl font-semibold text-[#1A3D7C]">Resumen de la Empresa</h2>
        </div>
        <p className="text-gray-600 mb-4">{conclusions.resumenEmpresa.descripcion}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Fortalezas</h3>
            <ul className="list-disc list-inside space-y-1">
              {conclusions.resumenEmpresa.fortalezas.map((fortaleza, index) => (
                <li key={index} className="text-gray-600">{fortaleza}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Análisis de Objetivos */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaChartLine className="text-[#1A3D7C] text-xl" />
          <h2 className="text-xl font-semibold text-[#1A3D7C]">Análisis de Objetivos</h2>
        </div>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Situación Actual</h3>
            <p className="text-gray-600">{conclusions.analisisObjetivos.situacionActual}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Viabilidad</h3>
            <p className="text-gray-600">{conclusions.analisisObjetivos.viabilidad}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Recomendaciones</h3>
            <ul className="list-disc list-inside space-y-1">
              {conclusions.analisisObjetivos.recomendaciones.map((recomendacion, index) => (
                <li key={index} className="text-gray-600">{recomendacion}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Próximos Pasos */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaClipboardList className="text-[#1A3D7C] text-xl" />
          <h2 className="text-xl font-semibold text-[#1A3D7C]">Próximos Pasos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Inmediatos</h3>
            <ul className="list-disc list-inside space-y-1">
              {conclusions.proximosPasos.inmediatos.map((paso, index) => (
                <li key={index} className="text-gray-600">{paso}</li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Corto Plazo</h3>
            <ul className="list-disc list-inside space-y-1">
              {conclusions.proximosPasos.cortoPlazo.map((paso, index) => (
                <li key={index} className="text-gray-600">{paso}</li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Mediano Plazo</h3>
            <ul className="list-disc list-inside space-y-1">
              {conclusions.proximosPasos.medianoPlazo.map((paso, index) => (
                <li key={index} className="text-gray-600">{paso}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
} 