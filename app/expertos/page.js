"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NotificacionesExperto from "@/components/NotificacionesExperto";
import Header from "@/components/Header";

const ExpertosPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("registro");
  const [hasExpertProfile, setHasExpertProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    semblanza: "",
    industrias: [],
    categorias: "",
    gradoExperiencia: "",
    experienciaProfesional: "",
    serviciosPropuestos: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar si el usuario ya tiene perfil de experto
  useEffect(() => {
    const checkExpertProfile = async () => {
      if (session) {
        try {
          const response = await fetch("/api/expertos?checkProfile=true");
          const result = await response.json();
          
          if (result.success) {
            setHasExpertProfile(result.hasProfile);
          }
        } catch (error) {
          console.error("Error al verificar perfil de experto:", error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    if (status === "authenticated") {
      checkExpertProfile();
    } else if (status === "unauthenticated") {
      setIsLoadingProfile(false);
    }
  }, [session, status]);

  // Redirigir si no hay sesión
  if (status === "loading" || isLoadingProfile) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validación adicional para industrias
    if (formData.industrias.length === 0) {
      alert("Debes seleccionar al menos una industria");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/expertos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Formulario enviado exitosamente. Tu perfil será revisado por nuestro equipo.");
        setFormData({
          nombre: "",
          semblanza: "",
          industrias: [],
          categorias: "",
          gradoExperiencia: "",
          experienciaProfesional: "",
          serviciosPropuestos: ""
        });
        setHasExpertProfile(true); // Actualizar estado después de crear perfil
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      alert("Error al enviar el formulario. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Expertos</h1>
              <p className="text-gray-600">
                Gestiona tu perfil de experto y revisa las solicitudes de proyectos
              </p>
            </div>

            {/* Pestañas */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                {!hasExpertProfile && (
                  <button
                    onClick={() => setActiveTab("registro")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "registro"
                        ? "border-[#1A3D7C] text-[#1A3D7C]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Registro de Experto
                  </button>
                )}
                <button
                  onClick={() => setActiveTab("notificaciones")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "notificaciones"
                      ? "border-[#1A3D7C] text-[#1A3D7C]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Notificaciones de Proyectos
                </button>
              </nav>
            </div>

            {/* Contenido de las pestañas */}
            {activeTab === "registro" && !hasExpertProfile && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Registro de Experto</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre */}
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>

                  {/* Semblanza */}
                  <div>
                    <label htmlFor="semblanza" className="block text-sm font-medium text-gray-700 mb-2">
                      Semblanza *
                    </label>
                    <textarea
                      id="semblanza"
                      name="semblanza"
                      value={formData.semblanza}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe brevemente tu perfil profesional y experiencia"
                    />
                  </div>

                  {/* Industrias */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industrias * (máximo 3)
                    </label>
                    <div className="space-y-2">
                      {[
                        "Industrial Automation",
                        "Agriculture industry",
                        "Software and Tech Development",
                        "Biotechnology and Life Sciences",
                        "Food & Beverages",
                        "ClimateTech & Sustainability",
                        "Creative Industry & arts",
                        "Beauty and personal care",
                        "E-commerce",
                        "Health Services"
                      ].map((industria) => (
                        <label key={industria} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={industria}
                            checked={formData.industrias.includes(industria)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (formData.industrias.length < 3) {
                                  setFormData(prev => ({
                                    ...prev,
                                    industrias: [...prev.industrias, industria]
                                  }));
                                }
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  industrias: prev.industrias.filter(ind => ind !== industria)
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{industria}</span>
                        </label>
                      ))}
                    </div>
                    {formData.industrias.length > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        Seleccionadas: {formData.industrias.length}/3
                      </p>
                    )}
                  </div>

                  {/* Categorías */}
                  <div>
                    <label htmlFor="categorias" className="block text-sm font-medium text-gray-700 mb-2">
                      Categorías *
                    </label>
                    <input
                      type="text"
                      id="categorias"
                      name="categorias"
                      value={formData.categorias}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Consultoría, Desarrollo, Marketing, Estrategia"
                    />
                  </div>

                  {/* Grado de Experiencia */}
                  <div>
                    <label htmlFor="gradoExperiencia" className="block text-sm font-medium text-gray-700 mb-2">
                      Grado de Experiencia *
                    </label>
                    <select
                      id="gradoExperiencia"
                      name="gradoExperiencia"
                      value={formData.gradoExperiencia}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecciona tu nivel de experiencia</option>
                      <option value="junior">Junior (1-3 años)</option>
                      <option value="mid-level">Mid-level (3-5 años)</option>
                      <option value="senior">Senior (5-10 años)</option>
                      <option value="expert">Expert (10+ años)</option>
                    </select>
                  </div>

                  {/* Experiencia Profesional */}
                  <div>
                    <label htmlFor="experienciaProfesional" className="block text-sm font-medium text-gray-700 mb-2">
                      Experiencia Profesional *
                    </label>
                    <textarea
                      id="experienciaProfesional"
                      name="experienciaProfesional"
                      value={formData.experienciaProfesional}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe tu experiencia profesional, proyectos relevantes y logros"
                    />
                  </div>

                  {/* Servicios Propuestos */}
                  <div>
                    <label htmlFor="serviciosPropuestos" className="block text-sm font-medium text-gray-700 mb-2">
                      Servicios Propuestos *
                    </label>
                    <textarea
                      id="serviciosPropuestos"
                      name="serviciosPropuestos"
                      value={formData.serviciosPropuestos}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe los servicios que ofreces y cómo puedes ayudar a las empresas"
                    />
                  </div>

                  {/* Botón de envío */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1A3D7C] text-white py-3 px-4 rounded-md hover:bg-[#0f2a5a] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Formulario"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {hasExpertProfile && activeTab === "registro" && (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ya tienes un perfil de experto</h2>
                <p className="text-gray-600 mb-6">
                  Tu perfil de experto ya está registrado. Puedes revisar las notificaciones de proyectos en la pestaña correspondiente.
                </p>
                <button
                  onClick={() => setActiveTab("notificaciones")}
                  className="bg-[#1A3D7C] text-white py-2 px-4 rounded-md hover:bg-[#0f2a5a] transition-colors"
                >
                  Ver Notificaciones
                </button>
              </div>
            )}

            {activeTab === "notificaciones" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notificaciones de Proyectos</h2>
                <NotificacionesExperto />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertosPage; 