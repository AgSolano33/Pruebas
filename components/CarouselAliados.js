"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const aliados = [
  {
    id: 1,
    logo: '/aliados/aliado1.png'
  },
  {
    id: 2,
    logo: '/aliados/aliado2.png'
  },
  {
    id: 3,
    logo: '/aliados/aliado3.png'
  },
  {
    id: 4,
    logo: '/aliados/aliado4.png'
  },
  {
    id: 5,
    logo: '/aliados/aliado5.png'
  },
  {
    id: 6,
    logo: '/aliados/aliado6.png'
  },
  {
    id: 7,
    logo: '/aliados/aliado7.png'
  },
  {
    id: 8,
    logo: '/aliados/aliado8.png'
  }
];

export default function CarouselAliados() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => prevIndex === 0 ? 4 : 0);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const handlePrevious = () => {
    setCurrentIndex(prevIndex => prevIndex === 0 ? 4 : 0);
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => prevIndex === 0 ? 4 : 0);
  };

  const visibleAliados = aliados.slice(currentIndex, currentIndex + 4);

  return (
    <div className="relative w-full overflow-hidden bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#1A3D7C]">
          Nuestros Aliados Estratégicos
        </h2>
        
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex justify-center items-center">
            <button
              onClick={handlePrevious}
              className="absolute left-0 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 focus:outline-none"
              aria-label="Anterior"
            >
              <svg className="w-6 h-6 text-[#1A3D7C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="grid grid-cols-4 gap-4 w-full">
              {visibleAliados.map((aliado) => (
                <div
                  key={aliado.id}
                  className="bg-white rounded-lg shadow-lg p-4 transition-all duration-500"
                >
                  <div className="flex justify-center items-center h-24">
                    <div className="relative w-full h-full">
                      <Image
                        src={aliado.logo}
                        alt="Logo de aliado"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="absolute right-0 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 focus:outline-none"
              aria-label="Siguiente"
            >
              <svg className="w-6 h-6 text-[#1A3D7C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            {[0, 1].map((i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i === 0 ? 0 : 4)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  (i === 0 && currentIndex === 0) || (i === 1 && currentIndex === 4) ? 'bg-[#BFD730]' : 'bg-gray-300'
                }`}
                aria-label={`Ir a grupo ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 