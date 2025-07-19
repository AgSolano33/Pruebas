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

export default function DiagnosticoInfo({ onExpertosSugeridos }) {
  const { data: session } = useSession();
  const [metricAnalyses, setMetricAnalyses] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchMetricAnalyses = async () => {
      try {
        const res = await fetch(`/api/metric-analysis/user/${session.user.id}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.analyses)) {
          setMetricAnalyses(data.analyses.slice(0, 3));
          // Extraer expertos sugeridos de todos los análisis
          const expertos = [];
          data.analyses.slice(0, 3).forEach(metric => {
            const arr = Array.isArray(metric.proyectoId?.analisisOpenAI?.razones)
              ? metric.proyectoId.analisisOpenAI.razones
              : (metric.proyectoId?.razones || []);
            arr.forEach(exp => {
              if (exp && !expertos.includes(exp)) expertos.push(exp);
            });
          });
          if (onExpertosSugeridos) onExpertosSugeridos(expertos);
          window.dispatchEvent(new CustomEvent('expertos-sugeridos', { detail: expertos }));
        }
      } catch (error) {
        // Manejo de error
      }
    };
    fetchMetricAnalyses();
  }, [session, onExpertosSugeridos]);

  if (!session) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Por favor inicia sesión para ver tus análisis</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-400">
        {metricAnalyses.length === 0 && (
          <div className="text-center text-gray-500">No hay análisis de métricas disponibles.</div>
        )}
        {metricAnalyses.map((metric, idx) => (
          <div key={metric._id} className="mb-2">
            <button
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 transition flex items-center justify-between ${openIndex === idx ? 'border-l-4 border-indigo-500' : ''}`}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <span>{metric.metricTitle}</span>
              <span className="text-indigo-600 font-bold text-lg">{metric.valorPorcentual}%</span>
              <svg className={`w-5 h-5 ml-2 transition-transform ${openIndex === idx ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
            {openIndex === idx && (
              <div className="p-4 bg-indigo-50 rounded-b-lg mt-1 animate-fade-in flex flex-col gap-2">
                <div>
                  <span className="font-semibold text-green-700">Conclusión:</span>
                  <span className="ml-1 text-gray-800">{metric.conclusion.impactoGeneral}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-700">Interpretación:</span>
                  <span className="ml-1 text-gray-700">{metric.interpretacion}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-1">
                  <span className="font-semibold text-green-700">Fortalezas:</span>
                  {metric.conclusion.fortalezas.map((f, i) => (
                    <Badge key={i} color="green">{f}</Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-1">
                  <span className="font-semibold text-red-700">Áreas de mejora:</span>
                  {metric.conclusion.areasMejora.map((a, i) => (
                    <Badge key={i} color="red">{a}</Badge>
                  ))}
                </div>
                <div>
                  <span className="font-semibold text-indigo-700">Recomendaciones:</span>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-1 ml-4">
                    {metric.recomendaciones.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                <div className="bg-indigo-100 rounded-xl p-3 mt-2 flex flex-col gap-1 border border-indigo-200">
                  <div className="font-semibold text-indigo-700 text-base mb-1 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                    {metric.proyectoId?.nombreProyecto || "Proyecto asociado"}
                  </div>
                  <div className="text-sm text-gray-700 mb-1">{metric.proyectoId?.descripcion || ""}</div>
                  <div className="flex flex-wrap gap-2 items-center mb-1">
                    <Badge color="blue">% Mejora estimada: {metric.proyectoId?.analisisOpenAI?.puntuacionMatch || metric.proyectoId?.puntuacionMatch || "-"}%</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-semibold text-blue-700">Expertos ideales:</span>
                    {(Array.isArray(metric.proyectoId?.analisisOpenAI?.razones) ? metric.proyectoId.analisisOpenAI.razones : (metric.proyectoId?.razones || [])).map((exp, i) => (
                      <Badge key={i} color="yellow">{exp}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 