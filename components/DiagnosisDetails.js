"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaBuilding, FaLightbulb, FaProjectDiagram, FaHandshake } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/icon.png";

export default function DiagnosisDetails({ params }) {
  const router = useRouter();
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const diagnosisId = params.id;

        if (!diagnosisId) {
          setError('Se requiere el ID del diagnóstico');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/diagnoses/${diagnosisId}`);
        const result = await response.json();

        if (result.success && result.data) {
          setDiagnosis(result.data);
        } else {
          setError(result.error || 'Error al cargar el diagnóstico');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [params.id]);

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.map(item => {
        let formatted = item.replace(/^["']|["']$/g, '');
        // Elimina líneas que contienen solo números
        formatted = formatted.replace(/^\d+\s*$/, '');
        // Elimina números al inicio de líneas
        formatted = formatted.replace(/^\d+\s*/, '');
        return formatted;
      }).filter(item => item.trim() !== '').join(', ');
    }
    if (typeof value === 'string') {
      let formatted = value.replace(/^["']|["']$/g, '');
      // Elimina líneas que contienen solo números
      formatted = formatted.replace(/^\d+\s*$/, '');
      // Elimina números al inicio de líneas
      formatted = formatted.replace(/^\d+\s*/, '');
      return formatted;
    }
    return value;
  };

  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([key, val]) => {
            const formattedKey = key
              .replace(/^["']|["']$/g, '')
              .replace(/^\d+:\s*/, '')
              .replace(/^\d+\s*$/, ''); // Elimina líneas que contienen solo números
            const formattedVal = formatValue(val);
            // Solo renderiza si hay contenido después de formatear
            if (formattedVal.trim() === '') return null;
            return (
              <div key={key} className="pl-4 border-l-2 border-blue-200">
                <p className="font-medium text-gray-700">{formattedKey}</p>
                <p className="text-gray-600">{formattedVal}</p>
              </div>
            );
          })}
        </div>
      );
    }
    const formattedValue = formatValue(value);
    // Solo renderiza si hay contenido después de formatear
    if (formattedValue.trim() === '') return null;
    return <p className="text-gray-600">{formattedValue}</p>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-red-800 font-semibold text-xl mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/dashboard" className="inline-flex items-center text-red-800 hover:text-red-900 transition-colors">
              <FaArrowLeft className="mr-2" />
              Volver al dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-yellow-800 font-semibold text-xl mb-2">No se encontró el diagnóstico</h2>
            <Link href="/dashboard" className="inline-flex items-center text-yellow-800 hover:text-yellow-900 transition-colors">
              <FaArrowLeft className="mr-2" />
              Volver al dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Volver al dashboard
          </Link>
          <div className="flex items-center">
            <Image
              src={logo}
              alt="Logo"
              width={300}
              height={300}
              className="w-[200px] md:w-[300px]"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Detalles del Diagnóstico</h1>

          {/* Situación Actual y Objetivos */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaBuilding className="text-blue-500 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-800">Situación Actual y Objetivos</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {diagnosis['1. Situacion actual de la empresa y objetivos'] && 
                Object.entries(diagnosis['1. Situacion actual de la empresa y objetivos']).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-800 mb-3 text-lg">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </h3>
                    {renderValue(value)}
                  </div>
                ))}
            </div>
          </section>

          {/* Posibles Soluciones */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaLightbulb className="text-yellow-500 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-800">Posibles Soluciones</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {diagnosis['2. Posibles soluciones']?.map((solucion, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-gray-800 mb-3 text-lg">Solución {index + 1}</h3>
                  {renderValue(solucion)}
                </div>
              ))}
            </div>
          </section>

          {/* Categorías de Proyecto */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaProjectDiagram className="text-green-500 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-800">Categorías de Proyecto</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {diagnosis['3. Categorias de proyecto'] && 
                Object.entries(diagnosis['3. Categorias de proyecto']).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-800 mb-3 text-lg">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </h3>
                    {renderValue(value)}
                  </div>
                ))}
            </div>
          </section>

          {/* Posibles Matches */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaHandshake className="text-purple-500 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-800">Posibles Matches</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {diagnosis['4. Posibles matches']?.map((match, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-gray-800 mb-3 text-lg">Match {index + 1}</h3>
                  {renderValue(match)}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 