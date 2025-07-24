"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaBriefcase, FaDollarSign, FaGlobe, FaClock, FaUsers, FaChartLine } from "react-icons/fa";
import ButtonSignin from "./ButtonSignin";
import Modal from "./Modal";

export default function ProviderBenefits() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      setShowLoginModal(true);
    }
  }, [searchParams]);

  const handleComenzar = () => {
    setShowLoginModal(true);
  };

  const benefits = [
    {
      icon: <FaBriefcase className="text-3xl text-blue-600" />,
      title: "Oportunidades de Proyectos",
      description: "Accede a una amplia cartera de proyectos de empresas que buscan expertos como tú."
    },
    {
      icon: <FaDollarSign className="text-3xl text-green-600" />,
      title: "Ingresos Estables",
      description: "Genera ingresos consistentes trabajando con clientes verificados y proyectos bien definidos."
    },
    {
      icon: <FaGlobe className="text-3xl text-purple-600" />,
      title: "Alcance Global",
      description: "Conecta con clientes de todo el mundo sin las limitaciones geográficas tradicionales."
    },
    {
      icon: <FaClock className="text-3xl text-orange-600" />,
      title: "Flexibilidad Total",
      description: "Trabaja en tus propios términos, horarios y desde cualquier lugar que prefieras."
    },
    {
      icon: <FaUsers className="text-3xl text-red-600" />,
      title: "Red Profesional",
      description: "Únete a una comunidad de expertos y expande tu red de contactos profesionales."
    },
    {
      icon: <FaChartLine className="text-3xl text-teal-600" />,
      title: "Crecimiento Profesional",
      description: "Desarrolla nuevas habilidades y especialidades a través de proyectos diversos."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Monetiza tu Experiencia Profesional
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Conecta con empresas que buscan expertos como tú. Ofrece tus servicios, 
            construye tu reputación y genera ingresos haciendo lo que mejor sabes hacer.
          </p>
          <button
            onClick={handleComenzar}
            className="bg-[#1A3D7C] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#152a5c] transition-colors shadow-lg"
          >
            Comenzar Ahora
          </button>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
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

        {/* How it Works */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Cómo Funciona?
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
                Completa tu perfil profesional con tu experiencia, especialidades y servicios que ofreces.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Recibe Propuestas
              </h3>
              <p className="text-gray-600">
                Las empresas te encontrarán automáticamente y te enviarán propuestas de proyectos compatibles.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Trabaja y Gana
              </h3>
              <p className="text-gray-600">
                Acepta los proyectos que te interesen, completa el trabajo y recibe tu pago de forma segura.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Expertos Activos</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
            <div className="text-gray-600">Proyectos Completados</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">$2M+</div>
            <div className="text-gray-600">Ingresos Generados</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">4.8★</div>
            <div className="text-gray-600">Calificación Promedio</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Listo para Crecer tu Carrera?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Únete a nuestra comunidad de expertos y comienza a generar ingresos haciendo lo que amas.
          </p>
          <button
            onClick={handleComenzar}
            className="bg-[#1A3D7C] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#152a5c] transition-colors shadow-lg"
          >
            Crear Perfil Gratis
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Inicia Sesión para Continuar
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Accede a tu cuenta para crear tu perfil profesional y comenzar a recibir propuestas.
          </p>
          <ButtonSignin />
        </div>
      </Modal>
    </div>
  );
} 