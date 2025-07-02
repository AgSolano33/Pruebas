"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const EditarExpertoPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    semblanza: "",
    industrias: [],
    categorias: "",
    gradoExperiencia: "",
    experienciaProfesional: "",
    serviciosPropuestos: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expertoId, setExpertoId] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/expertos?checkProfile=true");
          const data = await res.json();
          if (data.success && data.data) {
            setFormData({
              nombre: data.data.nombre || "",
              semblanza: data.data.semblanza || "",
              industrias: data.data.industrias || [],
              categorias: data.data.categorias || "",
              gradoExperiencia: data.data.gradoExperiencia || "",
              experienciaProfesional: data.data.experienciaProfesional || "",
              serviciosPropuestos: data.data.serviciosPropuestos || ""
            });
            setExpertoId(data.data._id);
          }
        } catch (e) {
          setError("Error al cargar el perfil");
        } finally {
          setIsLoading(false);
        }
      } else if (status === "unauthenticated") {
        setIsLoading(false);
      }
    };
    fetchPerfil();
  }, [status]);

  if (status === "loading" || isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }
  if (!session) {
    router.push("/login");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (industria) => {
    setFormData((prev) => {
      if (prev.industrias.includes(industria)) {
        return { ...prev, industrias: prev.industrias.filter((i) => i !== industria) };
      } else if (prev.industrias.length < 3) {
        return { ...prev, industrias: [...prev.industrias, industria] };
      } else {
        return prev;
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    if (!expertoId) {
      setError("No se encontró el perfil de experto");
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`/api/expertos/${expertoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Perfil actualizado exitosamente");
        setTimeout(() => router.push("/expertos"), 1200);
      } else {
        setError(data.error || "Error al actualizar");
      }
    } catch (e) {
      setError("Error al actualizar el perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <button
        type="button"
        onClick={() => router.push("/expertos")}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow"
      >
        ← Regresar a Expertos
      </button>
      <h1 className="text-2xl font-bold mb-6">Editar perfil de experto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nombre completo</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Semblanza</label>
          <textarea name="semblanza" value={formData.semblanza} onChange={handleInputChange} className="w-full border rounded px-3 py-2" rows={3} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Industrias (máx 3)</label>
          <div className="flex flex-wrap gap-2">
            {["Industrial Automation","Agriculture industry","Software and Tech Development","Biotechnology and Life Sciences","Food & Beverages","ClimateTech & Sustainability","Creative Industry & arts","Beauty and personal care","E-commerce","Health Services"].map((industria) => (
              <label key={industria} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={formData.industrias.includes(industria)}
                  onChange={() => handleCheckboxChange(industria)}
                  disabled={!formData.industrias.includes(industria) && formData.industrias.length >= 3}
                />
                {industria}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Categorías</label>
          <input type="text" name="categorias" value={formData.categorias} onChange={handleInputChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Grado de experiencia</label>
          <select name="gradoExperiencia" value={formData.gradoExperiencia} onChange={handleInputChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Selecciona tu nivel</option>
            <option value="junior">Junior (1-3 años)</option>
            <option value="mid-level">Mid-level (3-5 años)</option>
            <option value="senior">Senior (5-10 años)</option>
            <option value="expert">Expert (10+ años)</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Experiencia profesional</label>
          <textarea name="experienciaProfesional" value={formData.experienciaProfesional} onChange={handleInputChange} className="w-full border rounded px-3 py-2" rows={3} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Servicios propuestos</label>
          <textarea name="serviciosPropuestos" value={formData.serviciosPropuestos} onChange={handleInputChange} className="w-full border rounded px-3 py-2" rows={3} required />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button type="submit" disabled={isSubmitting} className="bg-[#1A3D7C] text-white px-4 py-2 rounded hover:bg-[#0f2a5a] disabled:opacity-50">
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
};

export default EditarExpertoPage; 