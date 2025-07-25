"use client";

import { useState, useEffect } from "react";
import PrediagnosticoList from "@/components/PrediagnosticoList";
import DiagnosticoInfo from "@/components/DiagnosticoInfo";
import DiagnosticoCentral from "@/components/DiagnosticoCentral";
import Conclusions from "@/components/Conclusions";
import MetricsCards from "@/components/MetricsCards";
import ProyectosTablero from "@/components/ProyectosTablero";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Modal from "@/components/Modal";
import FormDiagnostico from "@/components/FormDiagnostico";
import { FaChartBar, FaRocket, FaUsers, FaClipboardList } from "react-icons/fa";
import Perfil from "@/components/Perfil";

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
  const [expertosSugeridos, setExpertosSugeridos] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [metricAnalyses, setMetricAnalyses] = useState([]);
  
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
  }, [status, session]);

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
          <nav className="-mb-px flex space-x-8">
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
                  <h2 className="text-2xl font-bold mb-4">Proyecto Métrica</h2>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <h2 className="text-2xl font-bold mb-4">Métricas Principales</h2>
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
                  <h2 className="text-2xl font-bold mb-4">Diagnóstico General</h2>
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
                  <h2 className="text-2xl font-bold mb-4">Conclusiones</h2>
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
                  <h2 className="text-2xl font-bold mb-4">Proyecto Métrica</h2>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          Expertos sugeridos
                        </h3>
                        {expertosSugeridos.length === 0 ? (
                          <div className="text-gray-500 text-center">Los expertos sugeridos aparecerán aquí según el análisis de tus métricas.</div>
                        ) : (
                          <div className="flex flex-wrap gap-2 justify-center">
                            {expertosSugeridos.map((exp, i) => (
                              <span key={i} className="inline-block px-3 py-2 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-sm shadow-sm border border-yellow-200">
                                {exp}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Metrics Cards Section */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">Métricas Principales</h2>
                  <div className="w-full">
                    <MetricsCards 
                      analysisData={analysisData}
                      isLoading={false}
                    />
                  </div>
                </section>

                {/* Financial Metrics Section */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">Diagnóstico General</h2>
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

                {/* Conclusions Section */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">Conclusiones</h2>
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
            <h2 className="text-2xl font-bold mb-4">Proyectos Publicados</h2>
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


