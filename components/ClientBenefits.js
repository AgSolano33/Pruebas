"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaCheck, FaRocket, FaUsers, FaChartLine, FaShieldAlt, FaClock } from "react-icons/fa";
import ButtonSignin from "./ButtonSignin";
import Modal from "./Modal";

export default function ClientBenefits() {
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
      icon: <FaRocket className="text-3xl text-blue-600" />,
      title: "Diagnóstico Inteligente",
      description: "Obtén un análisis completo de tu empresa con IA avanzada que identifica oportunidades de mejora específicas."
    },
    {
      icon: <FaUsers className="text-3xl text-green-600" />,
      title: "Expertos Verificados",
      description: "Accede a una red de profesionales certificados y con experiencia comprobada en tu industria."
    },
    {
      icon: <FaChartLine className="text-3xl text-purple-600" />,
      title: "Resultados Medibles",
      description: "Monitorea el progreso de tus proyectos con métricas claras y reportes detallados de rendimiento."
    },
    {
      icon: <FaShieldAlt className="text-3xl text-orange-600" />,
      title: "Garantía de Calidad",
      description: "Todos nuestros expertos pasan por un riguroso proceso de verificación y evaluación continua."
    },
    {
      icon: <FaClock className="text-3xl text-red-600" />,
      title: "Implementación Rápida",
      description: "Desde el diagnóstico hasta la implementación, todo en un proceso optimizado y eficiente."
    },
    {
      icon: <FaCheck className="text-3xl text-teal-600" />,
      title: "Soporte Continuo",
      description: "Recibe apoyo durante todo el proceso, desde la selección hasta la finalización del proyecto."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Encuentra Soluciones Expertas para tu Empresa
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Conectamos empresas con profesionales especializados para resolver desafíos específicos 
            y potenciar el crecimiento de tu negocio.
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
                Diagnóstico Completo
              </h3>
              <p className="text-gray-600">
                Completa nuestro diagnóstico inteligente para identificar las áreas de mejora específicas de tu empresa.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Expertos Compatibles
              </h3>
              <p className="text-gray-600">
                Nuestro sistema te conecta automáticamente con expertos que coinciden perfectamente con tus necesidades.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Implementación y Resultados
              </h3>
              <p className="text-gray-600">
                Trabaja con los expertos seleccionados para implementar soluciones y ver resultados medibles.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Listo para Transformar tu Empresa?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Únete a cientos de empresas que ya han mejorado sus resultados con nuestros expertos.
          </p>
          <button
            onClick={handleComenzar}
            className="bg-[#1A3D7C] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#152a5c] transition-colors shadow-lg"
          >
            Comenzar Gratis
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
            Accede a tu cuenta para comenzar con el diagnóstico de tu empresa.
          </p>
          <ButtonSignin />
        </div>
      </Modal>
    </div>
  );
} 