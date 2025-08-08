"use client";

import { useState, useEffect } from "react";
import PrediagnosticoList from "@/components/PrediagnosticoList";
import DiagnosticoInfo from "@/components/DiagnosticoInfo";
import DiagnosticoCentral from "@/components/DiagnosticoCentral";
import Conclusions from "@/components/Conclusions";
import MetricsCards from "@/components/MetricsCards";
import ProyectosTablero from "@/components/ProyectosTablero";
import ExpertosAplicaciones from "@/components/ExpertosAplicaciones";
import ProviderProfile from "@/components/ProviderProfile";
import ProviderServices from "@/components/ProviderServices";
import ProviderProjects from "@/components/ProviderProjects";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Modal from "@/components/Modal";
import FormDiagnostico from "@/components/FormDiagnostico";
import { FaChartBar, FaRocket, FaUsers, FaClipboardList, FaChartLine } from "react-icons/fa";
import Perfil from "@/components/Perfil";
import MetricGeneralAnalysis from "@/components/MetricGeneralAnalysis";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [companyName, setCompanyName] = useState("Nombre de la Empresa");
  const [hasDiagnosticoCentral, setHasDiagnosticoCentral] = useState(false);
  const [hasPrediagnosticos, setHasPrediagnosticos] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isExisting, setIsExisting] = useState(false);
  const [showDiagnosticoCentral, setShowDiagnosticoCentral] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [providerHasProfile, setProviderHasProfile] = useState(false);
  const [isLoadingProviderProfile, setIsLoadingProviderProfile] = useState(true);
  const [expertosSugeridos, setExpertosSugeridos] = useState([]);
  const [expertosAnalisisGeneral, setExpertosAnalisisGeneral] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [metricAnalyses, setMetricAnalyses] = useState([]);
  const [showAnalisisGeneral, setShowAnalisisGeneral] = useState(false);
  const [generalAnalysisData, setGeneralAnalysisData] = useState(null);
  
  // Estado para las pestañas
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Obtener la pestaña activa de los parámetros de URL
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const checkData = async () => {
      if (!session?.user?.id) return;

      // Verificar si el usuario tiene userType establecido
      // if (!session.user.userType) {
      //   // Redirigir al selector de tipo de usuario
      //   router.push("/user-type-selector");
      //   return;
      // }

      setUserType(session.user.userType);

      // Si es proveedor, verificar si tiene perfil
      if (session.user.userType === "provider") {
        try {
          const response = await fetch("/api/expertos?checkProfile=true");
          if (response.ok) {
            const data = await response.json();
            setProviderHasProfile(data.hasProfile);
          }
        } catch (error) {
          console.error("Error checking provider profile:", error);
        } finally {
          setIsLoadingProviderProfile(false);
        }
        return;
      }

      // Si es cliente, continuar con el flujo normal
      let userHasDiagnosticoCentral = false;
      let userHasPrediagnosticos = false;

      try {
        setIsLoading(true);
        
        // Verificar Diagnóstico Central
        const responseCentral = await fetch(`/api/diagnostico-central?userId=${session.user.id}`);
        
        if (responseCentral.ok) {
          const dataCentral = await responseCentral.json();
          userHasDiagnosticoCentral = dataCentral && Object.keys(dataCentral).length > 0;
          
          if (dataCentral && Object.keys(dataCentral).length > 0) {
            setDiagnosisData(dataCentral);
            setCompanyName(dataCentral.informacionEmpresa?.nombreEmpresa || "Nombre de la Empresa");
          }
        }

        // Verificar Prediagnósticos
        const responsePrediagnosticos = await fetch(`/api/prediagnostico?userId=${session.user.id}`);
        if (responsePrediagnosticos.ok) {
          const dataPrediagnosticos = await responsePrediagnosticos.json();
          userHasPrediagnosticos = dataPrediagnosticos && dataPrediagnosticos.length > 0;
        }

        // Cargar análisis si tiene diagnóstico central
        if (userHasDiagnosticoCentral) {
          try {
            const responseAnalysis = await fetch(`/api/analysis_results?userId=${session.user.id}`);
            
            if (responseAnalysis.ok) {
              const analysisResult = await responseAnalysis.json();
              
              if (analysisResult.success && analysisResult.data) {
                setAnalysisData(analysisResult.data);
              }
            }
          } catch (error) {
            console.error('Error loading analysis:', error);
          }

          // Cargar análisis de métricas
          try {
            const responseMetricAnalyses = await fetch(`/api/metric-analysis/user/${session.user.id}`);
            if (responseMetricAnalyses.ok) {
              const metricData = await responseMetricAnalyses.json();
              if (metricData.success && Array.isArray(metricData.analyses)) {
                setMetricAnalyses(metricData.analyses.slice(0, 3));
                
                // Extraer expertos sugeridos
                const expertos = [];
                metricData.analyses.slice(0, 3).forEach(metric => {
                  const arr = Array.isArray(metric.proyectoId?.analisisOpenAI?.razones)
                    ? metric.proyectoId.analisisOpenAI.razones
                    : (metric.proyectoId?.razones || []);
                  arr.forEach(exp => {
                    if (exp && !expertos.includes(exp)) expertos.push(exp);
                  });
                });
                setExpertosSugeridos(expertos);
              }
            }
          } catch (error) {
            console.error('Error loading metric analyses:', error);
          }

          // Cargar expertos del análisis general
          try {
            const responseGeneralAnalysis = await fetch(`/api/metric-general?userId=${session.user.id}`);
            if (responseGeneralAnalysis.ok) {
              const generalData = await responseGeneralAnalysis.json();
              if (generalData.success && generalData.data) {
                setGeneralAnalysisData(generalData.data);
                if (generalData.data?.expertosRecomendados) {
                  const expertosGeneral = generalData.data.expertosRecomendados.map(experto => experto.perfilExperto);
                  setExpertosAnalisisGeneral(expertosGeneral);
                }
              }
            }
          } catch (error) {
            console.error('Error loading general analysis experts:', error);
          }
        }

        // Pequeño delay para asegurar que el loading se muestre
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error('Error in checkData:', error);
              } finally {
          setHasDiagnosticoCentral(userHasDiagnosticoCentral);
          setHasPrediagnosticos(userHasPrediagnosticos);
          setIsLoading(false);

          // Abrir modal de pre-diagnóstico si no tiene Prediagnósticos
          if (!userHasPrediagnosticos) {
            setIsModalOpen(true);
          }
        }
    };

    if (status === "authenticated") {
      checkData();
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (showDiagnosticoCentral) {
    return <DiagnosticoCentral />;
  }



  const generateAnalysis = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Mostrar mensaje de carga
      const button = event.target;
      const originalText = button.innerHTML;
      button.innerHTML = '⏳ Generando...';
      button.disabled = true;
      
      const response = await fetch(`/api/debug/generate-analysis?userId=${session.user.id}`, {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (result.success) {
        button.innerHTML = '✅ ¡Completado!';
        button.className = 'px-6 py-3 bg-green-600 text-white rounded-md font-semibold';
        
        // Esperar un momento y luego recargar
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        button.innerHTML = originalText;
        button.disabled = false;
        alert('Error al generar análisis: ' + result.error);
      }
    } catch (error) {
      const button = event.target;
      button.innerHTML = '❌ Error';
      button.disabled = false;
      setTimeout(() => {
        button.innerHTML = '🔄 Generar Análisis';
        button.disabled = false;
      }, 3000);
      alert('Error al generar análisis: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      // Error handling without console.log
    }
  };

  const analyzeMetrics = async (data) => {
    if (!data) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ diagnosisData: data }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setMetrics(responseData.metrics || {});
        setIsExisting(responseData.existingDiagnosis);
      }
    } catch (error) {
      // Error handling without console.log
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`);
  };

  const MetricCard = ({ title, value }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h4 className="text-lg font-semibold text-gray-600 mb-2">{title}</h4>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
              {value}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
          <div
            style={{ width: `${value}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
          ></div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "overview", name: "Resumen", icon: FaChartBar },
    { id: "proyectos", name: "Proyectos", icon: FaRocket },
    { id: "diagnosticos", name: "Diagnósticos", icon: FaClipboardList },
    { id: "configuracion", name: "Perfil", icon: FaUsers },
  ];

  const providerTabs = [
    { id: "overview", name: "Resumen", icon: FaChartBar },
    { id: "profile", name: "Mi Perfil", icon: FaUsers },
    { id: "services", name: "Mis Servicios", icon: FaClipboardList },
    { id: "projects", name: "Proyectos Disponibles", icon: FaRocket },
  ];

  // Si es proveedor y está cargando, mostrar loading
  if (userType === "provider" && isLoadingProviderProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  // Si es proveedor, mostrar dashboard de proveedor
  if (userType === "provider") {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-screen-2xl mx-auto p-8">
          {/* Header del Proveedor */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Proveedor</h1>
            <h2 className="text-xl text-gray-600 mt-2">Tu Perfil Profesional</h2>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
              <span>🏠</span>
              <span>Proveedor</span>
            </div>
          </div>

          {/* Tabs de Proveedor */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {providerTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="text-lg" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenido del Dashboard de Proveedor */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Bienvenido a tu Dashboard</h2>
                
                {!providerHasProfile ? (
                  <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">👤</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Completa tu Perfil Profesional</h3>
                      <p className="text-gray-600">
                        Para comenzar a recibir propuestas de clientes, necesitas completar tu perfil profesional.
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">¿Qué incluye tu perfil?</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          Información personal y profesional
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          Especialidades y categorías de servicio
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          Experiencia y habilidades
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          Servicios que ofreces
                        </li>
                      </ul>
                    </div>
                    
                    <div className="text-center">
                      <button
                        onClick={() => setActiveTab("profile")}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Completar Mi Perfil
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen de tu Actividad</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">0</div>
                        <div className="text-gray-600">Propuestas Recibidas</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <div className="text-gray-600">Proyectos Compatibles</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">0</div>
                        <div className="text-gray-600">Proyectos Completados</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Mi Perfil Profesional</h3>
              {/* Aquí iría el componente ProviderProfile */}
              <ProviderProfile />
            </div>
          )}

          {activeTab === "services" && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <ProviderServices />
            </div>
          )}

          {activeTab === "projects" && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <ProviderProjects />
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 pb-24">
      <div className="max-w-screen-2xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <h2 className="text-xl text-gray-600">{companyName}</h2>
          </div>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-10 w-40 rounded-md"></div>
            ) : !hasDiagnosticoCentral && (
              <button
                onClick={() => setShowDiagnosticoCentral(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Diagnóstico Central
              </button>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 ">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex flex-col items-center gap-1 md:flex-row md:gap-2 ${
                    activeTab === tab.id
                      ? "border-[#1A3D7C] text-[#1A3D7C]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="hidden md:inline">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <>
            {isLoading ? (
              <div className="space-y-8">
                {/* Loading para Proyecto Métrica */}
                <section>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center min-h-[400px]">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3D7C]"></div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center min-h-[400px]">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3D7C]"></div>
                    </div>
                  </div>
                </section>

                {/* Loading para Métricas Principales */}
                <section>
                  <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                          <div className="h-8 bg-gray-200 rounded mb-4"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Loading para Diagnóstico General */}
                <section>
                  <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                          <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Loading para Conclusiones */}
                <section>
                  <div className="w-full">
                    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <>
                {/* Information Section */}
                <section>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                      <DiagnosticoInfo 
                        onExpertosSugeridos={setExpertosSugeridos} 
                        metricAnalyses={metricAnalyses}
                        isLoading={false}
                      />
                    </div>
                    <div>
                      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4 border-t-4 border-yellow-400 min-h-[400px]">
                        <h3 className="text-xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
                          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M15 10a4 4 0 11-8 0 4 4 0 018 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm-14 0a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                          Expertos Recomendados
                        </h3>
                        {expertosAnalisisGeneral.length === 0 ? (
                          <div className="text-gray-500 text-center">
                            {expertosSugeridos.length === 0 ? (
                              "Los expertos sugeridos aparecerán aquí según el análisis de tus métricas."
                            ) : (
                              <div>
                                <p className="mb-2">Expertos de métricas específicas:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                  {expertosSugeridos.map((exp, i) => (
                                    <span key={i} className="inline-block px-3 py-2 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-sm shadow-sm border border-yellow-200">
                                      {exp}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-600 mb-3 text-center">Expertos recomendados del análisis general:</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {expertosAnalisisGeneral.map((exp, i) => (
                                <span key={i} className="inline-block px-3 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-sm shadow-sm border border-green-200">
                                  {exp}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                        {/* Diagnóstico Central Section - Solo mostrar si no tiene análisis */}
        {!analysisData && (
          <section className="mb-6">
            {hasDiagnosticoCentral ? (
              // Si tiene diagnóstico central pero no análisis
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      ✅ Diagnóstico Central Completado
                    </h3>
                    <p className="text-blue-700 mb-4">
                      Has completado tu diagnóstico central. Ahora necesitamos generar el análisis para mostrar tus métricas.
                    </p>
                  </div>
                  <button
                    onClick={generateAnalysis}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                  >
                    🔄 Generar Análisis
                  </button>
                </div>
              </div>
            ) : (
              // Si no tiene diagnóstico central
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">
                      📋 Diagnóstico Central Pendiente
                    </h3>
                    <p className="text-orange-700 mb-4">
                      Para ver tus métricas y análisis, necesitas completar el diagnóstico central de tu empresa.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDiagnosticoCentral(true)}
                    className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-semibold"
                  >
                    🚀 Comenzar Diagnóstico
                  </button>
                </div>
              </div>
            )}
          </section>
        )}



        {/* Metrics Cards Section - Solo mostrar si hay análisis */}
        {analysisData && (
          <section>
            <div className="w-full">
              <MetricsCards 
                analysisData={analysisData}
                isLoading={false}
              />
            </div>
          </section>
        )}

                {/* Financial Metrics Section - Solo mostrar si hay análisis */}
                {analysisData && (
                  <section>
                    <div className="w-full">
                      <div className="space-y-4">
                        {isExisting && (
                          <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                            Métricas del diagnóstico existente
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(metrics).map(([category, value]) => (
                            <MetricCard
                              key={category}
                              title={category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                              value={value}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Análisis General Section - Solo mostrar si hay análisis */}
                {analysisData && generalAnalysisData && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-[#1A3D7C]">Análisis General de Métricas</h2>
                      <button
                        onClick={() => setShowAnalisisGeneral(!showAnalisisGeneral)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1A3D7C] text-white rounded-md hover:bg-[#00AEEF] transition-colors"
                      >
                        <FaChartLine className="text-sm" />
                        {showAnalisisGeneral ? 'Ocultar Detalles' : 'Ver Detalles'}
                        <svg 
                          className={`w-4 h-4 transition-transform ${showAnalisisGeneral ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    
                    {showAnalisisGeneral ? (
                      <div className="w-full">
                        <MetricGeneralAnalysis 
                          analysisData={generalAnalysisData}
                          isLoading={false}
                        />
                      </div>
                    ) : (
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Puntuación General</h3>
                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${
                              generalAnalysisData.analisisGeneral.puntuacionGeneral >= 80 ? 'text-green-600 bg-green-100' :
                              generalAnalysisData.analisisGeneral.puntuacionGeneral >= 60 ? 'text-blue-600 bg-blue-100' :
                              generalAnalysisData.analisisGeneral.puntuacionGeneral >= 40 ? 'text-yellow-600 bg-yellow-100' :
                              generalAnalysisData.analisisGeneral.puntuacionGeneral >= 20 ? 'text-orange-600 bg-orange-100' :
                              'text-red-600 bg-red-100'
                            }`}>
                              {generalAnalysisData.analisisGeneral.puntuacionGeneral}% - {
                                generalAnalysisData.analisisGeneral.puntuacionGeneral >= 80 ? 'Excelente' :
                                generalAnalysisData.analisisGeneral.puntuacionGeneral >= 60 ? 'Bueno' :
                                generalAnalysisData.analisisGeneral.puntuacionGeneral >= 40 ? 'Regular' :
                                generalAnalysisData.analisisGeneral.puntuacionGeneral >= 20 ? 'Bajo' :
                                'Crítico'
                              }
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Prioridades Estratégicas</h3>
                            <ul className="space-y-1">
                              {generalAnalysisData.analisisGeneral.prioridadesEstrategicas.slice(0, 3).map((prioridad, index) => (
                                <li key={index} className="flex items-center text-gray-700">
                                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  {prioridad}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">Resumen Ejecutivo</h3>
                          <p className="text-gray-700 leading-relaxed">{generalAnalysisData.analisisGeneral.resumenEjecutivo}</p>
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* Conclusions Section */}
                <section>
                  <div className="w-full">
                    <Conclusions />
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {activeTab === "proyectos" && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Proyectos Publicados</h2>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    if (confirm("¿Estás seguro de que quieres eliminar TODOS los proyectos? Esta acción no se puede deshacer.")) {
                      try {
                        const response = await fetch("/api/clean-projects", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                          alert(`¡Proyectos eliminados! Se eliminaron ${result.data.eliminados} proyectos exitosamente.`);
                          window.location.reload();
                        } else {
                          alert("Error al eliminar proyectos: " + result.error);
                        }
                      } catch (error) {
                        console.error("Error:", error);
                        alert("Error al limpiar proyectos");
                      }
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Eliminar Proyectos
                </button>
              </div>
            </div>
            <div className="w-full">
              <ProyectosTablero />
            </div>
          </section>
        )}

        {activeTab === "diagnosticos" && (
          <>
            {/* Projects Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Diagnósticos y Proyectos</h2>
              <div className="w-full">
                <PrediagnosticoList />
              </div>
            </section>
          </>
        )}
        {activeTab === "configuracion" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Perfil</h2>
            <Perfil />
          </section>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FormDiagnostico onClose={() => {
          setIsModalOpen(false);
          router.refresh();
        }} />
      </Modal>
    </main>
  );
}


