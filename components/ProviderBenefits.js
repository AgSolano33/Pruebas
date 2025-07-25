"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaBriefcase, FaGlobe, FaStar, FaChartBar, FaShieldAlt, FaHandshake } from "react-icons/fa";
import ButtonSignin from "./ButtonSignin";
import Header from "./Header";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

function ProviderBenefitsContent() {
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
    // Redirect to dashboard or handle success
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
      icon: <FaBriefcase className="text-3xl text-blue-600" />,
      title: "Perfil Profesional",
      description: "Crea tu perfil profesional destacando tus habilidades y experiencia"
    },
    {
      icon: <FaGlobe className="text-3xl text-blue-600" />,
      title: "Alcance Global",
      description: "Conecta con clientes de todo el mundo sin límites geográficos"
    },
    {
      icon: <FaStar className="text-3xl text-blue-600" />,
      title: "Validación de Credenciales",
      description: "Tu perfil es verificado y validado por nuestra plataforma"
    },
    {
      icon: <FaChartBar className="text-3xl text-blue-600" />,
      title: "Analytics Avanzados",
      description: "Dashboard con métricas detalladas de tus proyectos y ganancias"
    },
    {
      icon: <FaShieldAlt className="text-3xl text-blue-600" />,
      title: "Protección y Seguridad",
      description: "Contratos seguros y pagos garantizados para todos tus proyectos"
    },
    {
      icon: <FaHandshake className="text-3xl text-blue-600" />,
      title: "Proyectos de Calidad",
      description: "Acceso a proyectos bien definidos con clientes serios"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Header Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Ofrece tus Servicios
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Conecta con clientes que necesitan tu expertise profesional
          </p>
          <button
            onClick={handleComenzar}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg mx-auto block"
          >
            Comenzar como Proveedor
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
                  Crea tu Perfil
                </h3>
                <p className="text-gray-600">
                  Destaca tus habilidades, experiencia y servicios
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Recibe Propuestas
                </h3>
                <p className="text-gray-600">
                  Conecta con clientes que buscan tus servicios
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Gana y Crece
                </h3>
                <p className="text-gray-600">
                  Completa proyectos y construye tu reputación
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
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Proveedores Activos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">$2M+</div>
                <div className="text-gray-600">En Proyectos Completados</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-600">Satisfacción de Clientes</div>
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
                      Accede a tu cuenta para crear tu perfil profesional y comenzar a recibir propuestas
                    </p>
                  </div>
                  <LoginForm 
                    onSuccess={handleAuthSuccess}
                    onCancel={() => setShowAuthModal(false)}
                    prefillEmail={registeredEmail}
                    userType="provider"
                  />
                  <div className="text-center mt-4">
                    <button
                      onClick={switchToRegister}
                      className="text-blue-600 hover:text-blue-700 font-medium"
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
                    userType="provider"
                  />
                  <div className="text-center mt-4">
                    <button
                      onClick={switchToLogin}
                      className="text-blue-600 hover:text-blue-700 font-medium"
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

export default function ProviderBenefits() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProviderBenefitsContent />
    </Suspense>
  );
} 