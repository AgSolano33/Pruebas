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
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.informacionPersonal.email)) {
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
          newErrors.objetivoConsultoria = "El objetivo debe tener al menos 20 caracteres";
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleChange = (e, section, subsection = null) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev };
      if (subsection) {
        newData[section][subsection][name] = type === 'checkbox' ? checked : value;
      } else {
        newData[section][name] = type === 'checkbox' ? checked : value;
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/diagnostico-central', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar el diagnóstico');
      }
      
      toast.success('Diagnóstico guardado exitosamente');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar el diagnóstico');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Información Personal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.informacionPersonal.nombre}
                  onChange={(e) => handleChange(e, 'informacionPersonal')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese su nombre"
                />
                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.informacionPersonal.apellido}
                  onChange={(e) => handleChange(e, 'informacionPersonal')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese su apellido"
                />
                {errors.apellido && <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.informacionPersonal.email}
                  onChange={(e) => handleChange(e, 'informacionPersonal')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ejemplo@correo.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.informacionPersonal.telefono}
                  onChange={(e) => handleChange(e, 'informacionPersonal')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1234567890"
                />
                {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Puesto</label>
                <select
                  name="puesto"
                  value={formData.informacionPersonal.puesto}
                  onChange={(e) => handleChange(e, 'informacionPersonal')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Seleccione un puesto</option>
                  <option value="director">Director</option>
                  <option value="gerente">Gerente</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.puesto && <p className="mt-1 text-sm text-red-600">{errors.puesto}</p>}
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de la Empresa</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                <select
                  name="sector"
                  value={formData.informacionEmpresa.sector}
                  onChange={(e) => handleChange(e, 'informacionEmpresa')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Seleccione un sector</option>
                  <option value="servicios">Servicios</option>
                  <option value="comercio">Comercio</option>
                  <option value="manufactura">Manufactura</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.sector && <p className="mt-1 text-sm text-red-600">{errors.sector}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa</label>
                <input
                  type="text"
                  name="nombreEmpresa"
                  value={formData.informacionEmpresa.nombreEmpresa}
                  onChange={(e) => handleChange(e, 'informacionEmpresa')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese el nombre de la empresa"
                />
                {errors.nombreEmpresa && <p className="mt-1 text-sm text-red-600">{errors.nombreEmpresa}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.informacionEmpresa.ubicacion}
                  onChange={(e) => handleChange(e, 'informacionEmpresa')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese la ubicación"
                />
                {errors.ubicacion && <p className="mt-1 text-sm text-red-600">{errors.ubicacion}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                <input
                  type="text"
                  name="codigoPostal"
                  value={formData.informacionEmpresa.codigoPostal}
                  onChange={(e) => handleChange(e, 'informacionEmpresa')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="12345"
                />
                {errors.codigoPostal && <p className="mt-1 text-sm text-red-600">{errors.codigoPostal}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.informacionEmpresa.ciudad}
                  onChange={(e) => handleChange(e, 'informacionEmpresa')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese la ciudad"
                />
                {errors.ciudad && <p className="mt-1 text-sm text-red-600">{errors.ciudad}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción de la Actividad</label>
                <textarea
                  name="descripcionActividad"
                  value={formData.informacionEmpresa.descripcionActividad}
                  onChange={(e) => handleChange(e, 'informacionEmpresa')}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describa la actividad principal de la empresa"
                />
                {errors.descripcionActividad && <p className="mt-1 text-sm text-red-600">{errors.descripcionActividad}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="tieneEmpleados"
                    checked={formData.informacionEmpresa.tieneEmpleados}
                    onChange={(e) => handleChange(e, 'informacionEmpresa')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">La empresa tiene empleados</span>
                </label>
              </div>
              
              {formData.informacionEmpresa.tieneEmpleados && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Empleados</label>
                  <input
                    type="number"
                    name="numeroEmpleados"
                    value={formData.informacionEmpresa.numeroEmpleados}
                    onChange={(e) => handleChange(e, 'informacionEmpresa')}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ingrese el número de empleados"
                  />
                  {errors.numeroEmpleados && <p className="mt-1 text-sm text-red-600">{errors.numeroEmpleados}</p>}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ventas Anuales</label>
                <input
                  type="number"
                  name="ventasAnuales"
                  value={formData.informacionEmpresa.ventasAnuales}
                  onChange={(e) => handleChange(e, 'informacionEmpresa')}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese las ventas anuales"
                />
                {errors.ventasAnuales && <p className="mt-1 text-sm text-red-600">{errors.ventasAnuales}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Antigüedad (años)</label>
                <input
                  type="number"
                  name="antiguedad"
                  value={formData.informacionEmpresa.antiguedad}
                  onChange={(e) => handleChange(e, 'informacionEmpresa')}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese los años de antigüedad"
                />
                {errors.antiguedad && <p className="mt-1 text-sm text-red-600">{errors.antiguedad}</p>}
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Proyecto y Objetivos</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Proyecto</label>
                <textarea
                  name="descripcionProyecto"
                  value={formData.proyectoObjetivos.descripcionProyecto}
                  onChange={(e) => handleChange(e, 'proyectoObjetivos')}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describa el proyecto en detalle"
                />
                {errors.descripcionProyecto && <p className="mt-1 text-sm text-red-600">{errors.descripcionProyecto}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo de la Consultoría</label>
                <textarea
                  name="objetivoConsultoria"
                  value={formData.proyectoObjetivos.objetivoConsultoria}
                  onChange={(e) => handleChange(e, 'proyectoObjetivos')}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describa los objetivos de la consultoría"
                />
                {errors.objetivoConsultoria && <p className="mt-1 text-sm text-red-600">{errors.objetivoConsultoria}</p>}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Importancia de las Áreas</h3>
                <p className="text-sm text-gray-600 mb-6">Califique la importancia de cada área para su empresa (1-5)</p>
                
                <div className="space-y-6">
                  {Object.entries(formData.proyectoObjetivos.importanciaAreas).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </label>
                      <input
                        type="range"
                        name={key}
                        value={value}
                        onChange={(e) => handleChange(e, 'proyectoObjetivos', 'importanciaAreas')}
                        min="1"
                        max="5"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>1 - Poco importante</span>
                        <span>5 - Muy importante</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Diagnóstico Central</h1>
          <div className="text-sm text-gray-500">
            Paso {currentStep} de 3
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-indigo-600"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}
        
        <div className="flex justify-between pt-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePreviousStep}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Anterior
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar Diagnóstico'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 