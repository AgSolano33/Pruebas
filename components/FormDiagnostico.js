"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import config from "@/config";

export default function FormDiagnostico({ onClose }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: session?.user?.nombre || "",
    apellido: session?.user?.apellido || "",
    nivelEstudios: "",
    tipoEmpresa: "",
    nombreEmpresaProyecto: "",
    email: session?.user?.email || "",
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
    genero: "",
  });

  useEffect(() => {
    if (!session) {
      router.push(config.auth.callbackUrl);
      return;
    }
  }, [session, router]);

  const filterOnlyLetters = (value) => {
    return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.nombre.trim()) {
        newErrors.nombre = "El nombre es requerido";
      } else if (/\d/.test(formData.nombre)) {
        newErrors.nombre = "El nombre no puede contener números";
      } else if (formData.nombre.trim().length < 2) {
        newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
      }
      
      if (!formData.apellido.trim()) {
        newErrors.apellido = "El apellido es requerido";
      } else if (/\d/.test(formData.apellido)) {
        newErrors.apellido = "El apellido no puede contener números";
      } else if (formData.apellido.trim().length < 2) {
        newErrors.apellido = "El apellido debe tener al menos 2 caracteres";
      }
      
      if (!formData.nivelEstudios) {
        newErrors.nivelEstudios = "Debes seleccionar un nivel de estudios";
      }

      if (!formData.tipoEmpresa) {
        newErrors.tipoEmpresa = "Debes seleccionar si eres empresa o emprendedor";
      }

      if (!formData.nombreEmpresaProyecto.trim()) {
        newErrors.nombreEmpresaProyecto = "El nombre de empresa o proyecto es requerido";
      }
      
      if (!formData.email.trim()) {
        newErrors.email = "El email es requerido";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Por favor, ingrese un email válido";
      }
      
      if (!formData.telefono.trim()) {
        newErrors.telefono = "El teléfono es requerido";
      } else if (!/^[0-9]{10}$/.test(formData.telefono.replace(/\D/g, ""))) {
        newErrors.telefono = "El teléfono debe tener 10 dígitos numéricos";
      }

      if (!formData.giroActividad.trim()) {
        newErrors.giroActividad = "El giro de actividad es requerido";
      }

      if (!formData.descripcionActividad.trim()) {
        newErrors.descripcionActividad = "La descripción de actividad es requerida";
      }
      
      if (!formData.tieneEmpleados) {
        newErrors.tieneEmpleados = "Este campo es requerido";
      }
      
      if (formData.tieneEmpleados === "si" && (!formData.numeroEmpleados || formData.numeroEmpleados <= 0)) {
        newErrors.numeroEmpleados = "Debes especificar el número de empleados y debe ser mayor a 0";
      }
      
      if (!formData.ventasAnualesEstimadas || formData.ventasAnualesEstimadas < 0) {
        newErrors.ventasAnualesEstimadas = "Las ventas anuales estimadas son requeridas y no pueden ser negativas";
      }
    }
    
    if (currentStep === 2) {
      if (!formData.mayorObstaculo.trim()) {
        newErrors.mayorObstaculo = "Este campo es requerido";
      }
      if (!formData.gestionDificultades.trim()) {
        newErrors.gestionDificultades = "Este campo es requerido";
      }
      if (!formData.buenResultadoMetrica.trim()) {
        newErrors.buenResultadoMetrica = "Este campo es requerido";
      }
      if (!formData.objetivosAcciones.trim()) {
        newErrors.objetivosAcciones = "Este campo es requerido";
      }
      if (!formData.tipoAyuda) {
        newErrors.tipoAyuda = "Debes seleccionar un tipo de ayuda";
      }
      if (!formData.disponibleInvertir) {
        newErrors.disponibleInvertir = "Debes seleccionar tu disposición a invertir";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      router.push(config.auth.callbackUrl);
      return;
    }

    setIsLoading(true);
    try {
      console.log('1. Enviando pre-diagnóstico a la API...');
      // 1. Guardar el pre-diagnóstico
      const response = await fetch(`/api/prediagnostico?userId=${session.user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al guardar pre-diagnóstico:', errorData);
        throw new Error(errorData.error || "Error al guardar el pre-diagnóstico");
      }

      const savedPrediagnostico = await response.json();
      console.log('2. Pre-diagnóstico guardado:', savedPrediagnostico);

      // 2. Enviar a ChatGPT para análisis
      console.log('3. Enviando pre-diagnóstico a ChatGPT para análisis...');
      const chatGPTResponse = await fetch('/api/chatgp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...savedPrediagnostico,
          userId: session.user.id
        }),
      });

      if (!chatGPTResponse.ok) {
        const errorData = await chatGPTResponse.json();
        console.error('Error en análisis de ChatGPT:', errorData);
        throw new Error(errorData.error || "Error al procesar el análisis con ChatGPT");
      }

      const analysisResult = await chatGPTResponse.json();
      console.log('4. Análisis de ChatGPT completado:', analysisResult);

      toast.success("Pre-diagnóstico creado y analizado exitosamente");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al procesar el pre-diagnóstico");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // Handle specific filtering if needed, like filterOnlyLetters for name/apellido
      if (name === 'nombre' || name === 'apellido') {
        return {
          ...prev,
          [name]: filterOnlyLetters(value)
        };
      } else if (name === 'numeroEmpleados' || name === 'ventasAnualesEstimadas') {
         // Ensure number fields are treated as numbers
        return {
           ...prev,
           [name]: value === '' ? '' : Number(value) // Store empty string or number
         };
      }
      
      return {
        ...prev,
        [name]: value
      };
    });
    
    // Clear the error for the field being changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    } else {
       // Optional: show a toast notification if validation fails on next
       toast.error("Por favor, completa los campos requeridos antes de continuar.");
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({}); // Clear errors when going back a step
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-left mb-6" style={{ color: '#00AEEF' }}>
     Pre-diagnóstico
      </h2>

      <div className="text-sm text-gray-600 mb-6 space-y-2">
        <p>Es fundamental que tus respuestas sean lo más claras y específicas posibles. Esto nos ayuda a entender tu problema de manera más efectiva y, por ende, a darte una mejor solución.</p>
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
              className={`mt-1 block w-full rounded-md border-2 ${errors.nombre ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="nombre"
              required
              type="text"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
             {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
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
              className={`mt-1 block w-full rounded-md border-2 ${errors.apellido ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="apellido"
              required
              type="text"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
            />
            {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
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
              className={`mt-1 block w-full rounded-md border-2 ${errors.nivelEstudios ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
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
             {errors.nivelEstudios && <p className="text-red-500 text-sm mt-1">{errors.nivelEstudios}</p>}
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
              className={`mt-1 block w-full rounded-md border-2 ${errors.tipoEmpresa ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="tipoEmpresa"
              required
              value={formData.tipoEmpresa}
              onChange={handleChange}
            >
              <option value="">-Select-</option>
              <option value="empresa">Empresa</option>
              <option value="emprendedor">Emprendedor independiente</option>
            </select>
             {errors.tipoEmpresa && <p className="text-red-500 text-sm mt-1">{errors.tipoEmpresa}</p>}
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
              className={`mt-1 block w-full rounded-md border-2 ${errors.nombreEmpresaProyecto ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="nombreEmpresaProyecto"
              required
              type="text"
              placeholder="Nombre de empresa/proyecto"
              value={formData.nombreEmpresaProyecto}
              onChange={handleChange}
            />
             {errors.nombreEmpresaProyecto && <p className="text-red-500 text-sm mt-1">{errors.nombreEmpresaProyecto}</p>}
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
              className={`mt-1 block w-full rounded-md border-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="email"
              required
              type="email"
              placeholder="Ej: contacto@miempresa.com"
              value={formData.email}
              onChange={handleChange}
            />
             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genero">
              Género
            </label>
            <select
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="prefiero no decir">Prefiero no decir</option>
            </select>
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
              className={`mt-1 block w-full rounded-md border-2 ${errors.telefono ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="telefono"
              required
              type="Number"
              placeholder="Ej: 55 1234 5678"
              value={formData.telefono}
              onChange={handleChange}
            />
             {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
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
              className={`mt-1 block w-full rounded-md border-2 ${errors.giroActividad ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="giroActividad"
              required
              type="text"
              placeholder="Ej: Tecnología y Desarrollo de Software"
              value={formData.giroActividad}
              onChange={handleChange}
            />
             {errors.giroActividad && <p className="text-red-500 text-sm mt-1">{errors.giroActividad}</p>}
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
              className={`mt-1 block w-full rounded-md border-2 ${errors.descripcionActividad ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="descripcionActividad"
              required
              rows="4"
              placeholder="Ej: Desarrollamos soluciones tecnológicas para empresas, incluyendo aplicaciones web, móviles y sistemas de gestión empresarial."
              value={formData.descripcionActividad}
              onChange={handleChange}
            />
             {errors.descripcionActividad && <p className="text-red-500 text-sm mt-1">{errors.descripcionActividad}</p>}
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
              className={`mt-1 block w-full rounded-md border-2 ${errors.tieneEmpleados ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="tieneEmpleados"
              required
              value={formData.tieneEmpleados}
              onChange={handleChange}
            >
              <option value="">-Select-</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
             {errors.tieneEmpleados && <p className="text-red-500 text-sm mt-1">{errors.tieneEmpleados}</p>}
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
                className={`mt-1 block w-full rounded-md border-2 ${errors.numeroEmpleados ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
                name="numeroEmpleados"
                required
                type="number"
                placeholder="Ej: 25"
                value={formData.numeroEmpleados}
                onChange={handleChange}
              />
               {errors.numeroEmpleados && <p className="text-red-500 text-sm mt-1">{errors.numeroEmpleados}</p>}
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
              className={`mt-1 block w-full rounded-md border-2 ${errors.ventasAnualesEstimadas ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="ventasAnualesEstimadas"
              required
              type="number"
              placeholder="Ej: 1000000"
              value={formData.ventasAnualesEstimadas}
              onChange={handleChange}
            />
             {errors.ventasAnualesEstimadas && <p className="text-red-500 text-sm mt-1">{errors.ventasAnualesEstimadas}</p>}
          </div>

          {/* Navigation button for the first section */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Segunda sección: Preguntas del Prediagnóstico */}
      {currentStep === 2 && (
        <div className="space-y-4 pt-6">
           <div>
            <label
              htmlFor="mayorObstaculo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ¿Cuál es el mayor obstáculo que estás enfrentando y cómo afecta tu negocio/proyecto en términos de tiempo, dinero, y oportunidades? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="mayorObstaculo"
              className={`mt-1 block w-full rounded-md border-2 ${errors.mayorObstaculo ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="mayorObstaculo"
              required
              rows="4"
              placeholder="¿Qué obstáculo principal está impidiendo que tu empresa alcance los resultados esperados? ¿Cómo impacta este problema en tiempo, dinero, reputación y oportunidades? ¿Qué tan urgente es para ti solucionarlo?"
              value={formData.mayorObstaculo}
              onChange={handleChange}
            />
            {errors.mayorObstaculo && <p className="text-red-500 text-sm mt-1">{errors.mayorObstaculo}</p>}
           </div>

           <div>
            <label
              htmlFor="gestionDificultades"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ¿Qué has intentado hacer para resolver este problema y qué resultados has obtenido hasta ahora? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="gestionDificultades"
              className={`mt-1 block w-full rounded-md border-2 ${errors.gestionDificultades ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="gestionDificultades"
              required
              rows="4"
              placeholder="Cuéntanos qué soluciones o acciones ya probaste, qué funcionó o no, y qué aprendiste de eso. Esto nos ayudará a no proponer lo que ya intentaste sin éxito."
              value={formData.gestionDificultades}
              onChange={handleChange}
            />
            {errors.gestionDificultades && <p className="text-red-500 text-sm mt-1">{errors.gestionDificultades}</p>}
           </div>

           <div>
            <label
              htmlFor="buenResultadoMetrica"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ¿Cómo te diste cuenta que ese "algo" no estaba funcionando como debería? ¿Qué señales o datos te muestran que hay que hacer un cambio pronto? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="buenResultadoMetrica"
              className={`mt-1 block w-full rounded-md border-2 ${errors.buenResultadoMetrica ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="buenResultadoMetrica"
              required
              rows="4"
              placeholder="Queremos entender qué te hace darte cuenta de que algo no va bien: ¿bajan las ventas?, ¿clientes insatisfechos?, ¿el equipo está frustrado?, ¿procesos lentos?"
              value={formData.buenResultadoMetrica}
              onChange={handleChange}
            />
            {errors.buenResultadoMetrica && <p className="text-red-500 text-sm mt-1">{errors.buenResultadoMetrica}</p>}
           </div>

           <div>
            <label
              htmlFor="objetivosAcciones"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Imagina que tu problema se resolviera el dia de mañana ¿En que te fijarías para poder decir que está resuelto? ¿Cúal sería el indicador de éxito? ¿En cuanto tiempo? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="objetivosAcciones"
              className={`mt-1 block w-full rounded-md border-2 ${errors.objetivosAcciones ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
              name="objetivosAcciones"
              required
              rows="4"
              placeholder="Trata de imaginar el escenario ideal, que sería lo que te guastaría que pasara con tu problema, que llamarías un 'buen resultado'"
              value={formData.objetivosAcciones}
              onChange={handleChange}
            />
            {errors.objetivosAcciones && <p className="text-red-500 text-sm mt-1">{errors.objetivosAcciones}</p>}
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
              className={`mt-1 block w-full rounded-md border-2 ${errors.tipoAyuda ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
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
            {errors.tipoAyuda && <p className="text-red-500 text-sm mt-1">{errors.tipoAyuda}</p>}
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
              className={`mt-1 block w-full rounded-md border-2 ${errors.disponibleInvertir ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2`}
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
            {errors.disponibleInvertir && <p className="text-red-500 text-sm mt-1">{errors.disponibleInvertir}</p>}
           </div>

           {/* Navigation buttons for the second section (Submit) */}
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