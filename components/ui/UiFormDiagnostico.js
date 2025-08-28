"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import config from "@/config";

export default function UiFormDiagnostico({ onClose }) {
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
    
    // Pre-llenar con datos del primer pre-diagnóstico si existe
    const loadPrediagnosticoData = async () => {
      try {
        const response = await fetch(`/api/prediagnostico/${session.user.id}`);
        if (response.ok) {
          const prediagnosticos = await response.json();
          if (prediagnosticos && prediagnosticos.length > 0) {
            const primerPrediagnostico = prediagnosticos[0]; // Tomar el más reciente
            console.log('Pre-llenando formulario de pre-diagnóstico con datos existentes:', primerPrediagnostico);
            
            setFormData(prev => ({
              ...prev,
              nombre: primerPrediagnostico.nombre || session?.user?.nombre || "",
              apellido: primerPrediagnostico.apellido || session?.user?.apellido || "",
              nivelEstudios: primerPrediagnostico.nivelEstudios || "",
              tipoEmpresa: primerPrediagnostico.tipoEmpresa || "",
              nombreEmpresaProyecto: primerPrediagnostico.nombreEmpresaProyecto || "",
              email: primerPrediagnostico.email || session?.user?.email || "",
              telefono: (primerPrediagnostico.telefono || "").toString(),
              giroActividad: primerPrediagnostico.giroActividad || "",
              descripcionActividad: primerPrediagnostico.descripcionActividad || "",
              tieneEmpleados: primerPrediagnostico.tieneEmpleados || "",
              numeroEmpleados: primerPrediagnostico.numeroEmpleados || "",
              ventasAnualesEstimadas: primerPrediagnostico.ventasAnualesEstimadas || "",
              mayorObstaculo: primerPrediagnostico.mayorObstaculo || "",
              gestionDificultades: primerPrediagnostico.gestionDificultades || "",
              buenResultadoMetrica: primerPrediagnostico.buenResultadoMetrica || "",
              objetivosAcciones: primerPrediagnostico.objetivosAcciones || "",
              tipoAyuda: primerPrediagnostico.tipoAyuda || "",
              disponibleInvertir: primerPrediagnostico.disponibleInvertir || "",
              genero: primerPrediagnostico.genero || ""
            }));
          }
        }
      } catch (error) {
        console.error('Error al cargar datos del pre-diagnóstico:', error);
      }
    };
    
    loadPrediagnosticoData();
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
      
      if (!formData.telefono || !formData.telefono.toString().trim()) {
        newErrors.telefono = "El teléfono es requerido";
      } else if (!/^[0-9]{10}$/.test(formData.telefono.toString().replace(/\D/g, ""))) {
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
      const response = await fetch(`/api/prediagnostico/${session.user.id}`, {
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
      } else if (name === 'telefono') {
        // Only allow numbers and limit to 10 digits
        const numericValue = value.replace(/\D/g, '').slice(0, 10);
        return {
          ...prev,
          [name]: numericValue
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

  // ... el resto del archivo sigue igual ... 
} 