"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MetricGeneralAnalysis from "@/components/MetricGeneralAnalysis";
import { FaArrowLeft, FaChartLine } from "react-icons/fa";

export default function MetricGeneralPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchGeneralAnalysis();
    }
  }, [status, session, router]);

  const fetchGeneralAnalysis = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/metric-general?userId=${session.user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalysisData(data.data);
      }
    } catch (error) {
      console.error('Error fetching general analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A3D7C]"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#1A3D7C] hover:text-[#00AEEF] transition-colors"
            >
              <FaArrowLeft className="text-lg" />
              <span>Volver</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#1A3D7C] rounded-lg">
              <FaChartLine className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1A3D7C]">
                Análisis General de Métricas
              </h1>
              <p className="text-gray-600 mt-1">
                Vista integral de todas las métricas específicas de tu empresa
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <MetricGeneralAnalysis 
            analysisData={analysisData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  );
} 