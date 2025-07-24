import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const pasos = [
  {
    numero: 1,
    icon: "📝",
    text: "Contesta unas preguntas sencillas",
    color: "bg-pink-100 border-pink-200"
  },
  {
    numero: 2,
    icon: "🤖",
    text: "Recibe un diagnóstico IA gratuito",
    color: "bg-blue-100 border-blue-200"
  },
  {
    numero: 3,
    icon: "📋",
    text: "Postula la solución que más te guste",
    color: "bg-green-100 border-green-200"
  },
  {
    numero: 4,
    icon: "🧑‍💼",
    text: "Encuentra justo el experto que puede ayudarte",
    color: "bg-yellow-100 border-yellow-200"
  }
];

export default function Seccion2() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleBrindoSoluciones = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/api/auth/signin?callbackUrl=/dashboard&userType=provider");
    }
  };

  const handleBuscoSoluciones = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/api/auth/signin?callbackUrl=/dashboard&userType=client");
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10">¿Cómo funciona?</h2>
        
        {/* Información sobre los tipos de usuario */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <div className="text-center max-w-sm">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2 text-[#1A3D7C]">Busco Soluciones</h3>
              <p className="text-gray-600 text-sm">
                Soy una empresa que necesita ayuda con proyectos y soluciones
              </p>
            </div>

            <div className="text-2xl font-bold text-gray-400 hidden md:block">VS</div>

            <div className="text-center max-w-sm">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-2 text-[#1A3D7C]">Brindo Soluciones</h3>
              <p className="text-gray-600 text-sm">
                Soy un experto que ofrece servicios y soluciones
              </p>
            </div>
          </div>
        </div>

        {/* Pasos del proceso */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 min-h-[320px]">
          <div className="w-full flex flex-col md:flex-row justify-center items-center">
            {pasos.map((paso, idx) => (
              <div key={idx} className="flex flex-col items-center mx-4 relative z-10">
                <span className="flex items-center justify-center text-3xl font-bold mb-2 text-blue-500 drop-shadow-sm z-20">{paso.numero}</span>
                <div
                  className={`flex flex-col items-center justify-start ${paso.color} rounded-full shadow-lg w-44 h-44 hover:scale-105 transition-all border-2 z-20 p-4 pt-6`}
                >
                  <span className="text-2xl mb-1 mt-0">{paso.icon}</span>
                  <span className="text-sm font-semibold leading-tight break-words text-center mt-1">
                    {paso.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center">
          <p className="text-xl font-semibold">Así de fácil es obtener la solución perfecta</p>
        </div>
      </div>
    </section>
  );
} 