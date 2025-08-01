"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaBuilding, FaLightbulb, FaProjectDiagram, FaHandshake, FaUsers, FaChartLine, FaMapMarkerAlt, FaIndustry, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/icon.png";

export default function DiagnosisDetails({ params }) {
  const router = useRouter();
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expertosMatches, setExpertosMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const diagnosisId = params.id;

        if (!diagnosisId) {
          setError('Se requiere el ID del diagnóstico');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/diagnoses/${diagnosisId}`);
        const result = await response.json();

        if (result.success && result.data) {
          setDiagnosis(result.data);
          // Buscar expertos que han postulado a este proyecto
          await fetchExpertosMatches(result.data);
        } else {
          setError(result.error || 'Error al cargar el diagnóstico');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [params.id]);

  const fetchExpertosMatches = async (diagnosisData) => {
    try {
      setLoadingMatches(true);
      // Obtener el nombre de la empresa del diagnóstico
      const nombreEmpresa = getDiagnosticoInfo(diagnosisData);
      
      // Buscar matches de expertos para esta empresa
      const response = await fetch(`/api/expert-matching?empresa=${encodeURIComponent(nombreEmpresa)}&limit=50`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setExpertosMatches(result.data);
      }
    } catch (error) {
      console.error('Error al cargar expertos matches:', error);
    } finally {
      setLoadingMatches(false);
    }
  };

  const getDiagnosticoInfo = (diagnosis) => {
    const situacionActual = diagnosis["1. Situacion actual de la empresa y objetivos"] || 
                           diagnosis["1. Situación actual de la empresa y objetivos"];
    
    if (!situacionActual) return "Sin nombre de empresa";

    const diagnosticoGeneral = situacionActual["Diagnostico general"] || 
                              situacionActual["Diagnóstico general"] ||
                              situacionActual["Diagnóstico general de necesidades y retos principales"];

    if (!diagnosticoGeneral) return "Sin nombre de empresa";
    const texto = Array.isArray(diagnosticoGeneral) ? diagnosticoGeneral[0] : diagnosticoGeneral;
    if (!texto) return "Sin nombre de empresa";
    const match = texto.match(/La empresa ['"]([^'"]+)['"]/);
    return match ? match[1] : "Sin nombre de empresa";
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.map(item => {
        let formatted = item.replace(/^["']|["']$/g, '');
        formatted = formatted.replace(/^\d+\s*$/, '');
        formatted = formatted.replace(/^\d+\s*/, '');
        return formatted;
      }).filter(item => item.trim() !== '').join(', ');
    }
    if (typeof value === 'string') {
      let formatted = value.replace(/^["']|["']$/g, '');
      formatted = formatted.replace(/^\d+\s*$/, '');
      formatted = formatted.replace(/^\d+\s*/, '');
      return formatted;
    }
    return value;
  };

  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([key, val]) => {
            const formattedKey = key
              .replace(/^["']|["']$/g, '')
              .replace(/^\d+:\s*/, '')
              .replace(/^\d+\s*$/, '');
            const formattedVal = formatValue(val);
            if (formattedVal.trim() === '') return null;
            return (
              <div key={key} className="pl-4 border-l-2 border-blue-200">
                <p className="font-medium text-gray-700">{formattedKey}</p>
                <p className="text-gray-600">{formattedVal}</p>
              </div>
            );
          })}
        </div>
      );
    }
    const formattedValue = formatValue(value);
    if (formattedValue.trim() === '') return null;
    return <p className="text-gray-600">{formattedValue}</p>;
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "aceptado":
        return "bg-green-100 text-green-800 border-green-200";
      case "rechazado":
        return "bg-red-100 text-red-800 border-red-200";
      case "contactado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "aceptado":
        return "Aceptado";
      case "rechazado":
        return "Rechazado";
      case "contactado":
        return "Contactado";
      default:
        return "Desconocido";
    }
  };

  const getTamañoEmpresa = (diagnosis) => {
    // Intentar obtener el tamaño del análisis de ChatGPT primero
    const tamañoAnalisis = diagnosis["1. Situacion actual de la empresa y objetivos"]?.Tamaño;
    if (tamañoAnalisis) {
      return tamañoAnalisis;
    }
    
    // Si no está en el análisis, calcular basado en empleados
    const numeroEmpleados = diagnosis.prediagnostico?.numeroEmpleados;
    const tieneEmpleados = diagnosis.prediagnostico?.tieneEmpleados;
    
    if (!tieneEmpleados || tieneEmpleados === 'no') {
      return "Emprendedor";
    }
    
    if (!numeroEmpleados) {
      return "No especificado";
    }
    
    if (numeroEmpleados <= 10) {
      return "Micro empresa";
    } else if (numeroEmpleados <= 50) {
      return "Pequeña empresa";
    } else if (numeroEmpleados <= 250) {
      return "Mediana empresa";
    } else {
      return "Gran empresa";
    }
  };

  const formatVentasAnuales = (diagnosis) => {
    // Intentar obtener las ventas del análisis de ChatGPT primero
    const ventasAnalisis = diagnosis["1. Situacion actual de la empresa y objetivos"]?.Ventas;
    if (ventasAnalisis) {
      return ventasAnalisis;
    }
    
    // Si no está en el análisis, formatear basado en datos del pre-diagnóstico
    const ventas = diagnosis.prediagnostico?.ventasAnualesEstimadas;
    
    if (!ventas) {
      return "No especificadas";
    }
    
    if (ventas >= 1000000) {
      return `$${(ventas / 1000000).toFixed(1)}M anuales`;
    } else if (ventas >= 1000) {
      return `$${(ventas / 1000).toFixed(0)}K anuales`;
    } else {
      return `$${ventas.toLocaleString()} anuales`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-red-800 font-semibold text-xl mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/dashboard" className="inline-flex items-center text-red-800 hover:text-red-900 transition-colors">
              <FaArrowLeft className="mr-2" />
              Volver al dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-yellow-800 font-semibold text-xl mb-2">No se encontró el diagnóstico</h2>
            <Link href="/dashboard" className="inline-flex items-center text-yellow-800 hover:text-yellow-900 transition-colors">
              <FaArrowLeft className="mr-2" />
              Volver al dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nombreEmpresa = getDiagnosticoInfo(diagnosis);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Volver al dashboard
          </Link>
          <div className="flex items-center">
            <Image
              src={logo}
              alt="Logo"
              width={300}
              height={300}
              className="w-[200px] md:w-[300px]"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Detalles del Diagnóstico</h1>

          {/* 1. Información de la empresa */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaBuilding className="text-blue-500 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-800">Información de la Empresa</h2>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FaBuilding className="text-blue-600" />
                    <span className="font-semibold text-gray-800">Nombre:</span>
                    <span className="text-gray-700">{nombreEmpresa}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaIndustry className="text-blue-600" />
                    <span className="font-semibold text-gray-800">Industria:</span>
                    <span className="text-gray-700">
                      {diagnosis["3. Categorias de proyecto"]?.Industry?.[0] || 
                       diagnosis["3. Categorias de proyecto"]?.Industria?.[0] || 
                       "No especificada"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span className="font-semibold text-gray-800">Ubicación:</span>
                    <span className="text-gray-700">México</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FaUsers className="text-blue-600" />
                    <span className="font-semibold text-gray-800">Tamaño:</span>
                    <span className="text-gray-700">{getTamañoEmpresa(diagnosis)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaDollarSign className="text-blue-600" />
                    <span className="font-semibold text-gray-800">Ventas:</span>
                    <span className="text-gray-700">{formatVentasAnuales(diagnosis)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Categorías de proyecto */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaProjectDiagram className="text-green-500 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-800">Información del Proyecto</h2>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 gap-6">
                {/* Industria */}
                <div className="border-b border-green-200 pb-4">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg flex items-center">
                    <FaIndustry className="text-green-600 mr-2" />
                    Industria
                  </h3>
                  <p className="text-gray-700">
                    {diagnosis["3. Categorias de proyecto"]?.Industry?.[0] || 
                     diagnosis["3. Categorias de proyecto"]?.Industria?.[0] || 
                     "No especificada"}
                  </p>
                </div>

                {/* Nombre del proyecto */}
                <div className="border-b border-green-200 pb-4">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg flex items-center">
                    <FaBuilding className="text-green-600 mr-2" />
                    Nombre del Proyecto
                  </h3>
                  <p className="text-gray-700">{nombreEmpresa}</p>
                </div>

                {/* Categorías del proyecto */}
                <div className="border-b border-green-200 pb-4">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg flex items-center">
                    <FaProjectDiagram className="text-green-600 mr-2" />
                    Categorías del Proyecto
                  </h3>
                  <div className="text-gray-700">
                    {diagnosis["3. Categorias de proyecto"]?.["Categorias de servicio buscado"]?.map((categoria, index) => (
                      <div key={index} className="mb-1">• {categoria}</div>
                    )) || "No especificadas"}
                  </div>
                </div>

                {/* Descripción del proyecto */}
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-700 mb-1 text-sm">Descripción del Proyecto</h4>
                  <p className="text-gray-700 text-sm">
                    {diagnosis.descripcionProyecto || diagnosis.prediagnostico?.descripcionActividad || "No especificada"}
                  </p>
                </div>

                {/* Servicios */}
                <div className="border-b border-green-200 pb-4">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg flex items-center">
                    <FaHandshake className="text-green-600 mr-2" />
                    Servicios
                  </h3>
                  <div className="text-gray-700">
                    {diagnosis["3. Categorias de proyecto"]?.["Categorias de servicio buscado"]?.map((servicio, index) => (
                      <div key={index} className="mb-1">• {servicio}</div>
                    )) || "No especificados"}
                  </div>
                </div>

                {/* Objetivos (Categorizados) */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg flex items-center">
                    <FaLightbulb className="text-green-600 mr-2" />
                    Objetivos (Categorizados)
                  </h3>
                  <div className="text-gray-700">
                    {diagnosis["3. Categorias de proyecto"]?.["Objetivos de la empresa"]?.map((objetivo, index) => (
                      <div key={index} className="mb-2 p-3 bg-white rounded border-l-4 border-green-400">
                        {objetivo}
                      </div>
                    )) || "No se han especificado objetivos claros"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Objetivos de proyecto (Categorías estandarizadas) */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaChartLine className="text-purple-500 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-800">Objetivos de Proyecto</h2>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Áreas de Enfoque:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Gestión Financiera</li>
                    <li>• Eficiencia Operativa</li>
                    <li>• Talento Humano</li>
                    <li>• Ventas y Marketing</li>
                    <li>• Innovación</li>
                    <li>• Digitalización</li>
                    <li>• Experiencia del Cliente</li>
                    <li>• Gestión de Riesgos</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Servicios Buscados:</h3>
                  <div className="text-gray-700">
                    {diagnosis["3. Categorias de proyecto"]?.["Categorias de servicio buscado"]?.map((servicio, index) => (
                      <div key={index} className="mb-1">• {servicio}</div>
                    )) || "No especificados"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Situación actual */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaBuilding className="text-orange-500 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-800">Situación Actual</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {diagnosis['1. Situacion actual de la empresa y objetivos'] && 
                Object.entries(diagnosis['1. Situacion actual de la empresa y objetivos'])
                  .filter(([key]) => !['Tamaño', 'Ventas', 'Antigüedad'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="font-medium text-gray-800 mb-3 text-lg">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </h3>
                      {renderValue(value)}
                    </div>
                  ))}
            </div>
          </section>

          {/* 5. Objetivos (Objetivos basados en el diagnóstico) */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaChartLine className="text-indigo-500 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-800">Objetivos</h2>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Objetivos Identificados:</h3>
                  <div className="text-gray-700">
                    {diagnosis["3. Categorias de proyecto"]?.["Objetivos de la empresa"]?.map((objetivo, index) => (
                      <div key={index} className="mb-2 p-3 bg-white rounded border-l-4 border-indigo-400">
                        {objetivo}
                      </div>
                    )) || "No se han especificado objetivos claros"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Propuestas de solución */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaLightbulb className="text-yellow-500 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-800">Propuestas de Solución</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {diagnosis['2. Posibles soluciones']?.map((solucion, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-gray-800 mb-3 text-lg">Solución {index + 1}</h3>
                  {renderValue(solucion)}
                </div>
              ))}
            </div>
          </section>

          {/* 7. Posibles matches: Expertos que han postulado */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaHandshake className="text-purple-500 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-800">Expertos que han Postulado</h2>
            </div>
            
            {loadingMatches ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando expertos...</p>
              </div>
            ) : expertosMatches.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <FaUsers className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay expertos postulados aún</h3>
                <p className="text-gray-600">Los expertos que postulen a tu proyecto aparecerán aquí</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {expertosMatches.map((match, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg mb-2">
                          Experto {index + 1}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(match.estado)}`}>
                            {getEstadoTexto(match.estado)}
                          </span>
                          <span className="flex items-center space-x-1">
                            <FaChartLine />
                            <span>Match: {match.puntuacionMatch}%</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Información del Experto:</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><strong>Semblanza:</strong> {match.semblanza}</p>
                          <p><strong>Industrias:</strong> {match.industriasExperto?.join(', ')}</p>
                          <p><strong>Categorías:</strong> {match.categoriasExperto}</p>
                          <p><strong>Experiencia:</strong> {match.gradoExperiencia}</p>
                          <p><strong>Servicios:</strong> {match.serviciosPropuestos}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Análisis del Match:</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><strong>Industria mejor alineada:</strong> {match.industriaMejor}</p>
                          <p><strong>Análisis:</strong> {match.match}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                          Aceptar
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                          Rechazar
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Contactar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
} 