"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe, FaSave, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProviderProfile() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    semblanza: "",
    gradoExperiencia: "mid-level",
    industrias: [],
    categorias: "",
    servicios: "",
    descripcion: "",
    email: "",
    telefono: "",
    ubicacion: "",
    linkedin: "",
    website: ""
  });

  const industriasDisponibles = [
    "Tecnología", "Salud", "Educación", "Finanzas", "Retail", 
    "Manufactura", "Servicios", "Consultoría", "Marketing", "Legal"
  ];

  const gradosExperiencia = [
    { value: "junior", label: "Junior (1-3 años)" },
    { value: "mid-level", label: "Mid-Level (3-5 años)" },
    { value: "senior", label: "Senior (5-10 años)" },
    { value: "expert", label: "Expert (10+ años)" }
  ];

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/expertos/profile');
      const result = await response.json();
      
      if (result.success && result.data) {
        setProfile(result.data);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/expertos/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Perfil actualizado exitosamente');
        setIsEditing(false);
      } else {
        toast.error(result.error || 'Error al actualizar perfil');
      }
    } catch (error) {
      toast.error('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleIndustriaChange = (industria) => {
    setProfile(prev => ({
      ...prev,
      industrias: prev.industrias.includes(industria)
        ? prev.industrias.filter(i => i !== industria)
        : [...prev.industrias, industria]
    }));
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A3D7C] mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Mi Perfil Profesional</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? <FaEdit /> : <FaEdit />}
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Profesional *
              </label>
              <input
                type="text"
                value={profile.semblanza}
                onChange={(e) => setProfile({...profile, semblanza: e.target.value})}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Tu nombre profesional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Experiencia *
              </label>
              <select
                value={profile.gradoExperiencia}
                onChange={(e) => setProfile({...profile, gradoExperiencia: e.target.value})}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                {gradosExperiencia.map(grado => (
                  <option key={grado.value} value={grado.value}>
                    {grado.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Industrias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industrias de Especialización *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {industriasDisponibles.map(industria => (
                <label key={industria} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.industrias.includes(industria)}
                    onChange={() => handleIndustriaChange(industria)}
                    disabled={!isEditing}
                    className="mr-2"
                  />
                  <span className="text-sm">{industria}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categorías y Servicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorías de Servicio *
              </label>
              <textarea
                value={profile.categorias}
                onChange={(e) => setProfile({...profile, categorias: e.target.value})}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Ej: Desarrollo Web, Consultoría IT, Optimización SEO"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicios Específicos *
              </label>
              <textarea
                value={profile.servicios}
                onChange={(e) => setProfile({...profile, servicios: e.target.value})}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Ej: Desarrollo de aplicaciones web, Auditorías de seguridad"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción Profesional *
            </label>
            <textarea
              value={profile.descripcion}
              onChange={(e) => setProfile({...profile, descripcion: e.target.value})}
              disabled={!isEditing}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Describe tu experiencia, especialidades y enfoque profesional"
            />
          </div>

          {/* Información de Contacto */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={profile.telefono}
                  onChange={(e) => setProfile({...profile, telefono: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Ubicación
                </label>
                <input
                  type="text"
                  value={profile.ubicacion}
                  onChange={(e) => setProfile({...profile, ubicacion: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Ciudad, País"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaLinkedin className="inline mr-2" />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={profile.linkedin}
                  onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="https://linkedin.com/in/tu-perfil"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaGlobe className="inline mr-2" />
                  Sitio Web
                </label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile({...profile, website: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="https://tu-sitio-web.com"
                />
              </div>
            </div>
          </div>

          {/* Botón de Guardar */}
          {isEditing && (
            <div className="flex justify-end pt-6 border-t">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <FaSave />
                )}
                Guardar Perfil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 