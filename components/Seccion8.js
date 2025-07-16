import React from "react";

const features = [
  {
    icon: "⏳",
    title: "Ahorra tiempo",
    desc: "Deja de buscar a ciegas quién puede ayudarte."
  },
  {
    icon: "💸",
    title: "Evita errores costosos",
    desc: "Identifica el verdadero problema antes de invertir."
  },
  {
    icon: "🚀",
    title: "Expertos",
    desc: "Revisa los perfiles de cientos de expertos y su grado de compatibilidad con tu proyecto."
  }
];

export default function Seccion8() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">¿Por qué usar CLA?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-base text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
