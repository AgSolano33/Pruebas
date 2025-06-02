"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function FormDiagnostico({ onSuccess }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // State to track the current step
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    genero: "",
    nivelEstudios: "",
    tipoEmpresa: "",
    nombreEmpresaProyecto: "",
    email: "",
    telefono: "",
    giroActividad: "",
    descripcionActividad: "",
    tieneEmpleados: "",
    numeroEmpleados: "",
    ventasAnualesEstimadas: "",
    mayorObstaculo: "",
    gestionDificultades: "",
    buenResultadoMetrica: "",
    objetivosAcciones: "",
    tipoAyuda: "",
    disponibleInvertir: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Handle form submission for the final step
    if (currentStep === 2) {
      try {
        const response = await fetch("/api/prediagnostico", {
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
          nombre: "",
          apellido: "",
          genero: "",
          nivelEstudios: "",
          tipoEmpresa: "",
          nombreEmpresaProyecto: "",
          email: "",
          telefono: "",
          giroActividad: "",
          descripcionActividad: "",
          tieneEmpleados: "",
          numeroEmpleados: "",
          ventasAnualesEstimadas: "",
          mayorObstaculo: "",
          gestionDificultades: "",
          buenResultadoMetrica: "",
          objetivosAcciones: "",
          tipoAyuda: "",
          disponibleInvertir: "",
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
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    // Validate first step fields
    const firstStepFields = [
      'nombre', 'apellido', 'genero', 'nivelEstudios', 'tipoEmpresa',
      'nombreEmpresaProyecto', 'email', 'telefono', 'giroActividad',
      'descripcionActividad', 'tieneEmpleados', 'ventasAnualesEstimadas'
    ];

    for (const field of firstStepFields) {
      if (!formData[field]) {
        toast.error(`Por favor, completa el campo ${field}`); // Show error for empty required field
        return; // Prevent moving to the next step
      }
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      toast.error('Por favor, ingresa un correo electrónico válido');
      return;
    }

    // If tieneEmpleados is 'si', also validate numeroEmpleados
    if (formData.tieneEmpleados === 'si' && !formData.numeroEmpleados) {
      toast.error('Por favor, indica el número de empleados.');
      return; 
    }

    // If all required fields are filled, move to the next step
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
     
      <div className="text-sm text-gray-600 mb-6 space-y-2">
        <p>1. Es importante que tus respuestas sean lo mas claras y precisas posibles, entre mas información tengamos, mejor ayuda seremos capaces de brindarte.</p>
        <p>2. Recuerda que nuestros eventos y programas se fondean en parte con fondos públicos que nos ayudan a hacerlos tan accesibles, tus datos no tienen ningún uso comercial mas allá de ofrecerte programas, talleres y experiencias que puedan ser de tu interés en nuestro ecosistema, así como con fines estadísticos para el estado.</p>
      </div>

      {/* Primera sección: Información General */}
      {currentStep === 1 && (
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-xl font-semibold mb-3" style={{ color: '#1A3D7C' }}>Información general</h3>
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="nombre"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="nombre"
              required
              type="text"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="apellido"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Apellido <span className="text-red-500">*</span>
            </label>
            <input
              id="apellido"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="apellido"
              required
              type="text"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="genero"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Genero <span className="text-red-500">*</span>
            </label>
            <select
              id="genero"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="genero"
              required
              value={formData.genero}
              onChange={handleChange}
            >
              <option value="">-Select-</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="prefiero no decir">Prefiero no decir</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="nivelEstudios"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nivel de estudios <span className="text-red-500">*</span>
            </label>
            <select
              id="nivelEstudios"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="nivelEstudios"
              required
              value={formData.nivelEstudios}
              onChange={handleChange}
            >
              <option value="">-Select-</option>
              <option value="primaria">Primaria</option>
              <option value="secundaria">Secundaria</option>
              <option value="bachilleres">Bachilleres</option>
              <option value="licenciatura">Licenciatura</option>
              <option value="maestria o superior">Maestría o superior</option>
              <option value="la escuela de la vida">La escuela de la vida</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="tipoEmpresa"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ¿Eres empresa o emprendedor independiente? <span className="text-red-500">*</span>
            </label>
            <select
              id="tipoEmpresa"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="tipoEmpresa"
              required
              value={formData.tipoEmpresa}
              onChange={handleChange}
            >
              <option value="">-Select-</option>
              <option value="empresa">Empresa</option>
              <option value="emprendedor">Emprendedor independiente</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="nombreEmpresaProyecto"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ¿Cómo se llama tu empresa o proyecto? <span className="text-red-500">*</span>
            </label>
            <input
              id="nombreEmpresaProyecto"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="nombreEmpresaProyecto"
              required
              type="text"
              placeholder="Nombre de empresa/proyecto"
              value={formData.nombreEmpresaProyecto}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
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
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="telefono"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="telefono"
              required
              type="Number"
              placeholder="Ej: 55 1234 5678"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="giroActividad"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ¿Cuál es el giro de tu actividad? <span className="text-red-500">*</span>
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
              Describe cual es tu actividad economica o que hace tu negocio <span className="text-red-500">*</span>
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

          <div>
            <label
              htmlFor="tieneEmpleados"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ¿Tienes empleados? <span className="text-red-500">*</span>
            </label>
            <select
              id="tieneEmpleados"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="tieneEmpleados"
              required
              value={formData.tieneEmpleados}
              onChange={handleChange}
            >
              <option value="">-Select-</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          {formData.tieneEmpleados === "si" && (
            <div>
              <label
                htmlFor="numeroEmpleados"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ¿Cuántos empleados tienes? <span className="text-red-500">*</span>
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
          )}

          <div>
            <label
              htmlFor="ventasAnualesEstimadas"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ventas anuales estimadas <span className="text-red-500">*</span>
            </label>
            <input
              id="ventasAnualesEstimadas"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="ventasAnualesEstimadas"
              required
              type="number"
              placeholder="Ej: 1000000"
              value={formData.ventasAnualesEstimadas}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNextStep}
              className="mt-4 px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Segunda sección: Diagnóstico */}
      {currentStep === 2 && (
        <div className="space-y-4 pt-6">
          <div>
            <label
              htmlFor="mayorObstaculo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Imagina que mañana pudieras eliminar el o los mayores obstáculos que hoy le impide a tu empresa alcanzar lo que ustedes llaman un "buen resultado" <span className="text-red-500">*</span>
            </label>
            <textarea
              id="mayorObstaculo"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="mayorObstaculo"
              required
              rows="4"
              placeholder="¿Cuál es ese obstáculo? ¿Por qué duele tanto (tiempo, dinero, reputación, oportunidades perdidas)? ¿Qué tan urgente es para ti resolverlo ?"
              value={formData.mayorObstaculo}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="gestionDificultades"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              En los procesos donde están enfrentando mayores dificultades, ¿cómo los están gestionando actualmente, qué soluciones han probado hasta ahora y qué los lleva a considerar qué es momento de hacer un cambio? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="gestionDificultades"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="gestionDificultades"
              required
              rows="4"
              value={formData.gestionDificultades}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="buenResultadoMetrica"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              En una sola respuesta, cuéntanos: (a) qué considera tu empresa un "buen resultado" hoy, (b) qué métrica(s) usan para comprobarlo y (c) qué dato o señal evidencia que, hasta ahora, no lo están logrando. <span className="text-red-500">*</span>
            </label>
            <textarea
              id="buenResultadoMetrica"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="buenResultadoMetrica"
              required
              rows="4"
              value={formData.buenResultadoMetrica}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="objetivosAcciones"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ¿Qué objetivos concretos quiere alcanzar la empresa en los próximos 6 meses y qué acciones se están llevando a cabo actualmente para lograrlos? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="objetivosAcciones"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="objetivosAcciones"
              required
              rows="4"
              value={formData.objetivosAcciones}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="tipoAyuda"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ¿Qué tipo de ayuda te gustaría? <span className="text-red-500">*</span>
            </label>
            <select
              id="tipoAyuda"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="tipoAyuda"
              required
              value={formData.tipoAyuda}
              onChange={handleChange}
            >
              <option value="">-Select-</option>
              <option value="taller/capacitacion">Taller/Capacitación</option>
              <option value="mentoria/consulturia">Mentoria/Consultoría</option>
              <option value="implementacion/automatizacion">Implementación/Automatización</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="disponibleInvertir"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ¿Estarías dispuesto en invertir para resolver esos retos que describiste anteriormente? <span className="text-red-500">*</span>
            </label>
            <select
              id="disponibleInvertir"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              name="disponibleInvertir"
              required
              value={formData.disponibleInvertir}
              onChange={handleChange}
            >
              <option value="">-Select-</option>
              <option value="no dispuesto">No estoy dispuesto a invertir</option>
              <option value="abiertos pero no se cuanto">Estamos abiertos a invertir pero no se cuanto</option>
              <option value="1-2%">Si, entre el 1% y 2% de mis utilidades</option>
              <option value="2-4%">Si, entre el 2% y 4% de mis utilidades</option>
              <option value="mas del 5%">Si, mas del 5% de mis utilidades</option>
            </select>
          </div>

          {/* Navigation buttons for the second section */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handlePreviousStep}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Anterior
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
            >
              {isLoading ? "Enviando..." : "Enviar formulario"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
} 