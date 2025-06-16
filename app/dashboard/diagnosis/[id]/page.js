"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function DiagnosisDetails({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const solutionIndex = parseInt(searchParams.get('solution') || '0');

  useEffect(() => {
    const fetchDiagnosis = async () => {
      console.log('DiagnosisDetails - Fetching diagnosis for ID:', params.id, 'Solution Index:', solutionIndex);
      try {
        const response = await fetch(`/api/diagnoses?id=${params.id}`);
        const result = await response.json();
        console.log('DiagnosisDetails - API Response:', result);

        if (result.success && result.data) {
          setDiagnosis(result.data);
          console.log('DiagnosisDetails - Diagnosis data set:', result.data);
        } else {
          setError(result.error || 'Error al cargar el diagnóstico');
          console.error('DiagnosisDetails - Error in API response:', result.error);
        }
      } catch (error) {
        setError(error.message);
        console.error('DiagnosisDetails - Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [params.id, solutionIndex]);

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

  if (!diagnosis) {
    return (
      <div className="text-center text-gray-500 p-4">
        No se encontró el diagnóstico
      </div>
    );
  }

  // Acceder a la solución específica directamente del array PosiblesSoluciones
  const solution = diagnosis.PosiblesSoluciones?.[solutionIndex];
  console.log('DiagnosisDetails - Attempting to render solution:', solution);

  if (!solution) {
    return (
      <div className="text-center text-gray-500 p-4">
        No se encontró la solución específica
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="flex items-center text-[#1A3D7C] hover:text-[#152d5c] mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Volver
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-[#1A3D7C] mb-6">
          {solution?.Solucion}
        </h1>

        <div className="space-y-6">
          {/* Descripción */}
          <section>
            <h2 className="text-xl font-semibold text-[#1A3D7C] mb-3">Descripción</h2>
            <p className="text-gray-600">{solution?.Descripcion}</p>
          </section>

          {/* Herramientas */}
          <section>
            <h2 className="text-xl font-semibold text-[#1A3D7C] mb-3">Herramientas</h2>
            <ul className="list-disc list-inside space-y-2">
              {solution?.Herramientas?.map((herramienta, index) => (
                <li key={index} className="text-gray-600">{herramienta}</li>
              ))}
            </ul>
          </section>

          {/* Posibles Matches */}
          <section>
            <h2 className="text-xl font-semibold text-[#1A3D7C] mb-3">Posibles Matches</h2>
            <div className="space-y-4">
              {diagnosis.PosiblesMatches?.map((match, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-[#1A3D7C] mb-2">
                    {match.Titulo}
                  </h3>
                  <p className="text-gray-600 mb-2">{match.Descripcion}</p>
                  {match.Beneficio && (
                    <p className="text-green-600">
                      <span className="font-medium">Beneficio:</span> {match.Beneficio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 