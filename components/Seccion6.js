import React from "react";

const items = [
  "Digitalización de procesos",
  "Soluciones con IA",
  "Finanzas rentabilidad",
  "Automatización y eficiencia",
  "Innovación",
  "E-commerce",
  "Marketing de resultados",
  "Proyectos especiales y prototipos",
  "Mucho más…"
];

export default function Seccion6() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-7">Mas de 200 empresas han encontrado soluciones para temas como:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center text-center text-lg font-semibold hover:bg-blue-50 transition"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
