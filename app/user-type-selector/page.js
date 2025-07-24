"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import toast from "react-hot-toast";

export default function UserTypeSelector() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeSelection = async (userType) => {
    if (!session?.user?.id) {
      toast.error("Debes estar autenticado para continuar");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/update-user-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userType: userType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Tipo de usuario actualizado correctamente");
        
        // Redirigir según el tipo de usuario
        if (userType === "client") {
          router.push("/dashboard");
        } else if (userType === "provider") {
          router.push("/expertos");
        }
      } else {
        toast.error(data.error || "Error al actualizar el tipo de usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar el tipo de usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A3D7C]"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/api/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Cómo quieres usar CLA?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Selecciona el tipo de cuenta que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Cliente */}
          <div
            className={`relative bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 ${
              selectedType === "client"
                ? "ring-4 ring-blue-500 transform scale-105"
                : "hover:shadow-xl hover:scale-105"
            }`}
            onClick={() => setSelectedType("client")}
          >
            <div className="text-center">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Busco Soluciones
              </h3>
              <p className="text-gray-600 mb-6">
                Soy una empresa que necesita ayuda con proyectos y soluciones
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Diagnóstico gratuito de mi empresa</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Acceso a expertos verificados</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Seguimiento de proyectos</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Sistema de pagos seguro</span>
                </div>
              </div>
            </div>
          </div>

          {/* Proveedor */}
          <div
            className={`relative bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 ${
              selectedType === "provider"
                ? "ring-4 ring-green-500 transform scale-105"
                : "hover:shadow-xl hover:scale-105"
            }`}
            onClick={() => setSelectedType("provider")}
          >
            <div className="text-center">
              <div className="text-6xl mb-6">💼</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Brindo Soluciones
              </h3>
              <p className="text-gray-600 mb-6">
                Soy un experto que ofrece servicios y soluciones
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Perfil profesional destacado</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Proyectos que coinciden con mi expertise</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Herramientas de gestión de proyectos</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">Pagos automáticos y seguros</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de continuar */}
        <div className="text-center mt-12">
          <button
            onClick={() => selectedType && handleTypeSelection(selectedType)}
            disabled={!selectedType || isSubmitting}
            className="bg-[#1A3D7C] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#0f2a5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                Configurando...
              </>
            ) : (
              "Continuar"
            )}
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Puedes cambiar esta configuración más tarde en tu perfil
          </p>
        </div>
      </div>
    </div>
  );
} 