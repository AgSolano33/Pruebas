"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaSearch, FaUsers, FaChartLine, FaShieldAlt, FaRocket, FaCheck } from "react-icons/fa";
import ButtonSignin from "./ButtonSignin";
import Header from "./Header";
import RegisterForm from "./RegisterForm"; // Added import for RegisterForm
import LoginForm from "./LoginForm";

function ClientBenefitsContent() {
  const searchParams = useSearchParams();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleComenzar = () => {
    setShowAuthModal(true);
    setAuthMode("login");
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Redirect to dashboard after successful login
    window.location.href = "/dashboard";
  };

  const switchToLogin = (email = "") => {
    setAuthMode("login");
    if (email) {
      setRegisteredEmail(email);
    }
  };

  const switchToRegister = () => {
    setAuthMode("register");
    setRegisteredEmail("");
  };

  const handleRegisterSuccess = (email) => {
    // Después del registro exitoso, cambiar a login y pre-llenar email
    setAuthMode("login");
    setRegisteredEmail(email);
    // No cerrar el modal, solo cambiar el modo
  };

  const benefits = [
    {
      icon: <FaSearch className="text-3xl text-blue-600" />,
      title: "Diagnóstico Inteligente",
      description: "Obtén un análisis completo de tu empresa con IA avanzada"
    },
    {
      icon: <FaUsers className="text-3xl text-blue-600" />,
      title: "Expertos Verificados",
      description: "Accede a profesionales certificados con experiencia comprobada"
    },
    {
      icon: <FaChartLine className="text-3xl text-blue-600" />,
      title: "Resultados Medibles",
      description: "Monitorea el progreso con métricas claras y reportes detallados"
    },
    {
      icon: <FaShieldAlt className="text-3xl text-blue-600" />,
      title: "Garantía de Calidad",
      description: "Todos nuestros expertos pasan por verificación rigurosa"
    },
    {
      icon: <FaRocket className="text-3xl text-blue-600" />,
      title: "Implementación Rápida",
      description: "Desde el diagnóstico hasta la implementación optimizada"
    },
    {
      icon: <FaCheck className="text-3xl text-blue-600" />,
      title: "Soporte Continuo",
      description: "Recibe apoyo durante todo el proceso del proyecto"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Header Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Encuentra Soluciones Expertas
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Conectamos empresas con profesionales especializados para resolver desafíos específicos
          </p>
          <button
            onClick={handleComenzar}
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg mx-auto block"
          >
            Comenzar como Cliente
          </button>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              ¿Cómo funciona?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Diagnóstico Completo
                </h3>
                <p className="text-gray-600">
                  Completa nuestro diagnóstico inteligente para identificar áreas de mejora
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Expertos Compatibles
                </h3>
                <p className="text-gray-600">
                  Nuestro sistema te conecta con expertos que coinciden con tus necesidades
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Implementación y Resultados
                </h3>
                <p className="text-gray-600">
                  Trabaja con expertos para implementar soluciones y ver resultados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Números que Hablan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
                <div className="text-gray-600">Empresas Atendidas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">$5M+</div>
                <div className="text-gray-600">En Valor Generado</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-gray-600">Tasa de Éxito</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                </h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Formulario de login/registro */}
              {authMode === "login" ? (
                <div>
                  <div className="text-center mb-6">
                    <p className="text-gray-600 text-lg">
                      Accede a tu cuenta para comenzar con el diagnóstico de tu empresa
                    </p>
                  </div>
                  <LoginForm 
                    onSuccess={handleAuthSuccess}
                    onCancel={() => setShowAuthModal(false)}
                    prefillEmail={registeredEmail}
                    userType="client"
                  />
                  <div className="text-center mt-4">
                    <button
                      onClick={switchToRegister}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      ¿No tienes cuenta? Regístrate
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-6">
                    <p className="text-gray-600 text-lg">
                      Crea tu cuenta para acceder a nuestros servicios
                    </p>
                  </div>
                  <RegisterForm 
                    onSuccess={(email) => handleRegisterSuccess(email)}
                    onCancel={() => setShowAuthModal(false)}
                    onSwitchToLogin={switchToLogin}
                    userType="client"
                  />
                  <div className="text-center mt-4">
                    <button
                      onClick={switchToLogin}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      ¿Ya tienes cuenta? Inicia sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientBenefits() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientBenefitsContent />
    </Suspense>
  );
} 