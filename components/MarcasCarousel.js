"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const marcas = [
  {
    nombre: "Dulce de Noviembre",
    imagen: "/marcas/dulce-noviembre.png"
  },
  {
    nombre: "Alis",
    imagen: "/marcas/alis.png"
  },
  {
    nombre: "Madre Tierra",
    imagen: "/marcas/madre-tierra.png"
  },
  {
    nombre: "Dinco",
    imagen: "/marcas/dinco.png"
  },
  {
    nombre: "Bodegas Pinesque",
    imagen: "/marcas/bodegas-pinesque.png"
  }
];

const newMarcas = [
  {
    nombre: "Collec",
    imagen: "/marcas/collec.png"
  },
  {
    nombre: "Emprendchi",
    imagen: "/marcas/emprendchi.png"
  },
  {
    nombre: "Thermo",
    imagen: "/marcas/thermo.png"
  }
];


const updatedMarcas = [...marcas, ...newMarcas];

export default function MarcasCarousel() {
  const [position, setPosition] = useState(0);
  const containerRef = useRef(null);
  const requestRef = useRef();
  const previousTimeRef = useRef();

 
  const allMarcas = updatedMarcas;

  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      setPosition(prev => {
        const newPosition = prev - (deltaTime * 0.010); // time
        return newPosition <= -100 ? 0 : newPosition;
      });
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

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
            {/* Hay tres copias de las marcas para hacerlo mas smooth*/}
            {allMarcas.map((marca, index) => (
              <div 
                key={`first-${marca.nombre}`}
                className="w-1/6 flex-shrink-0"
              >
                <div className="relative h-32 w-full">
                  <Image
                    src={marca.imagen}
                    alt={marca.nombre}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}
            
            
            {allMarcas.map((marca, index) => (
              <div 
                key={`second-${marca.nombre}`}
                className="w-1/6 flex-shrink-0"
              >
                <div className="relative h-32 w-full">
                  <Image
                    src={marca.imagen}
                    alt={marca.nombre}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="transition-opacity duration-300"
                  />
                </div>
              </div>
            ))}

           
            {allMarcas.map((marca, index) => (
              <div 
                key={`third-${marca.nombre}`}
                className="w-1/6 flex-shrink-0"
              >
                <div className="relative h-32 w-full">
                  <Image
                    src={marca.imagen}
                    alt={marca.nombre}
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