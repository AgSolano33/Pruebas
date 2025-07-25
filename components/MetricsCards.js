"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaChartLine, FaBuilding, FaUsers, FaShoppingCart, FaLightbulb, FaUserFriends, FaShieldAlt } from 'react-icons/fa';

const MetricCard = ({ title, value, icon: Icon, color, onClick, onAnalyze, analyzing }) => {
  const getLevelColor = (value) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    if (value >= 40) return 'text-yellow-600';
    if (value >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const getLevelText = (value) => {
    if (value >= 80) return 'Excelente';
    if (value >= 60) return 'Bueno';
    if (value >= 40) return 'Regular';
    if (value >= 20) return 'Bajo';
    return 'Crítico';
  };

  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
        <span className={`text-sm font-medium ${getLevelColor(value)}`}>
          {getLevelText(value)}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="flex items-baseline mb-4">
        <span className="text-3xl font-bold text-gray-900">{value}%</span>
      </div>
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full"
        onClick={e => { e.stopPropagation(); onAnalyze && onAnalyze(); }}
        disabled={analyzing}
      >
        {analyzing ? 'Analizando...' : 'Analizar métrica'}
      </button>
    </div>
  );
};

const MetricsCards = ({ analysisData, isLoading }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [analyzingMetric, setAnalyzingMetric] = useState(null);
  const [successMetric, setSuccessMetric] = useState(null);
  const [errorMetric, setErrorMetric] = useState(null);

  // Usar los datos pasados como props
  const analysis = analysisData;
  const loading = isLoading;
  const error = null;
  const hasDiagnosticoCentral = !!analysisData;
  const isAnalyzing = false; // Ya no necesitamos este estado aquí

  const handleViewDetails = (metricKey) => {
    router.push(`/metric-details/${metricKey}?userId=${session.user.id}`);
  };

  const handleAnalyzeMetric = async (metric) => {
    setAnalyzingMetric(metric.key);
    setSuccessMetric(null);
    setErrorMetric(null);
    try {
      const res = await fetch(`/api/metric-analysis/${metric.key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          metricTitle: metric.title,
          valorPorcentual: metric.value,
          empresa: {
            nombre: analysis.empresa?.nombre,
            sector: analysis.empresa?.sector,
            ubicacion: analysis.empresa?.ubicacion
          },
          datosMetrica: analysis.analisisMetricas[metric.key] || {}
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMetric(metric.key);
      } else {
        setErrorMetric(data.error || 'Error al analizar la métrica');
      }
    } catch (err) {
      setErrorMetric('Error al analizar la métrica');
    } finally {
      setAnalyzingMetric(null);
    }
  };

  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3D7C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-gray-500 p-4">
        <span className="text-[#1A3D7C] font-semibold">Te invitamos a completar tu información haciendo el diagnóstico central.</span>
      </div>
    );
  }

  if (isAnalyzing) {
    console.log('Mostrando mensaje de análisis en progreso');
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3D7C] mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-[#1A3D7C] mb-2">Análisis en Progreso</h3>
        <p className="text-gray-600">Estamos haciendo el análisis de su empresa. Esto puede tomar unos minutos.</p>
        <p className="text-sm text-gray-500 mt-2 mb-4">Por favor, recargue la página en unos momentos para ver los resultados.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#1A3D7C] text-white rounded-md hover:bg-[#00AEEF] transition-colors"
        >
          Recargar Página
        </button>
      </div>
    );
  }

  if (!analysis && hasDiagnosticoCentral) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3D7C] mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-[#1A3D7C] mb-2">Análisis en Progreso</h3>
        <p className="text-gray-600">Estamos haciendo el análisis de su empresa. Esto puede tomar unos minutos.</p>
        <p className="text-sm text-gray-500 mt-2 mb-4">Por favor, recargue la página en unos momentos para ver los resultados.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#1A3D7C] text-white rounded-md hover:bg-[#00AEEF] transition-colors"
        >
          Recargar Página
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center text-gray-500 p-4">
        <span className="text-[#1A3D7C] font-semibold">Te invitamos a completar tu información haciendo el diagnóstico central.</span>
      </div>
    );
  }

  const metrics = [
    {
      key: 'madurezDigital',
      title: 'Madurez Digital',
      icon: FaChartLine,
      color: 'bg-blue-500',
      value: analysis.metricasPorcentuales.madurezDigital
    },
    {
      key: 'saludFinanciera',
      title: 'Salud Financiera',
      icon: FaBuilding,
      color: 'bg-green-500',
      value: analysis.metricasPorcentuales.saludFinanciera
    },
    {
      key: 'eficienciaOperativa',
      title: 'Eficiencia Operativa',
      icon: FaUsers,
      color: 'bg-purple-500',
      value: analysis.metricasPorcentuales.eficienciaOperativa
    },
    {
      key: 'recursosHumanos',
      title: 'Recursos Humanos',
      icon: FaUserFriends,
      color: 'bg-yellow-500',
      value: analysis.metricasPorcentuales.recursosHumanos
    },
    {
      key: 'marketingVentas',
      title: 'Marketing y Ventas',
      icon: FaShoppingCart,
      color: 'bg-red-500',
      value: analysis.metricasPorcentuales.marketingVentas
    },
    {
      key: 'innovacionDesarrollo',
      title: 'Innovación y Desarrollo',
      icon: FaLightbulb,
      color: 'bg-indigo-500',
      value: analysis.metricasPorcentuales.innovacionDesarrollo
    },
    {
      key: 'experienciaCliente',
      title: 'Experiencia del Cliente',
      icon: FaUsers,
      color: 'bg-pink-500',
      value: analysis.metricasPorcentuales.experienciaCliente
    },
    {
      key: 'gestionRiesgos',
      title: 'Gestión de Riesgos',
      icon: FaShieldAlt,
      color: 'bg-gray-500',
      value: analysis.metricasPorcentuales.gestionRiesgos
    }
  ];

  return (
    <>
      {successMetric && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
          ¡Análisis de la métrica realizado y proyecto creado!
        </div>
      )}
      {errorMetric && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
          {errorMetric}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.key}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            color={metric.color}
            onClick={() => handleViewDetails(metric.key)}
            onAnalyze={() => handleAnalyzeMetric(metric)}
            analyzing={analyzingMetric === metric.key}
          />
        ))}
      </div>
    </>
  );
};

export default MetricsCards; 