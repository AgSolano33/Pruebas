"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function ProviderProfile() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    // Información Personal
    nombre: "",
    email: "",
    telefono: "",
    ubicacion: "",
    linkedin: "",
    website: "",
    
    // Información Profesional
    semblanza: "",
    gradoExperiencia: "mid-level", // junior, mid-level, senior, expert
    experienciaAnos: "",
    
    // Industrias y Categorías
    industrias: [],
    categorias: [],
    
    // Habilidades y Especialidades
    habilidades: [],
    especialidades: [],
    
    // Experiencia Profesional
    experienciaProfesional: "",
    proyectosDestacados: "",
    
    // Servicios Ofrecidos
    serviciosPropuestos: "",
    tarifas: "",
    
    // Certificaciones y Educación
    certificaciones: [],
    educacion: "",
    
    // Disponibilidad
    disponibilidad: "part-time", // full-time, part-time, freelance
    horariosDisponibles: "",
    
    // Preferencias de Proyectos
    tiposProyectos: [], // desarrollo, consultoria, auditoria, implementacion, etc.
    tamanosProyectos: [], // pequeno, mediano, grande
    modalidadTrabajo: [], // remoto, presencial, hibrido
  });

  const industriasDisponibles = [
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
  ];

  const habilidadesDisponibles = [
    "Gestión de Proyectos",
    "Análisis de Datos",
    "Desarrollo de Software",
    "Consultoría Estratégica",
    "Auditoría de Procesos",
    "Implementación de Sistemas",
    "Optimización de Procesos",
    "Automatización",
    "Machine Learning",
    "Inteligencia Artificial",
    "Blockchain",
    "Cloud Computing",
    "DevOps",
    "Cybersecurity",
    "UX/UI Design",
    "Marketing Digital",
    "Finanzas Corporativas",
    "Recursos Humanos",
    "Logística",
    "Sostenibilidad"
  ];

  const tiposProyectosDisponibles = [
    "Desarrollo de Software",
    "Consultoría Estratégica",
    "Auditoría de Procesos",
    "Implementación de Sistemas",
    "Optimización de Procesos",
    "Automatización Industrial",
    "Análisis de Datos",
    "Machine Learning",
    "Transformación Digital",
    "Gestión de Cambio",
    "Formación y Capacitación",
    "Investigación y Desarrollo"
  ];

  const tamanosProyectosDisponibles = [
    "Pequeño (1-3 meses)",
    "Mediano (3-6 meses)",
    "Grande (6+ meses)"
  ];

  const modalidadesTrabajoDisponibles = [
    "Remoto",
    "Presencial",
    "Híbrido"
  ];

  useEffect(() => {
    fetchProfile();
  }, [session]);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch('/api/expertos/profile');
      const result = await response.json();
      
      if (result.success && result.data) {
        setProfile({
          nombre: result.data.nombre || "",
          email: result.data.email || "",
          telefono: result.data.telefono || "",
          ubicacion: result.data.ubicacion || "",
          linkedin: result.data.linkedin || "",
          website: result.data.website || "",
          semblanza: result.data.semblanza || "",
          gradoExperiencia: result.data.gradoExperiencia || "mid-level",
          experienciaAnos: result.data.experienciaAnos || "",
          industrias: result.data.industrias || [],
          categorias: result.data.categorias || [],
          habilidades: result.data.habilidades || [],
          especialidades: result.data.especialidades || [],
          experienciaProfesional: result.data.experienciaProfesional || "",
          proyectosDestacados: result.data.proyectosDestacados || "",
          serviciosPropuestos: result.data.serviciosPropuestos || "",
          tarifas: result.data.tarifas || "",
          certificaciones: result.data.certificaciones || [],
          educacion: result.data.educacion || "",
          disponibilidad: result.data.disponibilidad || "part-time",
          horariosDisponibles: result.data.horariosDisponibles || "",
          tiposProyectos: result.data.tiposProyectos || [],
          tamanosProyectos: result.data.tamanosProyectos || [],
          modalidadTrabajo: result.data.modalidadTrabajo || []
        });
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      return;
    }
    
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
        // Recargar el dashboard para actualizar el estado
        window.location.reload();
      } else {
        toast.error(result.error || 'Error al actualizar perfil');
      }
    } catch (error) {
      toast.error('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, action = 'toggle') => {
    setProfile(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...prev[field], value]
        : action === 'remove'
        ? prev[field].filter(item => item !== value)
        : prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleArrayInput = (field, value) => {
    if (value.trim() && !profile[field].includes(value.trim())) {
      handleArrayChange(field, value.trim(), 'add');
    }
  };

  const removeArrayItem = (field, item) => {
    handleArrayChange(field, item, 'remove');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mi Perfil Profesional</h2>
          <p className="text-gray-600">Completa tu perfil para recibir propuestas de proyectos compatibles</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Perfil'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Editar Perfil
            </button>
          )}
        </div>
      </div>

      {/* Información Personal */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              value={profile.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="tel"
              value={profile.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input
              type="text"
              value={profile.ubicacion}
              onChange={(e) => handleInputChange('ubicacion', e.target.value)}
              disabled={!isEditing}
              placeholder="Ciudad, País"
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input
              type="url"
              value={profile.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              disabled={!isEditing}
              placeholder="https://linkedin.com/in/tu-perfil"
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={profile.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              disabled={!isEditing}
              placeholder="https://tu-website.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Información Profesional */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Profesional</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semblanza Profesional</label>
            <textarea
              value={profile.semblanza}
              onChange={(e) => handleInputChange('semblanza', e.target.value)}
              disabled={!isEditing}
              rows={4}
              placeholder="Describe tu experiencia profesional, especialidades y enfoque de trabajo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grado de Experiencia</label>
              <select
                value={profile.gradoExperiencia}
                onChange={(e) => handleInputChange('gradoExperiencia', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
              >
                <option value="junior">Junior (0-2 años)</option>
                <option value="mid-level">Mid-Level (3-5 años)</option>
                <option value="senior">Senior (6-10 años)</option>
                <option value="expert">Expert (10+ años)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Años de Experiencia</label>
              <input
                type="number"
                value={profile.experienciaAnos}
                onChange={(e) => handleInputChange('experienciaAnos', e.target.value)}
                disabled={!isEditing}
                min="0"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Industrias y Categorías */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Industrias y Categorías</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industrias de Especialización</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {industriasDisponibles.map((industria) => (
                <label key={industria} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.industrias.includes(industria)}
                    onChange={() => handleArrayChange('industrias', industria)}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{industria}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categorías de Servicio</label>
            <input
              type="text"
              value={profile.categorias}
              onChange={(e) => handleInputChange('categorias', e.target.value)}
              disabled={!isEditing}
              placeholder="Ej: Consultoría Estratégica, Desarrollo de Software, Análisis de Datos"
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Habilidades y Especialidades */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Habilidades y Especialidades</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Habilidades Técnicas</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {habilidadesDisponibles.map((habilidad) => (
                <label key={habilidad} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.habilidades.includes(habilidad)}
                    onChange={() => handleArrayChange('habilidades', habilidad)}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{habilidad}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Especialidades Adicionales</label>
            <div className="space-y-2">
              {profile.especialidades.map((especialidad, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={especialidad}
                    onChange={(e) => {
                      const newEspecialidades = [...profile.especialidades];
                      newEspecialidades[index] = e.target.value;
                      handleInputChange('especialidades', newEspecialidades);
                    }}
                    disabled={!isEditing}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                  />
                  {isEditing && (
                    <button
                      onClick={() => removeArrayItem('especialidades', especialidad)}
                      className="px-2 py-2 text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() => handleArrayChange('especialidades', '', 'add')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Agregar especialidad
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Experiencia Profesional */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiencia Profesional</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experiencia Profesional Detallada</label>
            <textarea
              value={profile.experienciaProfesional}
              onChange={(e) => handleInputChange('experienciaProfesional', e.target.value)}
              disabled={!isEditing}
              rows={6}
              placeholder="Describe tu experiencia profesional, roles anteriores, responsabilidades principales..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proyectos Destacados</label>
            <textarea
              value={profile.proyectosDestacados}
              onChange={(e) => handleInputChange('proyectosDestacados', e.target.value)}
              disabled={!isEditing}
              rows={4}
              placeholder="Describe los proyectos más importantes en los que has trabajado, resultados obtenidos..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Servicios y Tarifas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Servicios y Tarifas</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Servicios que Ofreces</label>
            <textarea
              value={profile.serviciosPropuestos}
              onChange={(e) => handleInputChange('serviciosPropuestos', e.target.value)}
              disabled={!isEditing}
              rows={4}
              placeholder="Describe los servicios específicos que ofreces, metodologías que utilizas..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estructura de Tarifas</label>
            <textarea
              value={profile.tarifas}
              onChange={(e) => handleInputChange('tarifas', e.target.value)}
              disabled={!isEditing}
              rows={3}
              placeholder="Describe tu estructura de tarifas, rangos de precios, modalidades de pago..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Certificaciones y Educación */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificaciones y Educación</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificaciones</label>
            <div className="space-y-2">
              {profile.certificaciones.map((certificacion, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={certificacion}
                    onChange={(e) => {
                      const newCertificaciones = [...profile.certificaciones];
                      newCertificaciones[index] = e.target.value;
                      handleInputChange('certificaciones', newCertificaciones);
                    }}
                    disabled={!isEditing}
                    placeholder="Nombre de la certificación"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
                  />
                  {isEditing && (
                    <button
                      onClick={() => removeArrayItem('certificaciones', certificacion)}
                      className="px-2 py-2 text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() => handleArrayChange('certificaciones', '', 'add')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Agregar certificación
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Educación</label>
            <textarea
              value={profile.educacion}
              onChange={(e) => handleInputChange('educacion', e.target.value)}
              disabled={!isEditing}
              rows={3}
              placeholder="Describe tu formación académica, títulos, cursos relevantes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Disponibilidad */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Disponibilidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Disponibilidad</label>
            <select
              value={profile.disponibilidad}
              onChange={(e) => handleInputChange('disponibilidad', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            >
              <option value="full-time">Tiempo Completo</option>
              <option value="part-time">Tiempo Parcial</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horarios Disponibles</label>
            <input
              type="text"
              value={profile.horariosDisponibles}
              onChange={(e) => handleInputChange('horariosDisponibles', e.target.value)}
              disabled={!isEditing}
              placeholder="Ej: Lunes a Viernes 9AM-6PM"
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Preferencias de Proyectos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias de Proyectos</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipos de Proyectos</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tiposProyectosDisponibles.map((tipo) => (
                <label key={tipo} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.tiposProyectos.includes(tipo)}
                    onChange={() => handleArrayChange('tiposProyectos', tipo)}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{tipo}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tamaños de Proyectos</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {tamanosProyectosDisponibles.map((tamano) => (
                <label key={tamano} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.tamanosProyectos.includes(tamano)}
                    onChange={() => handleArrayChange('tamanosProyectos', tamano)}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{tamano}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad de Trabajo</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {modalidadesTrabajoDisponibles.map((modalidad) => (
                <label key={modalidad} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profile.modalidadTrabajo.includes(modalidad)}
                    onChange={() => handleArrayChange('modalidadTrabajo', modalidad)}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{modalidad}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 