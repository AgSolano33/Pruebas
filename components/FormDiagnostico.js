"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function FormDiagnostico({ onSuccess }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombreEmpresa: "",
    tipoEmpresa: "",
    nombreContacto: "",
    email: "",
    telefono: "",
    numeroEmpleados: "",
    giroActividad: "",
    descripcionActividad: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/diagnostico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el formulario");
      }

      toast.success("Formulario enviado correctamente");
      setFormData({
        nombreEmpresa: "",
        tipoEmpresa: "",
        nombreContacto: "",
        email: "",
        telefono: "",
        numeroEmpleados: "",
        giroActividad: "",
        descripcionActividad: "",
      });
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Error al enviar el formulario");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="nombreEmpresa"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nombre de empresa/proyecto
        </label>
        <input
          id="nombreEmpresa"
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          name="nombreEmpresa"
          required
          type="text"
          placeholder="Ej: Mi Empresa S.A. de C.V."
          value={formData.nombreEmpresa}
          onChange={handleChange}
        />
      </div>

      <div>
        <label
          htmlFor="tipoEmpresa"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tipo de empresa
        </label>
        <select
          id="tipoEmpresa"
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          name="tipoEmpresa"
          required
          value={formData.tipoEmpresa}
          onChange={handleChange}
        >
          <option value="">Seleccione una opción</option>
          <option value="empresa">Empresa</option>
          <option value="emprendedor">Emprendedor independiente</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="nombreContacto"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nombre del contacto
        </label>
        <input
          id="nombreContacto"
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          name="nombreContacto"
          required
          type="text"
          placeholder="Ej: Nombre"
          value={formData.nombreContacto}
          onChange={handleChange}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          name="email"
          required
          type="email"
          placeholder="Ej: contacto@miempresa.com"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label
          htmlFor="telefono"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Teléfono
        </label>
        <input
          id="telefono"
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          name="telefono"
          required
          type="number"
          placeholder="Ej: 55 1234 5678"
          value={formData.telefono}
          onChange={handleChange}
        />
      </div>

      <div>
        <label
          htmlFor="numeroEmpleados"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Número de empleados
        </label>
        <input
          id="numeroEmpleados"
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          name="numeroEmpleados"
          required
          type="number"
          placeholder="Ej: 25"
          value={formData.numeroEmpleados}
          onChange={handleChange}
        />
      </div>

      <div>
        <label
          htmlFor="giroActividad"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Giro de actividad
        </label>
        <input
          id="giroActividad"
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          name="giroActividad"
          required
          type="text"
          placeholder="Ej: Tecnología y Desarrollo de Software"
          value={formData.giroActividad}
          onChange={handleChange}
        />
      </div>

      <div>
        <label
          htmlFor="descripcionActividad"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Descripción de la actividad económica
        </label>
        <textarea
          id="descripcionActividad"
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          name="descripcionActividad"
          required
          rows="4"
          placeholder="Ej: Desarrollamos soluciones tecnológicas para empresas, incluyendo aplicaciones web, móviles y sistemas de gestión empresarial."
          value={formData.descripcionActividad}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border-2 border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
      >
        {isLoading ? "Enviando..." : "Enviar formulario"}
      </button>
    </form>
  );
} 