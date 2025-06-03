"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function FormDiagnosticoCentral() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    informacionPersonal: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      puesto: ""
    },
    informacionEmpresa: {
      sector: "",
      nombreEmpresa: "",
      ubicacion: "",
      codigoPostal: "",
      ciudad: "",
      descripcionActividad: "",
      tieneEmpleados: false,
      numeroEmpleados: "",
      ventasAnuales: "",
      antiguedad: ""
    },
    proyectoObjetivos: {
      descripcionProyecto: "",
      objetivoConsultoria: "",
      importanciaAreas: {
        gestionFinanciera: 0,
        eficienciaOperativa: 0,
        talentoHumano: 0,
        ventasMarketing: 0,
        innovacion: 0,
        digitalizacion: 0,
        experienciaCliente: 0,
        gestionRiesgos: 0
      }
    },
    evaluacionAreas: {
      madurezDigital: {
        estrategiaDigital: 0,
        tecnologiasProcesos: 0,
        habilidadesDigitales: 0,
        analisisDatos: 0,
        tendenciasTecnologicas: 0
      },
      saludFinanciera: {
        flujoEfectivo: 0,
        margenesRentabilidad: 0,
        gestionCostos: 0,
        accesoFinanciamiento: 0,
        presupuesto: 0
      },
      eficienciaOperativa: {
        automatizacion: 0,
        flujoOperaciones: 0,
        calidadProductos: 0,
        mejoraContinua: 0,
        herramientasAutomatizacion: 0
      },
      recursosHumanos: {
        rotacionPersonal: 0,
        formacionDesarrollo: 0,
        climaLaboral: 0,
        alineacionObjetivos: 0,
        evaluacionDesempeno: 0
      },
      marketingVentas: {
        estrategiaMarketing: 0,
        conocimientoClientes: 0,
        canalesVenta: 0,
        diferenciacionMercado: 0,
        herramientasDigitales: 0
      },
      innovacionDesarrollo: {
        nuevosProductos: 0,
        culturaInnovacion: 0,
        investigacionDesarrollo: 0,
        adaptacionMercado: 0,
        colaboracionTerceros: 0
      },
      experienciaCliente: {
        feedbackClientes: 0,
        satisfaccionServicio: 0,
        personalizacion: 0,
        retencionClientes: 0,
        herramientasCRM: 0
      },
      gestionRiesgos: {
        identificacionRiesgos: 0,
        cumplimientoNormativo: 0,
        documentacion: 0,
        auditorias: 0,
        capacitacionCumplimiento: 0
      }
    }
  });

  const filterOnlyLetters = (value) => {
    return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1:
        // Validar información personal
        if (!formData.informacionPersonal.nombre) {
          newErrors.nombre = "El nombre es requerido";
        } else if (formData.informacionPersonal.nombre.length < 2) {
          newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
        } else if (/[0-9]/.test(formData.informacionPersonal.nombre)) {
          newErrors.nombre = "El nombre no puede contener números";
        }
        
        if (!formData.informacionPersonal.apellido) {
          newErrors.apellido = "El apellido es requerido";
        } else if (formData.informacionPersonal.apellido.length < 2) {
          newErrors.apellido = "El apellido debe tener al menos 2 caracteres";
        } else if (/[0-9]/.test(formData.informacionPersonal.apellido)) {
          newErrors.apellido = "El apellido no puede contener números";
        }
        
        if (!formData.informacionPersonal.email) {
          newErrors.email = "El email es requerido";
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.informacionPersonal.email)) {
          newErrors.email = "El formato del email no es válido. Debe incluir @ y un dominio válido";
        }
        
        if (!formData.informacionPersonal.telefono) {
          newErrors.telefono = "El teléfono es requerido";
        } else if (!/^[0-9]{10}$/.test(formData.informacionPersonal.telefono.replace(/\D/g, ''))) {
          newErrors.telefono = "El teléfono debe tener 10 dígitos numéricos";
        }
        
        if (!formData.informacionPersonal.puesto) {
          newErrors.puesto = "Debe seleccionar un puesto";
        }
        break;

      case 2:
        // Validar información de la empresa
        if (!formData.informacionEmpresa.sector) {
          newErrors.sector = "El sector es requerido";
        }
        
        if (!formData.informacionEmpresa.nombreEmpresa) {
          newErrors.nombreEmpresa = "El nombre de la empresa es requerido";
        } else if (formData.informacionEmpresa.nombreEmpresa.length < 2) {
          newErrors.nombreEmpresa = "El nombre de la empresa debe tener al menos 2 caracteres";
        }
        
        if (!formData.informacionEmpresa.ubicacion) {
          newErrors.ubicacion = "La ubicación es requerida";
        }
        
        if (!formData.informacionEmpresa.codigoPostal) {
          newErrors.codigoPostal = "El código postal es requerido";
        } else if (!/^\d{5}$/.test(formData.informacionEmpresa.codigoPostal)) {
          newErrors.codigoPostal = "El código postal debe tener 5 dígitos";
        }
        
        if (!formData.informacionEmpresa.ciudad) {
          newErrors.ciudad = "La ciudad es requerida";
        }
        
        if (!formData.informacionEmpresa.descripcionActividad) {
          newErrors.descripcionActividad = "La descripción de la actividad es requerida";
        } else if (formData.informacionEmpresa.descripcionActividad.length < 10) {
          newErrors.descripcionActividad = "La descripción debe tener al menos 10 caracteres";
        }
        
        if (formData.informacionEmpresa.tieneEmpleados && !formData.informacionEmpresa.numeroEmpleados) {
          newErrors.numeroEmpleados = "El número de empleados es requerido cuando la empresa tiene empleados";
        } else if (formData.informacionEmpresa.tieneEmpleados && formData.informacionEmpresa.numeroEmpleados < 1) {
          newErrors.numeroEmpleados = "El número de empleados debe ser mayor a 0";
        }
        
        if (!formData.informacionEmpresa.ventasAnuales) {
          newErrors.ventasAnuales = "Las ventas anuales son requeridas";
        } else if (formData.informacionEmpresa.ventasAnuales < 0) {
          newErrors.ventasAnuales = "Las ventas anuales no pueden ser negativas";
        }
        
        if (!formData.informacionEmpresa.antiguedad) {
          newErrors.antiguedad = "La antigüedad es requerida";
        } else if (formData.informacionEmpresa.antiguedad < 0) {
          newErrors.antiguedad = "La antigüedad no puede ser negativa";
        }
        break;

      case 3:
        // Validar proyecto y objetivos
        if (!formData.proyectoObjetivos.descripcionProyecto) {
          newErrors.descripcionProyecto = "La descripción del proyecto es requerida";
        } else if (formData.proyectoObjetivos.descripcionProyecto.length < 20) {
          newErrors.descripcionProyecto = "La descripción del proyecto debe tener al menos 20 caracteres";
        }
        
        if (!formData.proyectoObjetivos.objetivoConsultoria) {
          newErrors.objetivoConsultoria = "El objetivo de la consultoría es requerido";
        } else if (formData.proyectoObjetivos.objetivoConsultoria.length < 20) {
          newErrors.objetivoConsultoria = "El objetivo de la consultoría debe tener al menos 20 caracteres";
        }
        
        // Validar que todas las áreas de importancia tengan un valor
        Object.keys(formData.proyectoObjetivos.importanciaAreas).forEach(key => {
          if (formData.proyectoObjetivos.importanciaAreas[key] === undefined || 
              formData.proyectoObjetivos.importanciaAreas[key] === null || 
              formData.proyectoObjetivos.importanciaAreas[key] < 1) {
            newErrors[`importancia_${key}`] = "Debe seleccionar un valor mínimo de 1 para esta área";
          }
        });
        break;

      case 4:
        // Validar evaluación de áreas
        Object.keys(formData.evaluacionAreas).forEach(area => {
          Object.keys(formData.evaluacionAreas[area]).forEach(criterio => {
            if (formData.evaluacionAreas[area][criterio] === undefined || 
                formData.evaluacionAreas[area][criterio] === null || 
                formData.evaluacionAreas[area][criterio] < 1) {
              newErrors[`${area}_${criterio}`] = "Debe seleccionar un valor mínimo de 1 para este criterio";
            }
          });
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error("Por favor, completa todos los campos requeridos");
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleChange = (e, section, subsection = null) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      if (subsection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subsection]: {
              ...prev[section][subsection],
              [name]: type === 'checkbox' ? checked : value
            }
          }
        };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [name]: type === 'checkbox' ? checked : value
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      toast.error("Por favor, completa todos los campos requeridos");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/diagnostico-central", {
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
      router.refresh();
    } catch (error) {
      toast.error("Error al enviar el formulario");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Información Personal</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.informacionPersonal.nombre}
                onChange={(e) => {
                  const filteredValue = filterOnlyLetters(e.target.value);
                  handleChange({
                    target: {
                      name: 'nombre',
                      value: filteredValue
                    }
                  }, 'informacionPersonal');
                }}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Solo letras"
              />
              {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Apellido *</label>
              <input
                type="text"
                name="apellido"
                value={formData.informacionPersonal.apellido}
                onChange={(e) => {
                  const filteredValue = filterOnlyLetters(e.target.value);
                  handleChange({
                    target: {
                      name: 'apellido',
                      value: filteredValue
                    }
                  }, 'informacionPersonal');
                }}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.apellido ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Solo letras"
              />
              {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.informacionPersonal.email}
                onChange={(e) => handleChange(e, 'informacionPersonal')}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                value={formData.informacionPersonal.telefono}
                onChange={(e) => handleChange(e, 'informacionPersonal')}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.telefono ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Puesto *</label>
              <select
                name="puesto"
                value={formData.informacionPersonal.puesto}
                onChange={(e) => handleChange(e, 'informacionPersonal')}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.puesto ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccione un puesto</option>
                <option value="COO">COO</option>
                <option value="CEO">CEO</option>
                <option value="CTO">CTO</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.puesto && <p className="text-red-500 text-sm mt-1">{errors.puesto}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Información de la Empresa</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Sector o Industria *</label>
              <select
                name="sector"
                value={formData.informacionEmpresa.sector}
                onChange={(e) => handleChange(e, 'informacionEmpresa')}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.sector ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccione un sector</option>
                <option value="Aeroespacial">Aeroespacial</option>
                <option value="Automotriz">Automotriz</option>
                <option value="Bancario y Financiero">Bancario y Financiero</option>
                <option value="Construcción">Construcción</option>
                <option value="Educación">Educación</option>
                <option value="Energía">Energía</option>
                <option value="Entretenimiento">Entretenimiento</option>
                <option value="Farmacéutico">Farmacéutico</option>
                <option value="Hospitalidad y Turismo">Hospitalidad y Turismo</option>
                <option value="Inmobiliario">Inmobiliario</option>
                <option value="Legal">Legal</option>
                <option value="Manufactura">Manufactura</option>
                <option value="Medios de Comunicación">Medios de Comunicación</option>
                <option value="Minería">Minería</option>
                <option value="Petróleo y Gas">Petróleo y Gas</option>
                <option value="Retail">Retail</option>
                <option value="Salud">Salud</option>
                <option value="Servicios Profesionales">Servicios Profesionales</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Telecomunicaciones">Telecomunicaciones</option>
                <option value="Transporte y Logística">Transporte y Logística</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.sector && <p className="text-red-500 text-sm mt-1">{errors.sector}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de la Empresa *</label>
              <input
                type="text"
                name="nombreEmpresa"
                value={formData.informacionEmpresa.nombreEmpresa}
                onChange={(e) => handleChange(e, 'informacionEmpresa')}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.nombreEmpresa ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nombreEmpresa && <p className="text-red-500 text-sm mt-1">{errors.nombreEmpresa}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ubicación *</label>
              <input
                type="text"
                name="ubicacion"
                value={formData.informacionEmpresa.ubicacion}
                onChange={(e) => handleChange(e, 'informacionEmpresa')}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.ubicacion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Dirección completa"
              />
              {errors.ubicacion && <p className="text-red-500 text-sm mt-1">{errors.ubicacion}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Código Postal *</label>
              <input
                type="text"
                name="codigoPostal"
                value={formData.informacionEmpresa.codigoPostal}
                onChange={(e) => {
                  handleChange(e, 'informacionEmpresa');
                  // Aquí podríamos agregar la lógica para autocompletar la ciudad
                  // basado en el código postal
                }}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.codigoPostal ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="00000"
                maxLength="5"
              />
              {errors.codigoPostal && <p className="text-red-500 text-sm mt-1">{errors.codigoPostal}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ciudad *</label>
              <input
                type="text"
                name="ciudad"
                value={formData.informacionEmpresa.ciudad}
                onChange={(e) => handleChange(e, 'informacionEmpresa')}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.ciudad ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ciudad"
              />
              {errors.ciudad && <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción de la Actividad *</label>
              <textarea
                name="descripcionActividad"
                value={formData.informacionEmpresa.descripcionActividad}
                onChange={(e) => handleChange(e, 'informacionEmpresa')}
                rows="4"
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.descripcionActividad ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.descripcionActividad && <p className="text-red-500 text-sm mt-1">{errors.descripcionActividad}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">¿Tiene empleados? *</label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="tieneEmpleados"
                    checked={formData.informacionEmpresa.tieneEmpleados}
                    onChange={(e) => handleChange(e, 'informacionEmpresa')}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2">Sí</span>
                </label>
              </div>
            </div>

            {formData.informacionEmpresa.tieneEmpleados && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de Empleados *</label>
                <input
                  type="number"
                  name="numeroEmpleados"
                  value={formData.informacionEmpresa.numeroEmpleados}
                  onChange={(e) => handleChange(e, 'informacionEmpresa')}
                  className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                    errors.numeroEmpleados ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.numeroEmpleados && <p className="text-red-500 text-sm mt-1">{errors.numeroEmpleados}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Ventas Anuales *</label>
              <input
                type="number"
                name="ventasAnuales"
                value={formData.informacionEmpresa.ventasAnuales}
                onChange={(e) => handleChange(e, 'informacionEmpresa')}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.ventasAnuales ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.ventasAnuales && <p className="text-red-500 text-sm mt-1">{errors.ventasAnuales}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Antigüedad (años) *</label>
              <input
                type="number"
                name="antiguedad"
                value={formData.informacionEmpresa.antiguedad}
                onChange={(e) => handleChange(e, 'informacionEmpresa')}
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.antiguedad ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.antiguedad && <p className="text-red-500 text-sm mt-1">{errors.antiguedad}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Proyecto y Objetivos</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción del Proyecto *</label>
              <textarea
                name="descripcionProyecto"
                value={formData.proyectoObjetivos.descripcionProyecto}
                onChange={(e) => handleChange(e, 'proyectoObjetivos')}
                rows="4"
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.descripcionProyecto ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.descripcionProyecto && <p className="text-red-500 text-sm mt-1">{errors.descripcionProyecto}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Objetivo de la Consultoría *</label>
              <textarea
                name="objetivoConsultoria"
                value={formData.proyectoObjetivos.objetivoConsultoria}
                onChange={(e) => handleChange(e, 'proyectoObjetivos')}
                rows="4"
                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                  errors.objetivoConsultoria ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.objetivoConsultoria && <p className="text-red-500 text-sm mt-1">{errors.objetivoConsultoria}</p>}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Indique el nivel de importancia que tiene cada una de las siguientes áreas para su empresa en los próximos 12 meses, donde 1 es "Nada importante" y 5 es "Muy importante. </h3>
              
              {Object.entries(formData.proyectoObjetivos.importanciaAreas).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} *
                  </label>
                  <input
                    type="range"
                    name={key}
                    min="1"
                    max="5"
                    value={value}
                    onChange={(e) => handleChange(e, 'proyectoObjetivos', 'importanciaAreas')}
                    className={`mt-1 block w-full ${
                      errors[`importancia_${key}`] ? 'border-red-500' : ''
                    }`}
                    style={{
                      accentColor: '#BFD730'
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                  {errors[`importancia_${key}`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`importancia_${key}`]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Evaluación de Áreas</h2>
            
            {Object.entries(formData.evaluacionAreas).map(([area, criterios]) => (
              <div key={area} className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">
                  {area.charAt(0).toUpperCase() + area.slice(1).replace(/([A-Z])/g, ' $1')}
                </h3>
                
                {Object.entries(criterios).map(([criterio, value]) => (
                  <div key={criterio} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {criterio.charAt(0).toUpperCase() + criterio.slice(1).replace(/([A-Z])/g, ' $1')} *
                    </label>
                    <input
                      type="range"
                      name={criterio}
                      min="1"
                      max="5"
                      value={value}
                      onChange={(e) => handleChange(e, 'evaluacionAreas', area)}
                      className={`mt-1 block w-full ${
                        errors[`${area}_${criterio}`] ? 'border-red-500' : ''
                      }`}
                      style={{
                        accentColor: '#BFD730'
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                    {errors[`${area}_${criterio}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`${area}_${criterio}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Diagnóstico Central</h1>
          <div className="text-sm text-gray-500">
            Paso {currentStep} de 4
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%`, backgroundColor: '#BFD730' }}
          ></div>
        </div>
      </div>

      {renderStep()}

      <div className="mt-8 flex justify-between">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePreviousStep}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Anterior
          </button>
        )}
        
        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="ml-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Siguiente
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="ml-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Enviando..." : "Enviar formulario"}
          </button>
        )}
      </div>
    </form>
  );
} 