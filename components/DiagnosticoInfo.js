"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

function Badge({ children, color = "indigo" }) {
  const colorMap = {
    indigo: "bg-indigo-100 text-indigo-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    gray: "bg-gray-100 text-gray-800"
  };
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mr-1 mb-1 ${colorMap[color]}`}>{children}</span>
  );
}

export default function DiagnosticoInfo({ onExpertosSugeridos, metricAnalyses, isLoading }) {
  const { data: session } = useSession();
  const [openIndex, setOpenIndex] = useState(null);

  // Si se pasan metricAnalyses como prop, usarlas directamente
  const analyses = metricAnalyses || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-400">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Por favor inicia sesión para ver tus análisis</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-400">
      <div className="text-center">
          
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-6 border border-indigo-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-[#1A3D7C] mb-2">Análisis General de Métricas</h4>
              <p className="text-gray-600 text-sm">Genera un análisis integral de todas tus métricas específicas con proyectos, expertos y servicios recomendados</p>
            </div>
            
            <button
              className="w-full px-6 py-3 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors font-semibold flex items-center justify-center gap-2"
              onClick={async (event) => {
                try {
                  // Mostrar loading
                  const button = event.currentTarget;
                  const originalText = button.innerHTML;
                  button.innerHTML = `
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generando Análisis...</span>
                  `;
                  button.disabled = true;

                  // Llamar al endpoint para generar el análisis general
                  const response = await fetch('/api/metric-general', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userId: session.user.id,
                      empresa: {
                        nombre: session.user.name || 'Mi Empresa',
                        sector: 'General',
                        ubicacion: 'N/A'
                      }
                    }),
                  });

                  const data = await response.json();
                  
                  if (data.success) {
                    // Recargar la página para mostrar el análisis general
                    window.location.reload();
                  } else {
                    alert('Error al generar el análisis: ' + (data.error || 'Error desconocido'));
                  }
                } catch (error) {
                  console.error('Error generating general analysis:', error);
                  alert('Error al generar el análisis general');
                } finally {
                  // Restaurar el botón
                  const button = event.currentTarget;
                  button.innerHTML = `
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generar Análisis General
                  `;
                  button.disabled = false;
                }
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generar Análisis General
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>El análisis incluirá conclusiones por área, proyectos integrales, expertos recomendados y servicios holísticos</p>
          </div>
        </div>
      </div>
  );
} 