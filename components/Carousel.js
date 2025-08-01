"use client";

import { useState, useEffect } from "react";

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

export default function Carousel({ onOpenModal }) {
  const [currentSlide, setCurrentSlide] = useState(0);

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
                  onClick={onOpenModal}
                  className="btn btn-primary bg-[#1A3D7C] hover:bg-[#0f2a5a] border-none"
                >
                  ¡Genera tu diagnostico gratis!
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
    </div>
  );
} 