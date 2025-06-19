"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaChartLine, FaBuilding, FaUsers, FaShoppingCart, FaLightbulb, FaUserFriends, FaShieldAlt } from 'react-icons/fa';

const MetricCard = ({ title, value, icon: Icon, color, onClick }) => {
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
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
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
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900">{value}%</span>
      </div>
    </div>
  );
};

const MetricsCards = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasDiagnosticoCentral, setHasDiagnosticoCentral] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!session?.user?.id) {
        setError('No se encontró el ID del usuario');
        setLoading(false);
        return;
      }

      try {
        // Primero verificar si tiene diagnóstico central
        const responseCentral = await fetch(`/api/diagnostico-central?userId=${session.user.id}`);
        if (responseCentral.ok) {
          const dataCentral = await responseCentral.json();
          const hasCentral = dataCentral && Object.keys(dataCentral).length > 0;
          setHasDiagnosticoCentral(hasCentral);
          
          
          // Si tiene diagnóstico central, verificar si fue creado recientemente
          if (hasCentral && dataCentral.createdAt) {
            const createdAt = new Date(dataCentral.createdAt);
            const now = new Date();
            const timeDiff = now - createdAt;
            const minutesDiff = timeDiff / (1000 * 60);
            
            // Si el diagnóstico fue creado en los últimos 10 minutos, mostrar análisis en progreso
            if (minutesDiff < 10) {
              setIsAnalyzing(true);
            }
          }
        }

        // Luego buscar el análisis
        const response = await fetch(`/api/analysis_results?userId=${session.user.id}`);
        console.log('Response URL:', `/api/analysis_results?userId=${session.user.id}`);
        const result = await response.json();
        console.log('API Response:', result);

        if (result.success && result.data) {
          console.log('metricasPorcentuales:', JSON.stringify(result.data.metricasPorcentuales, null, 2));
          setAnalysis(result.data);
          setIsAnalyzing(false); // Si hay análisis, no está analizando
        } else if (result.success && !result.data) {
          // No hay análisis disponible aún
          
          setAnalysis(null);
          // Si tiene diagnóstico central pero no análisis, está analizando
          if (hasDiagnosticoCentral) {
            setIsAnalyzing(true);
          }
        } else {
          setError(result.error || 'Error al cargar el análisis');
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [session]);

  const handleViewDetails = (metricKey) => {
    router.push(`/metric-details/${metricKey}?userId=${session.user.id}`);
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.key}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          color={metric.color}
          onClick={() => handleViewDetails(metric.key)}
        />
      ))}
    </div>
  );
};

export default MetricsCards; 