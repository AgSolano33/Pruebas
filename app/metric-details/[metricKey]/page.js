"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MetricDetails({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { metricKey } = params;
  const userId = searchParams.get('userId');

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!userId) {
        setError("No se encontró el ID de usuario");
        return;
      }

      try {
        const response = await fetch(`/api/analysis_results?userId=${userId}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setAnalysis(result.data);
          } else {
            setError("No se encontró el análisis para este usuario");
          }
        } else {
          const errorResult = await response.json();
          setError(errorResult.error || "Error al cargar el análisis");
        }
      } catch (error) {
        setError("Error al cargar el análisis: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [userId]);

  const getMetricTitle = (key) => {
    const titles = {
      madurezDigital: "Madurez Digital",
      saludFinanciera: "Salud Financiera",
      eficienciaOperativa: "Eficiencia Operativa",
      recursosHumanos: "Recursos Humanos",
      marketingVentas: "Marketing y Ventas",
      innovacionDesarrollo: "Innovación y Desarrollo",
      experienciaCliente: "Experiencia del Cliente",
      gestionRiesgos: "Gestión de Riesgos"
    };
    return titles[key] || key;
  };

  const getLevelColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLevelText = (percentage) => {
    if (percentage >= 80) return 'Excelente';
    if (percentage >= 60) return 'Bueno';
    if (percentage >= 40) return 'Regular';
    return 'Necesita Mejora';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3D7C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-gray-500 text-xl mb-4">No hay análisis disponible</div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const metricData = analysis.analisisMetricas[metricKey];
  const metricValue = analysis.metricasPorcentuales[metricKey];
  const levelColor = getLevelColor(metricValue);
  const levelText = getLevelText(metricValue);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A3D7C]">{getMetricTitle(metricKey)}</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors"
          >
            Volver
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-[#1A3D7C] mb-4">Resumen</h2>
            <div className="flex flex-col items-center mb-6">
              <span className="text-7xl font-bold text-[#00AEEF]">{metricValue}%</span>
              <span className={`mt-2 text-xl font-medium ${levelColor}`}>{levelText}</span>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Descripción del Módulo</h3>
                <p className="text-gray-600">{metricData.descripcionModulo.objetivo}</p>
                <p className="text-gray-600 mt-2">{metricData.descripcionModulo.alcance}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Conclusión</h3>
                <p className="text-gray-600">{metricData.conclusionBasadaPuntuacion.impactoGeneral}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-[#1A3D7C] mb-4">Análisis Detallado</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Interpretación</h3>
                  <p className="text-gray-600">{metricData.interpretacion}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Fortalezas</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {metricData.conclusionBasadaPuntuacion.fortalezas.map((fortaleza, index) => (
                      <li key={index}>{fortaleza}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Áreas de Mejora</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {metricData.conclusionBasadaPuntuacion.areasMejora.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-[#1A3D7C] mb-4">Recomendaciones</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {metricData.recomendaciones.map((recomendacion, index) => (
                  <li key={index}>{recomendacion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 