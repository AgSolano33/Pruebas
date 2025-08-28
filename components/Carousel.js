"use client";

import { useState, useEffect } from "react";
import { useAuthModal } from "@/hooks/useAuthModal"; // importamos el hook
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const slides = [
  {
    id: 1,
    title: "Dinos qué te duele. Nosotros te decimos quién puede ayudarte.",
    description: "Encuentra el Match perfecto para las necesidades de tu empresa.",
    image: "https://images.unsplash.com/photo-1622084730216-39187f8bb9de?q=80&w=1030&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    title: "Consultoría Especializada",
    description: "Expertos en optimización de procesos empresariales",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 3,
    title: "Soluciones Personalizadas",
    description: "Adaptamos nuestras soluciones a tus necesidades",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  }
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hook del modal de login
  const {
    showAuthModal,
    openModal,
    closeModal,
    authMode,
    registeredEmail,
    handleGoogleSignIn,
    handleAuthSuccess,
    switchToLogin,
    switchToRegister
  } = useAuthModal();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center">
              <div className="text-center text-gray-800 p-8">
                <h2 className="text-4xl font-bold mb-4 text-[#1A3D7C]">{slide.title}</h2>
                <p className="text-xl mb-8 text-gray-700">{slide.description}</p>
                <button 
                  onClick={openModal} // abrimos el modal del hook
                  className="btn btn-primary bg-[#1A3D7C] hover:bg-[#0f2a5a] border-none"
                >
                  ¡Genera tu diagnóstico gratis!
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-[#1A3D7C]" : "bg-gray-400"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Modal de login */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}</h2>
              <button onClick={closeModal} className="btn btn-ghost btn-sm btn-circle">✕</button>
            </div>

            {authMode === "login" ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onCancel={closeModal}
                prefillEmail={registeredEmail}
              />
            ) : (
              <RegisterForm
                onSuccess={handleAuthSuccess}
                onCancel={closeModal}
                onSwitchToLogin={switchToLogin}
              />
            )}

            <div className="divider">O</div>

            <button onClick={handleGoogleSignIn} className="btn btn-outline w-full mb-4">
              Continuar con Google
            </button>

            <div className="text-center">
              {authMode === "login" ? (
                <button onClick={switchToRegister} className="btn btn-link">
                  ¿No tienes cuenta? Regístrate
                </button>
              ) : (
                <button onClick={() => switchToLogin()} className="btn btn-link">
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
