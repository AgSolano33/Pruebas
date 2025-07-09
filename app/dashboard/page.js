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
  const [isLoadingDiagnostico, setIsLoadingDiagnostico] = useState(true);
  const [isExisting, setIsExisting] = useState(false);
  const [showDiagnosticoCentral, setShowDiagnosticoCentral] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
        setIsLoadingDiagnostico(true);
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

      } catch (error) {
        // Error handling
      } finally {
        setHasDiagnosticoCentral(userHasDiagnosticoCentral);
        setHasPrediagnosticos(userHasPrediagnosticos);
        setIsLoading(false);
        setIsLoadingDiagnostico(false);

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
    { id: "expertos", name: "Expertos", icon: FaUsers },
    { id: "diagnosticos", name: "Diagnósticos", icon: FaClipboardList },
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
            {isLoadingDiagnostico ? (
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
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-[#1A3D7C] text-[#1A3D7C]"
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

        {/* Tab Content */}
        {activeTab === "overview" && (
          <>
            {/* Information Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Información</h2>
              <div className="w-full">
                <DiagnosticoInfo />
              </div>
            </section>

            {/* Metrics Cards Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Métricas Principales</h2>
              <div className="w-full">
                <MetricsCards />
              </div>
            </section>

            {/* Financial Metrics Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Diagnóstico General</h2>
              <div className="w-full">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
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
                )}
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

        {activeTab === "proyectos" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Proyectos Publicados</h2>
            <div className="w-full">
              <ProyectosTablero />
            </div>
          </section>
        )}

        {activeTab === "expertos" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Búsqueda de Expertos</h2>
            <div className="w-full">
              <p className="text-gray-600 mb-4">
                Publica tus proyectos para encontrar expertos compatibles. Ve a la pestaña "Diagnósticos" para publicar un proyecto.
              </p>
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


