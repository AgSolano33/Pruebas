"use client";

import { useState } from "react";
import { FaBullseye, FaBuilding } from "react-icons/fa";

export default function UserTypeSelector({ onSelect, onBack }) {
  const [selectedType, setSelectedType] = useState("client"); // Por defecto cliente

  const userTypes = {
    client: {
      id: "client",
      title: "Perfil Empresarial",
      description: "Busca y contrata servicios profesionales para tus proyectos empresariales",
      color: "green",
      icon: FaBuilding,
      perfectFor: [
        "Empresas que necesitan servicios externos",
        "Startups buscando talento especializado",
        "Proyectos que requieren expertise específica",
        "Empresas que quieren subcontratar servicios",
        "Directores de proyecto buscando proveedores"
      ],
      benefits: [
        "Acceso a proveedores validados y calificados",
        "Publicación de proyectos con alcance detallado",
        "Sistema de matching inteligente con IA",
        "Gestión completa de proyectos y contratos",
        "Dashboard empresarial con métricas"
      ]
    },
    provider: {
      id: "provider",
      title: "Proveedor de Servicios",
      description: "Ofrece servicios profesionales como empresa o freelancer",
      color: "blue",
      icon: FaBullseye,
      perfectFor: [
        "Empresas de servicios profesionales",
        "Freelancers y profesionales independientes",
        "Consultores y expertos en su campo",
        "Desarrolladores, diseñadores, marketers",
        "Agencias y estudios creativos"
      ],
      benefits: [
        "Perfil validado por IA con credenciales",
        "Acceso directo a proyectos y clientes",
        "Catálogo de servicios personalizable",
        "Recomendaciones de mejora continua",
        "Dashboard de proveedor con analytics"
      ]
    }
  };

  const currentType = userTypes[selectedType];

  const handleContinue = () => {
    onSelect(currentType);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">¿Qué tipo de usuario eres?</h2>
        <p className="text-gray-600">Selecciona la opción que mejor describe tu perfil</p>
      </div>

      {/* Toggle Switch */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-200 rounded-full p-1 flex items-center shadow-inner">
          <button
            onClick={() => setSelectedType("client")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
              selectedType === "client"
                ? "bg-green-500 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <FaBuilding className="w-4 h-4" />
            <span>Contratar Servicios</span>
          </button>
          <button
            onClick={() => setSelectedType("provider")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
              selectedType === "provider"
                ? "bg-blue-500 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <FaBullseye className="w-4 h-4" />
            <span>Ofrecer Servicios</span>
          </button>
        </div>
      </div>

      {/* Información del tipo seleccionado */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
        {/* Header con color del tipo */}
        <div className={`bg-gradient-to-r from-${currentType.color}-100 to-${currentType.color}-200 text-${currentType.color}-800 p-6`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`bg-${currentType.color}-500 p-2 rounded-full`}>
              <currentType.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">{currentType.title}</h3>
          </div>
          <p className="text-lg opacity-90 leading-relaxed">{currentType.description}</p>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Perfecto para */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Perfecto para:
              </h4>
              <ul className="space-y-3">
                {currentType.perfectFor.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700 group">
                    <span className="text-green-500 mr-3 mt-1 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lo que obtienes */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <div className={`w-2 h-2 bg-${currentType.color}-500 rounded-full`}></div>
                Lo que obtienes:
              </h4>
              <ul className="space-y-3">
                {currentType.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start text-gray-700 group">
                    <span className={`text-${currentType.color}-500 mr-3 mt-1 group-hover:scale-110 transition-transform`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-2 justify-center">
        <button
          onClick={handleContinue}
          className={`btn px-6 py-3 text-sm font-semibold bg-${currentType.color}-500 hover:bg-${currentType.color}-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
        >
          Continuar como {currentType.title}
        </button>
        
        {onBack && (
          <button
            onClick={onBack}
            className="btn btn-outline px-6 py-3 text-sm font-semibold hover:bg-gray-50"
          >
            ← Volver
          </button>
        )}
      </div>
    </div>
  );
} 