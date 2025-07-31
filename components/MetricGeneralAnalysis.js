"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaChartLine, FaProjectDiagram, FaUsers, FaCogs, FaLightbulb, FaRocket, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const MetricGeneralAnalysis = ({ analysisData, isLoading }) => {
  const { data: session } = useSession();
  const [analysis, setAnalysis] = useState(analysisData);
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    if (!analysisData && session?.user?.id) {
      fetchGeneralAnalysis();
    }
  }, [session, analysisData]);

  const fetchGeneralAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/metric-general?userId=${session.user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.data);
      }
    } catch (error) {
      console.error('Error fetching general analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateGeneralAnalysis = async () => {
    try {
      setLoading(true);
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
        await fetchGeneralAnalysis();
      }
    } catch (error) {
      console.error('Error generating general analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3D7C]"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <FaChartLine className="text-6xl text-[#1A3D7C] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-[#1A3D7C] mb-2">Análisis General de Métricas</h3>
        <p className="text-gray-600 mb-4">Genera un análisis integral de todas tus métricas específicas</p>
        <button
          onClick={generateGeneralAnalysis}
          className="px-6 py-3 bg-[#1A3D7C] text-white rounded-md hover:bg-[#00AEEF] transition-colors"
        >
          Generar Análisis General
        </button>
      </div>
    );
  }

  const getLevelColor = (value) => {
    if (value >= 80) return 'text-green-600 bg-green-100';
    if (value >= 60) return 'text-blue-600 bg-blue-100';
    if (value >= 40) return 'text-yellow-600 bg-yellow-100';
    if (value >= 20) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getLevelText = (value) => {
    if (value >= 80) return 'Excelente';
    if (value >= 60) return 'Bueno';
    if (value >= 40) return 'Regular';
    if (value >= 20) return 'Bajo';
    return 'Crítico';
  };

  return (
    <div className="space-y-8">
      {/* Resumen Ejecutivo */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <FaChartLine className="text-2xl text-[#1A3D7C] mr-3" />
          <h2 className="text-2xl font-bold text-[#1A3D7C]">Resumen Ejecutivo</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Puntuación General</h3>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getLevelColor(analysis.analisisGeneral.puntuacionGeneral)}`}>
              {analysis.analisisGeneral.puntuacionGeneral}% - {getLevelText(analysis.analisisGeneral.puntuacionGeneral)}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Prioridades Estratégicas</h3>
            <ul className="space-y-1">
              {analysis.analisisGeneral.prioridadesEstrategicas.map((prioridad, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2 text-sm" />
                  {prioridad}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Resumen Ejecutivo</h3>
          <p className="text-gray-700 leading-relaxed">{analysis.analisisGeneral.resumenEjecutivo}</p>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Patrones Identificados</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.analisisGeneral.patronesIdentificados.map((patron, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {patron}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Conclusiones por Área */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <FaCogs className="text-2xl text-[#1A3D7C] mr-3" />
          <h2 className="text-2xl font-bold text-[#1A3D7C]">Conclusiones por Área</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(analysis.conclusionesPorArea).map(([area, conclusion]) => (
            <div key={area} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-[#1A3D7C] mb-3 capitalize">
                {area.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-700">Interpretación</h4>
                  <p className="text-sm text-gray-600">{conclusion.interpretacion}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Conclusión General</h4>
                  <p className="text-sm text-gray-600">{conclusion.conclusionGeneral}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Fortalezas</h4>
                  <ul className="text-sm text-gray-600">
                    {conclusion.fortalezas.map((fortaleza, index) => (
                      <li key={index} className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2 text-xs" />
                        {fortaleza}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Áreas de Mejora</h4>
                  <ul className="text-sm text-gray-600">
                    {conclusion.areasMejora.map((area, index) => (
                      <li key={index} className="flex items-center">
                        <FaExclamationTriangle className="text-orange-500 mr-2 text-xs" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proyectos Integrales */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <FaProjectDiagram className="text-2xl text-[#1A3D7C] mr-3" />
          <h2 className="text-2xl font-bold text-[#1A3D7C]">Proyectos Integrales</h2>
        </div>
        
        <div className="space-y-6">
          {analysis.proyectosIntegrales.map((proyecto, index) => (
            <div key={index} className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#1A3D7C] mb-2">{proyecto.nombreProyecto}</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    proyecto.prioridad === 'Alta' ? 'bg-red-100 text-red-800' :
                    proyecto.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    Prioridad: {proyecto.prioridad}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#1A3D7C]">{proyecto.estimacionMejora}%</div>
                  <div className="text-sm text-gray-600">Mejora estimada</div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{proyecto.descripcionProyecto}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Métricas Abarcadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {proyecto.metricasAbarcadas.map((metrica, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {metrica}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Áreas Involucradas</h4>
                  <div className="flex flex-wrap gap-2">
                    {proyecto.areasInvolucradas.map((area, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Expertos Requeridos</h4>
                <div className="flex flex-wrap gap-2">
                  {proyecto.expertosRequeridos.map((experto, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                      {experto}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Impacto Estratégico</h4>
                <p className="text-sm text-gray-600">{proyecto.impactoEstrategico}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expertos Recomendados */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <FaUsers className="text-2xl text-[#1A3D7C] mr-3" />
          <h2 className="text-2xl font-bold text-[#1A3D7C]">Expertos Recomendados</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {analysis.expertosRecomendados.map((experto, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-[#1A3D7C] mb-2">{experto.perfilExperto}</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-700">Especialidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {experto.especialidades.map((especialidad, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {especialidad}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Métricas que Resuelve</h4>
                  <div className="flex flex-wrap gap-2">
                    {experto.metricasQueResuelve.map((metrica, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {metrica}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Valor Agregado</h4>
                  <p className="text-sm text-gray-600">{experto.valorAgregado}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Tipo de Servicio</h4>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    {experto.tipoServicio}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Servicios Integrales */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <FaLightbulb className="text-2xl text-[#1A3D7C] mr-3" />
          <h2 className="text-2xl font-bold text-[#1A3D7C]">Servicios Integrales</h2>
        </div>
        
        <div className="space-y-6">
          {analysis.serviciosIntegrales.map((servicio, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#1A3D7C] mb-3">{servicio.nombreServicio}</h3>
              
              <p className="text-gray-700 mb-4">{servicio.descripcionServicio}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Métricas que Aborda</h4>
                  <div className="flex flex-wrap gap-2">
                    {servicio.metricasQueAborda.map((metrica, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {metrica}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Beneficios Esperados</h4>
                  <ul className="space-y-1">
                    {servicio.beneficiosEsperados.map((beneficio, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <FaCheckCircle className="text-green-500 mr-2 text-xs" />
                        {beneficio}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 flex gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Duración Estimada</h4>
                  <p className="text-sm text-gray-600">{servicio.duracionEstimada}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Inversión Estimada</h4>
                  <p className="text-sm text-gray-600">{servicio.inversionEstimada}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recomendaciones Estratégicas */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <FaRocket className="text-2xl text-[#1A3D7C] mr-3" />
          <h2 className="text-2xl font-bold text-[#1A3D7C]">Recomendaciones Estratégicas</h2>
        </div>
        
        <div className="space-y-4">
          {analysis.recomendacionesEstrategicas.map((recomendacion, index) => (
            <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-[#1A3D7C] text-white rounded-full flex items-center justify-center mr-4 mt-1">
                {index + 1}
              </div>
              <p className="text-gray-700">{recomendacion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricGeneralAnalysis; 