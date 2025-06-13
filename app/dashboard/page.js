"use client";

import { useState, useEffect } from "react";
import PrediagnosticoList from "@/components/PrediagnosticoList";
import DiagnosticoInfo from "@/components/DiagnosticoInfo";
import DiagnosticoCentral from "@/components/DiagnosticoCentral";
import Conclusions from "@/components/Conclusions";
import MetricsCards from "@/components/MetricsCards";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [companyName, setCompanyName] = useState("Nombre de la Empresa");
  const [hasDiagnosticoCentral, setHasDiagnosticoCentral] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isExisting, setIsExisting] = useState(false);
  const [showDiagnosticoCentral, setShowDiagnosticoCentral] = useState(false);

  useEffect(() => {
    const checkDiagnosticoCentral = async () => {
      if (!session?.user?.id) return;
    
      try {
        const response = await fetch(`/api/diagnostico-central?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          const hasDiagnostico = !!data;
          setHasDiagnosticoCentral(hasDiagnostico);
          if (data) {
            setDiagnosisData(data);
            setCompanyName(data.informacionEmpresa?.nombreEmpresa || "Nombre de la Empresa");
          }
        }
      } catch (error) {
        // Error handling without console.log
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      checkDiagnosticoCentral();
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
            {!hasDiagnosticoCentral && (
              <button
                onClick={() => setShowDiagnosticoCentral(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Diagnóstico Central
              </button>
            )}
          </div>
        </div>

        {/* Information Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Información</h2>
          <div className="w-full">
            <DiagnosticoInfo />
          </div>
        </section>

        {/* Projects Section */}
        <div className="border-b border-gray-300 my-8"></div>
        <section>
          <h2 className="text-2xl font-bold mb-4">Proyectos</h2>
          <div className="w-full">
            <PrediagnosticoList />
          </div>
        </section>
        <div className="border-b border-gray-300 my-8"></div>

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
      </div>
    </main>
  );
}
