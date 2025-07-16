"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const marcas = [
  {
    id: 1,
    nombre: "Thermo",
    logo: "/marcas/Thermo.png",
    alt: "Logo de Thermo"
  },
  {
    id: 2,
    nombre: "Collec",
    logo: "/marcas/collec.png",
    alt: "Logo de Collec"
  },
  {
    id: 3,
    nombre: "Emprendchi",
    logo: "/marcas/emprendchi.png",
    alt: "Logo de Emprendchi"
  },
  {
    id: 4,
    nombre: "Bodegas Pinesque",
    logo: "/marcas/bodegas-pinesque.png",
    alt: "Logo de Bodegas Pinesque"
  },
  {
    id: 5,
    nombre: "Dinco",
    logo: "/marcas/dinco.png",
    alt: "Logo de Dinco"
  },
  {
    id: 6,
    nombre: "Alis",
    logo: "/marcas/alis.png",
    alt: "Logo de Alis"
  },
  {
    id: 7,
    nombre: "Madre Tierra",
    logo: "/marcas/madre-tierra.png",
    alt: "Logo de Madre Tierra"
  },
  {
    id: 8,
    nombre: "Dulce Noviembre",
    logo: "/marcas/dulce-noviembre.png",
    alt: "Logo de Dulce Noviembre"
  }
];

export default function MarcasCarousel() {
  const [position, setPosition] = useState(0);
  const containerRef = useRef(null);
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      setPosition(prev => {
        const newPosition = prev - (deltaTime * 0.005); // velocidad de la animación
        return newPosition <= -100 ? 0 : newPosition;
      });
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  return (
    <div className="w-full bg-white py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#00AEEF' }}>
          Algunos de nuestros clientes
        </h2>
        <div className="relative" ref={containerRef}>
          <div 
            className="flex"
            style={{ 
              transform: `translateX(${position}%)`,
              width: '200%',
              willChange: 'transform'
            }}
          >
            {/* Primera copia de las marcas */}
            {marcas.map((marca) => (
              <div 
                key={`first-${marca.nombre}`}
                className="w-1/6 flex-shrink-0"
              >
                <div className="relative h-32 w-full">
                  <Image
                    src={marca.logo}
                    alt={marca.alt}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}
            
            {/* Segunda copia de las marcas */}
            {marcas.map((marca) => (
              <div 
                key={`second-${marca.nombre}`}
                className="w-1/6 flex-shrink-0"
              >
                <div className="relative h-32 w-full">
                  <Image
                    src={marca.logo}
                    alt={marca.alt}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}

            {/* Tercera copia de las marcas */}
            {marcas.map((marca) => (
              <div 
                key={`third-${marca.nombre}`}
                className="w-1/6 flex-shrink-0"
              >
                <div className="relative h-32 w-full">
                  <Image
                    src={marca.logo}
                    alt={marca.alt}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 