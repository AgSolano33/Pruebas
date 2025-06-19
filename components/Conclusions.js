"use client";

import React from 'react';
import { useState, useEffect } from "react";
import { FaBuilding, FaChartLine, FaClipboardList, FaLightbulb } from "react-icons/fa";

const Conclusions = ({ conclusions }) => {
  if (!conclusions) return null;

  return (
    <div className="space-y-6">
      {/* Resumen de la Empresa */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaBuilding className="text-[#1A3D7C] text-xl" />
          <h2 className="text-xl font-semibold text-[#1A3D7C]">Resumen de la Empresa</h2>
        </div>
        <p className="text-gray-600 mb-4">{conclusions.resumenEmpresa}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Fortalezas</h3>
            <ul className="list-disc list-inside text-gray-600">
              {conclusions.fortalezas.map((fortaleza, index) => (
                <li key={index}>{fortaleza}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Debilidades</h3>
            <ul className="list-disc list-inside text-gray-600">
              {conclusions.debilidades.map((debilidad, index) => (
                <li key={index}>{debilidad}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-medium text-[#1A3D7C] mb-2">Oportunidades</h3>
          <ul className="list-disc list-inside text-gray-600">
            {conclusions.oportunidades.map((oportunidad, index) => (
              <li key={index}>{oportunidad}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Análisis de Objetivos */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaChartLine className="text-[#1A3D7C] text-xl" />
          <h2 className="text-xl font-semibold text-[#1A3D7C]">Análisis de Objetivos</h2>
        </div>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Situación Actual</h3>
            <p className="text-gray-600">{conclusions.analisisObjetivos.situacionActual}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Viabilidad</h3>
            <p className="text-gray-600">{conclusions.analisisObjetivos.viabilidad}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Recomendaciones</h3>
            <ul className="list-disc list-inside space-y-1">
              {conclusions.analisisObjetivos.recomendaciones.map((recomendacion, index) => (
                <li key={index} className="text-gray-600">{recomendacion}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Próximos Pasos */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaClipboardList className="text-[#1A3D7C] text-xl" />
          <h2 className="text-xl font-semibold text-[#1A3D7C]">Próximos Pasos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Inmediatos</h3>
            <ul className="list-disc list-inside space-y-1">
              {conclusions.proximosPasos.inmediatos.map((paso, index) => (
                <li key={index} className="text-gray-600">{paso}</li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Corto Plazo</h3>
            <ul className="list-disc list-inside space-y-1">
              {conclusions.proximosPasos.cortoPlazo.map((paso, index) => (
                <li key={index} className="text-gray-600">{paso}</li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-[#1A3D7C] mb-2">Mediano Plazo</h3>
            <ul className="list-disc list-inside space-y-1">
              {conclusions.proximosPasos.medianoPlazo.map((paso, index) => (
                <li key={index} className="text-gray-600">{paso}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Conclusions; 