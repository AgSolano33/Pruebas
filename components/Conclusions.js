"use client";

import { useState, useEffect } from "react";

export default function Conclusions({ diagnosisData }) {
  const [conclusions, setConclusions] = useState({
    summary: "",
    recommendations: [],
    nextSteps: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    const analyzeDiagnosis = async () => {
      if (!diagnosisData) return;
      
      setIsLoading(true);
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ diagnosisData }),
        });

        if (response.ok) {
          const data = await response.json();
          setConclusions({
            summary: data.summary,
            recommendations: data.recommendations,
            nextSteps: data.nextSteps
          });
          setIsExisting(data.existingDiagnosis);
        }
      } catch (error) {
        console.error("Error analyzing diagnosis:", error);
      } finally {
        setIsLoading(false);
      }
    };

    analyzeDiagnosis();
  }, [diagnosisData]);

  if (isLoading) {
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {isExisting && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
          Este es un diagnóstico existente
        </div>
      )}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Resumen</h3>
          <p className="text-gray-600">{conclusions.summary}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Recomendaciones</h3>
          <ul className="list-disc list-inside space-y-2">
            {conclusions.recommendations.map((rec, index) => (
              <li key={index} className="text-gray-600">{rec}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Próximos Pasos</h3>
          <ul className="list-disc list-inside space-y-2">
            {conclusions.nextSteps.map((step, index) => (
              <li key={index} className="text-gray-600">{step}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 