"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

// Estilos para las barras de calificación
const barStyles = {
  container: "w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner",
  bar: "h-full transition-all duration-300",
  labels: "flex justify-between text-xs text-gray-500 mt-2",
  buttonContainer: "flex justify-between mt-3",
  button: "w-10 h-10 rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200",
  buttonActive: "bg-indigo-600 text-white border-indigo-600 transform scale-110"
};

// Estilos para los inputs
const inputStyles = "mt-1 block w-full rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 px-4 py-3";
const normalInputStyles = "border-2 border-gray-300 hover:border-gray-400";
const errorInputStyles = "border-2 border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";

// 1. Lista de sectores/industrias completa
const sectoresIndustria = [
  "Aerospace",
  "Automotive",
  "Semiconductors",
  "Circuit Boards Assembly",
  "Medical Devices",
  "Industrial Automation",
  "Logistics, freight and transport",
  "Agriculture industry",
  "Food & Beverages",
  "Health Services",
  "Pharmacy",
  "Beauty and personal care",
  "Mining & Extraction",
  "Metallurgy",
  "Metal mechanic",
  "E- commerce",
  "Digital marketing & branding",
  "ClimateTech & Sustainability",
  "Construction & Infrastructure",
  "Entrepreneurship & Innovation",
  "Retail",
  "Politics & Public Policy",
  "Education & STEM",
  "Safety, Security & Defense",
  "TI",
  "Software and Tech Development",
  "Artificial Intelligence and Big Data",
  "Process automation",
  "Tourism and hospitality",
  "Cultural Heritage Preservation",
  "Creative Industry & arts",
  "Livestock & fishing",
  "Oil and gas",
  "Toys and Entertainment",
  "Textile",
  "Plastics and Polymers",
  "Banking and Financial Services",
  "Insurance and Reinsurance",
  "Non-Profit Organizations (NGOs)",
  "Biotechnology and Life Sciences",
  "Otro: Especificar"
];

// 2. Lista de países mundial (ISO 3166, solo nombres)
const paisesMundo = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// Diccionario de títulos y descripciones para cada área y subárea
const evaluacionAreasLabels = {
  madurezDigital: {
    title: "Madurez Digital y Tecnología",
    subareas: [
      "Nuestra empresa tiene una estrategia digital claramente definida y alineada con nuestros objetivos de negocio.",
      "Utilizamos tecnologías digitales para mejorar nuestros procesos internos y la eficiencia operativa.",
      "Nuestros empleados cuentan con las habilidades digitales necesarias para desempeñar sus funciones.",
      "Aprovechamos el análisis de datos para tomar decisiones estratégicas.",
      "Estamos actualizados en cuanto a las tendencias y tecnologías emergentes relevantes para nuestro sector (por ejemplo, inteligencia artificial, Internet de las Cosas, blockchain)."
    ]
  },
  saludFinanciera: {
    title: "Gestión Financiera y Salud Financiera",
    subareas: [
      "Nuestra empresa mantiene un flujo de efectivo estable y sin problemas frecuentes.",
      "Nuestros márgenes de rentabilidad están alineados o por encima del promedio de la industria.",
      "Nuestra empresa gestiona eficientemente sus costos operativos.",
      "Nuestra empresa puede acceder fácilmente a financiamiento externo cuando lo necesita.",
      "Nuestra empresa cuenta con un presupuesto anual formal y realiza un seguimiento financiero regular."
    ]
  },
  eficienciaOperativa: {
    title: "Eficiencia Operativa y Procesos",
    subareas: [
      "Nuestros procesos operativos están mayormente automatizados y son altamente eficientes.",
      "Nuestras operaciones fluyen sin retrasos ni cuellos de botella significativos.",
      "La calidad de nuestros productos/servicios es consistente y confiable.",
      "Contamos con un programa de mejora continua implementado y en operación.",
      "Utilizamos herramientas de automatización y sistemas ERP para gestionar eficientemente nuestros procesos."
    ]
  },
  recursosHumanos: {
    title: "Recursos Humanos y Cultura Organizacional",
    subareas: [
      "Nuestra empresa mantiene una baja rotación de personal y alta estabilidad laboral.",
      "Nuestra empresa ofrece amplias oportunidades de formación y desarrollo a los empleados.",
      "El clima laboral en nuestra empresa es positivo y satisfactorio.",
      "Nuestros empleados están claramente alineados con los objetivos estratégicos de la empresa.",
      "Contamos con un sistema formal de evaluación y gestión del desempeño."
    ]
  },
  marketingVentas: {
    title: "Marketing y Ventas",
    subareas: [
      "Contamos con una estrategia de marketing bien definida y actualizada.",
      "Conocemos bien las necesidades y preferencias de nuestros clientes.",
      "Utilizamos una amplia variedad de canales de venta para llegar a nuestros clientes.",
      "Nuestra empresa tiene una diferenciación clara en el mercado respecto a la competencia.",
      "Utilizamos activamente herramientas digitales (como redes sociales, SEO, SEM) para promocionar nuestros productos/servicios."
    ]
  },
  innovacionDesarrollo: {
    title: "Innovación y Desarrollo de Productos/Servicios",
    subareas: [
      "Hemos lanzado nuevos productos o servicios en los últimos dos años.",
      "La innovación es una parte integral de nuestra cultura organizacional.",
      "Invertimos constantemente en investigación y desarrollo.",
      "Nos adaptamos rápidamente a los cambios del mercado.",
      "Colaboramos activamente con terceros (universidades, startups) en proyectos de innovación."
    ]
  },
  experienciaCliente: {
    title: "Experiencia y Satisfacción del Cliente",
    subareas: [
      "Recopilamos regularmente feedback de nuestros clientes para mejorar nuestros servicios.",
      "Nuestros clientes están satisfechos con nuestro servicio de atención.",
      "Ofrecemos experiencias personalizadas a nuestros clientes.",
      "Mantenemos una alta tasa de retención de clientes a largo plazo.",
      "Utilizamos herramientas CRM o ERP para gestionar eficientemente las relaciones con nuestros clientes."
    ]
  },
  gestionRiesgos: {
    title: "Gestión de Riesgos y Cumplimiento Normativo",
    subareas: [
      "Contamos con procesos establecidos para identificar y gestionar riesgos.",
      "Nos mantenemos al día con las regulaciones y normativas aplicables.",
      "Contamos con políticas y procedimientos documentados en áreas clave.",
      "Realizamos auditorías internas de manera regular.",
      "Capacitamos regularmente a nuestros empleados en cumplimiento y ética empresarial."
    ]
  }
};

export default function DiagnosticoCentral() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState(null);
  const [direccion, setDireccion] = useState(null);
  const [errorPostal, setErrorPostal] = useState(null);
  const [formData, setFormData] = useState({
    userId: null,
    informacionPersonal: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      puesto: "",
      nivelEstudios: "",
      genero: ""
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
      antiguedad: "",
      estado: "",
      tipoEmpresa: "",
      nombreEmpresaProyecto: "",
      giroActividad: ""
    },
    proyectoObjetivos: {
      descripcionProyecto: "",
      objetivoConsultoria: "",
      importanciaAreas: {
        gestionFinanciera: 1,
        eficienciaOperativa: 1,
        talentoHumano: 1,
        ventasMarketing: 1,
        innovacion: 1,
        digitalizacion: 1,
        experienciaCliente: 1,
        gestionRiesgos: 1
      }
    },
    evaluacionAreas: {
      madurezDigital: {
        estrategiaDigital: 1,
        tecnologiasProcesos: 1,
        habilidadesDigitales: 1,
        analisisDatos: 1,
        tendenciasTecnologicas: 1
      },
      saludFinanciera: {
        flujoEfectivo: 1,
        margenesRentabilidad: 1,
        gestionCostos: 1,
        accesoFinanciamiento: 1,
        presupuesto: 1
      },
      eficienciaOperativa: {
        automatizacion: 1,
        flujoOperaciones: 1,
        calidadProductos: 1,
        mejoraContinua: 1,
        herramientasAutomatizacion: 1
      },
      recursosHumanos: {
        rotacionPersonal: 1,
        formacionDesarrollo: 1,
        climaLaboral: 1,
        alineacionObjetivos: 1,
        evaluacionDesempeno: 1
      },
      marketingVentas: {
        estrategiaMarketing: 1,
        conocimientoClientes: 1,
        canalesVenta: 1,
        diferenciacionMercado: 1,
        herramientasDigitales: 1
      },
      innovacionDesarrollo: {
        nuevosProductos: 1,
        culturaInnovacion: 1,
        investigacionDesarrollo: 1,
        adaptacionMercado: 1,
        colaboracionTerceros: 1
      },
      experienciaCliente: {
        feedbackClientes: 1,
        satisfaccionServicio: 1,
        personalizacion: 1,
        retencionClientes: 1,
        herramientasCRM: 1
      },
      gestionRiesgos: {
        identificacionRiesgos: 1,
        cumplimientoNormativo: 1,
        documentacion: 1,
        auditorias: 1,
        capacitacionCumplimiento: 1
      }
    }
  });

  // Manejar la sesión del usuario y pre-llenar con datos del primer pre-diagnóstico
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      setUserId(session.user.id);
      setFormData(prev => ({
        ...prev,
        userId: session.user.id
      }));
      
      // Pre-llenar con datos del primer pre-diagnóstico si existe
      const loadPrediagnosticoData = async () => {
        try {
          const response = await fetch(`/api/prediagnostico?userId=${session.user.id}`);
          if (response.ok) {
            const prediagnosticos = await response.json();
            if (prediagnosticos && prediagnosticos.length > 0) {
              const primerPrediagnostico = prediagnosticos[0]; // Tomar el más reciente
              console.log('Pre-llenando formulario con datos del primer pre-diagnóstico:', primerPrediagnostico);
              
              setFormData(prev => ({
                ...prev,
                userId: session.user.id,
                informacionPersonal: {
                  ...prev.informacionPersonal,
                  nombre: primerPrediagnostico.nombre || "",
                  apellido: primerPrediagnostico.apellido || "",
                  email: primerPrediagnostico.email || session?.user?.email || "",
                  telefono: primerPrediagnostico.telefono || "",
                  nivelEstudios: primerPrediagnostico.nivelEstudios || "",
                  genero: primerPrediagnostico.genero || ""
                },
                informacionEmpresa: {
                  ...prev.informacionEmpresa,
                  tipoEmpresa: primerPrediagnostico.tipoEmpresa || "",
                  nombreEmpresaProyecto: primerPrediagnostico.nombreEmpresaProyecto || "",
                  giroActividad: primerPrediagnostico.giroActividad || "",
                  descripcionActividad: primerPrediagnostico.descripcionActividad || "",
                  tieneEmpleados: primerPrediagnostico.tieneEmpleados === "si" ? true : false,
                  numeroEmpleados: primerPrediagnostico.numeroEmpleados || "",
                  ventasAnuales: primerPrediagnostico.ventasAnualesEstimadas || ""
                }
              }));
            }
          }
        } catch (error) {
          console.error('Error al cargar datos del pre-diagnóstico:', error);
        }
      };
      
      loadPrediagnosticoData();
    } else if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [session, status, router]);

  // Si no hay sesión, mostrar mensaje de carga
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay userId, no mostrar el formulario
  if (!userId) {
    return null;
  }

  const buscarDireccion = async (codigoPostal) => {
    setErrorPostal(null);
    setDireccion(null);
    
    // Validación básica del código postal
    if (!codigoPostal || codigoPostal.length !== 5) {
      setErrorPostal("El código postal debe tener 5 dígitos");
      return;
    }

    try {
      // Usar la API de México
      const res = await fetch(`https://api.correosdemexico.gob.mx/consultaCP/consultaCP.php?cp=${codigoPostal}`);
      
      if (!res.ok) {
        throw new Error('Error en la respuesta de la API');
      }

      const data = await res.json();

      if (!data || data.error) {
        setErrorPostal("Código postal no encontrado. Por favor, verifique el código e intente nuevamente.");
        return;
      }

      // Verificar que tenemos la información necesaria
      if (!data.estado || !data.municipio) {
        setErrorPostal("Información incompleta para este código postal");
        return;
      }

      const direccionData = {
        settlements: [{
          name: data.municipio || ''
        }],
        federal_entity: {
          name: data.estado || ''
        }
      };

      setDireccion(direccionData);
      
      // Actualizar automáticamente la ciudad y estado
      if (direccionData.settlements[0].name) {
        handleInputChange('informacionEmpresa', 'ciudad', direccionData.settlements[0].name);
      }
      if (direccionData.federal_entity.name) {
        handleInputChange('informacionEmpresa', 'estado', direccionData.federal_entity.name);
      }

    } catch (err) {
      console.error('Error al consultar código postal:', err);
      setErrorPostal("No se pudo verificar el código postal. Por favor, ingrese la información manualmente.");
    }
  };

  const handleInputChange = (section, field, value) => {
    let isValid = true;
    let errorMessage = '';

    // Validaciones específicas por campo
    switch (field) {
      case 'codigoPostal':
        if (!validatePostalCode(value)) {
          isValid = false;
          errorMessage = 'El código postal debe tener 5 dígitos';
        } else {
          buscarDireccion(value);
        }
        break;
      case 'email':
        if (!validateEmail(value)) {
          isValid = false;
          errorMessage = 'Por favor ingrese un email válido';
        }
        break;
      case 'telefono':
        if (!validatePhone(value)) {
          isValid = false;
          errorMessage = 'El teléfono debe tener 10 dígitos';
        }
        break;
      case 'nombre':
      case 'apellido':
        if (!validateName(value)) {
          isValid = false;
          errorMessage = 'Solo se permiten letras y espacios';
        }
        break;
    }

    // Actualizar el estado del formulario
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Actualizar errores
    if (!isValid) {
      setErrors(prev => ({
        ...prev,
        [field]: errorMessage
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
    return nameRegex.test(name);
  };

  const validatePostalCode = (code) => {
    const postalRegex = /^\d{5}$/;
    return postalRegex.test(code);
  };

  const handleNestedInputChange = (section, field, value) => {
    let isValid = true;
    let errorMessage = '';

    // Validaciones específicas por campo
    switch (field) {
      case 'email':
        if (!validateEmail(value)) {
          isValid = false;
          errorMessage = 'Por favor ingrese un email válido';
        }
        break;
      case 'telefono':
        if (!validatePhone(value)) {
          isValid = false;
          errorMessage = 'El teléfono debe tener 10 dígitos';
        }
        break;
      case 'nombre':
      case 'apellido':
        if (!validateName(value)) {
          isValid = false;
          errorMessage = 'Solo se permiten letras y espacios';
        }
        break;
    }

    // Actualizar el estado del formulario
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Actualizar errores
    if (!isValid) {
      setErrors(prev => ({
        ...prev,
        [field]: errorMessage
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = (e) => {
    e.preventDefault(); // Prevenir el envío del formulario
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length === 0) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
        // Scroll to top when changing to next step
        window.scrollTo(0, 0);
      }
    } else {
      setErrors(stepErrors);
      const firstError = Object.values(stepErrors)[0];
      toast.error(firstError);
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault(); // Prevenir el envío del formulario
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Solo guardar si estamos en el último paso
    if (currentStep !== 4) {
      return;
    }

    // Scroll to top when submitting
    window.scrollTo(0, 0);

    // Debug: mostrar el estado actual del formulario
    console.log('Submitting form data:', formData);
    console.log('User ID:', userId);
    console.log('Session:', session);

    // Asegurarnos de que el email esté presente y sea válido
    if (!formData.informacionPersonal.email) {
      toast.error('El email es requerido');
      return;
    }

    // Asegurarnos de que el userId esté presente
    if (!formData.userId) {
      console.error('No userId found in formData');
      toast.error('Error: No se encontró el ID del usuario');
      return;
    }

    try {
      const response = await fetch('/api/diagnostico-central', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error al guardar el diagnóstico');
      }

      toast.success('Diagnóstico guardado exitosamente. El análisis de su empresa está en progreso.');
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al guardar el diagnóstico');
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.informacionPersonal.nombre) newErrors.nombre = "El nombre es requerido";
        if (!formData.informacionPersonal.apellido) newErrors.apellido = "El apellido es requerido";
        if (!formData.informacionPersonal.email) newErrors.email = "El email es requerido";
        if (!formData.informacionPersonal.telefono) newErrors.telefono = "El teléfono es requerido";
        if (!formData.informacionPersonal.puesto) newErrors.puesto = "El puesto es requerido";
        break;
      case 2:
        if (!formData.informacionEmpresa.sector) newErrors.sector = "El sector es requerido";
        // if (!formData.informacionEmpresa.nombreEmpresa) newErrors.nombreEmpresa = "El nombre de la empresa es requerido";
        if (!formData.informacionEmpresa.ubicacion) newErrors.ubicacion = "La ubicación es requerida";
        if (!formData.informacionEmpresa.codigoPostal) newErrors.codigoPostal = "El código postal es requerido";
        if (!formData.informacionEmpresa.ciudad) newErrors.ciudad = "La ciudad es requerida";
        if (!formData.informacionEmpresa.descripcionActividad) newErrors.descripcionActividad = "La descripción de la actividad es requerida";
        if (formData.informacionEmpresa.tieneEmpleados) {
          if (!formData.informacionEmpresa.numeroEmpleados) newErrors.numeroEmpleados = "El número de empleados es requerido";
        }
        if (!formData.informacionEmpresa.ventasAnuales) {
          newErrors.ventasAnuales = "Las ventas anuales son requeridas";
        }
        if (!formData.informacionEmpresa.antiguedad) newErrors.antiguedad = "La antigüedad es requerida";
        break;
      case 3:
        // if (!formData.proyectoObjetivos.descripcionProyecto) newErrors.descripcionProyecto = "La descripción del proyecto es requerida";
        // if (!formData.proyectoObjetivos.objetivoConsultoria) newErrors.objetivoConsultoria = "El objetivo de la consultoría es requerido";
        break;
      case 4:
        // Validación de evaluación de áreas
        const categorias = {
          madurezDigital: [
            'estrategiaDigital',
            'tecnologiasProcesos',
            'habilidadesDigitales',
            'analisisDatos',
            'tendenciasTecnologicas'
          ],
          saludFinanciera: [
            'flujoEfectivo',
            'margenesRentabilidad',
            'gestionCostos',
            'accesoFinanciamiento',
            'presupuesto'
          ],
          eficienciaOperativa: [
            'automatizacion',
            'flujoOperaciones',
            'calidadProductos',
            'mejoraContinua',
            'herramientasAutomatizacion'
          ],
          recursosHumanos: [
            'rotacionPersonal',
            'formacionDesarrollo',
            'climaLaboral',
            'alineacionObjetivos',
            'evaluacionDesempeno'
          ],
          marketingVentas: [
            'estrategiaMarketing',
            'conocimientoClientes',
            'canalesVenta',
            'diferenciacionMercado',
            'herramientasDigitales'
          ],
          innovacionDesarrollo: [
            'nuevosProductos',
            'culturaInnovacion',
            'investigacionDesarrollo',
            'adaptacionMercado',
            'colaboracionTerceros'
          ],
          experienciaCliente: [
            'feedbackClientes',
            'satisfaccionServicio',
            'personalizacion',
            'retencionClientes',
            'herramientasCRM'
          ],
          gestionRiesgos: [
            'identificacionRiesgos',
            'cumplimientoNormativo',
            'documentacion',
            'auditorias',
            'capacitacionCumplimiento'
          ]
        };

        for (const categoria in categorias) {
          for (const subarea of categorias[categoria]) {
            if (formData.evaluacionAreas[categoria][subarea] === 0) {
              newErrors[`${categoria}.${subarea}`] = "Este área necesita mejora";
            }
          }
        }
        break;
    }
    
    return newErrors;
  };

  const handleAreaChange = (categoria, subarea, value) => {
    setFormData(prev => ({
      ...prev,
      evaluacionAreas: {
        ...prev.evaluacionAreas,
        [categoria]: {
          ...prev.evaluacionAreas[categoria],
          [subarea]: value
        }
      }
    }));
  };

  const renderEvaluacionAreas = () => {
    const categorias = {
      madurezDigital: [
        'estrategiaDigital',
        'tecnologiasProcesos',
        'habilidadesDigitales',
        'analisisDatos',
        'tendenciasTecnologicas'
      ],
      saludFinanciera: [
        'flujoEfectivo',
        'margenesRentabilidad',
        'gestionCostos',
        'accesoFinanciamiento',
        'presupuesto'
      ],
      eficienciaOperativa: [
        'automatizacion',
        'flujoOperaciones',
        'calidadProductos',
        'mejoraContinua',
        'herramientasAutomatizacion'
      ],
      recursosHumanos: [
        'rotacionPersonal',
        'formacionDesarrollo',
        'climaLaboral',
        'alineacionObjetivos',
        'evaluacionDesempeno'
      ],
      marketingVentas: [
        'estrategiaMarketing',
        'conocimientoClientes',
        'canalesVenta',
        'diferenciacionMercado',
        'herramientasDigitales'
      ],
      innovacionDesarrollo: [
        'nuevosProductos',
        'culturaInnovacion',
        'investigacionDesarrollo',
        'adaptacionMercado',
        'colaboracionTerceros'
      ],
      experienciaCliente: [
        'feedbackClientes',
        'satisfaccionServicio',
        'personalizacion',
        'retencionClientes',
        'herramientasCRM'
      ],
      gestionRiesgos: [
        'identificacionRiesgos',
        'cumplimientoNormativo',
        'documentacion',
        'auditorias',
        'capacitacionCumplimiento'
      ]
    };

    return (
      <div className="space-y-8">
        {Object.entries(categorias).map(([categoria, subareas]) => (
          <div key={categoria} className="space-y-4">
            <h3 className="text-lg font-medium">
              {evaluacionAreasLabels[categoria]?.title || categoria.charAt(0).toUpperCase() + categoria.slice(1).replace(/([A-Z])/g, ' $1')}
            </h3>
            <div className="space-y-4">
              {subareas.map((subarea, idx) => (
                <div key={subarea} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {evaluacionAreasLabels[categoria]?.subareas?.[idx] || subarea.charAt(0).toUpperCase() + subarea.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <div className={barStyles.container} style={{ position: 'relative', height: '44px' }}>
                    <div
                      className={
                        `${barStyles.bar} pointer-events-none ` +
                        (formData.evaluacionAreas[categoria][subarea] === 0 ? 'bg-gray-300' :
                          formData.evaluacionAreas[categoria][subarea] === 1 ? 'bg-red-500' :
                          formData.evaluacionAreas[categoria][subarea] === 2 ? 'bg-orange-500' :
                          formData.evaluacionAreas[categoria][subarea] === 3 ? 'bg-yellow-500' :
                          formData.evaluacionAreas[categoria][subarea] === 4 ? 'bg-blue-500' : 'bg-green-500')
                      }
                      style={{
                        width: `${(formData.evaluacionAreas[categoria][subarea] / 5) * 100}%`,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        zIndex: 1,
                        transition: 'width 0.3s',
                      }}
                    />
                    <div className="flex h-full w-full items-center justify-between px-2" style={{ position: 'relative', zIndex: 2 }}>
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleAreaChange(categoria, subarea, num)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                            ${formData.evaluacionAreas[categoria][subarea] === num ? 'bg-indigo-600 text-white border-indigo-600 scale-110' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                          title={`Nivel ${num}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={barStyles.labels}>
                    <span>Baja</span>
                    <span>Media</span>
                    <span>Alta</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Diagnóstico Central</h1>
          <button
            type="button"
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            Volver al Dashboard
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Paso {currentStep} de 4</span>
            <span className="text-sm font-medium text-gray-600">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Información Personal */}
          {currentStep === 1 && (
            <div className="space-y-6 bg-white rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800 border-b pb-4">Información Personal</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    value={formData.informacionPersonal.nombre}
                    onChange={(e) => handleNestedInputChange('informacionPersonal', 'nombre', e.target.value)}
                    className={`${inputStyles} ${errors.nombre ? errorInputStyles : normalInputStyles}`}
                    placeholder="Ingrese su nombre"
                    required
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Apellido</label>
                  <input
                    type="text"
                    value={formData.informacionPersonal.apellido}
                    onChange={(e) => handleNestedInputChange('informacionPersonal', 'apellido', e.target.value)}
                    className={`${inputStyles} ${errors.apellido ? errorInputStyles : normalInputStyles}`}
                    placeholder="Ingrese su apellido"
                    required
                  />
                  {errors.apellido && (
                    <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nivel de Estudios</label>
                  <select
                    value={formData.informacionPersonal.nivelEstudios || ''}
                    onChange={(e) => handleNestedInputChange('informacionPersonal', 'nivelEstudios', e.target.value)}
                    className={`${inputStyles} ${errors.nivelEstudios ? errorInputStyles : normalInputStyles}`}
                    required
                  >
                    <option value="">Seleccione un nivel</option>
                    <option value="primaria">Primaria</option>
                    <option value="secundaria">Secundaria</option>
                    <option value="preparatoria">Preparatoria</option>
                    <option value="licenciatura">Licenciatura</option>
                    <option value="maestria">Maestría</option>
                    <option value="doctorado">Doctorado</option>
                  </select>
                  {errors.nivelEstudios && (
                    <p className="mt-1 text-sm text-red-600">{errors.nivelEstudios}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.informacionPersonal.email}
                    onChange={(e) => handleNestedInputChange('informacionPersonal', 'email', e.target.value)}
                    className={`${inputStyles} ${errors.email ? errorInputStyles : normalInputStyles}`}
                    placeholder="ejemplo@correo.com"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.informacionPersonal.telefono}
                    onChange={(e) => handleNestedInputChange('informacionPersonal', 'telefono', e.target.value)}
                    className={`${inputStyles} ${errors.telefono ? errorInputStyles : normalInputStyles}`}
                    placeholder="10 dígitos"
                    maxLength="10"
                    required
                  />
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Género</label>
                  <select
                    value={formData.informacionPersonal.genero || ''}
                    onChange={(e) => handleNestedInputChange('informacionPersonal', 'genero', e.target.value)}
                    className={`${inputStyles} ${errors.genero ? errorInputStyles : normalInputStyles}`}
                    required
                  >
                    <option value="">Seleccione un género</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="prefiero no decir">Prefiero no decir</option>
                  </select>
                  {errors.genero && (
                    <p className="mt-1 text-sm text-red-600">{errors.genero}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Puesto</label>
                  <select
                    value={formData.informacionPersonal.puesto}
                    onChange={(e) => handleNestedInputChange('informacionPersonal', 'puesto', e.target.value)}
                    className={`${inputStyles} ${errors.puesto ? errorInputStyles : normalInputStyles}`}
                    required
                  >
                    <option value="">Seleccione un puesto</option>
                    <option value="COO">COO</option>
                    <option value="CEO">CEO</option>
                    <option value="CTO">CTO</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {errors.puesto && (
                    <p className="mt-1 text-sm text-red-600">{errors.puesto}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Información de la Empresa */}
          {currentStep === 2 && (
            <div className="space-y-6 bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Información de la Empresa</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tipo de Empresa</label>
                  <select
                    value={formData.informacionEmpresa.tipoEmpresa || ''}
                    onChange={(e) => handleInputChange('informacionEmpresa', 'tipoEmpresa', e.target.value)}
                    className={`${inputStyles} ${errors.tipoEmpresa ? errorInputStyles : normalInputStyles}`}
                    required
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="empresa">Empresa</option>
                    <option value="emprendedor">Emprendedor</option>
                  </select>
                  {errors.tipoEmpresa && (
                    <p className="mt-1 text-sm text-red-600">{errors.tipoEmpresa}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nombre Empresa/Proyecto</label>
                  <input
                    type="text"
                    value={formData.informacionEmpresa.nombreEmpresaProyecto || ''}
                    onChange={(e) => handleInputChange('informacionEmpresa', 'nombreEmpresaProyecto', e.target.value)}
                    className={`${inputStyles} ${errors.nombreEmpresaProyecto ? errorInputStyles : normalInputStyles}`}
                    required
                  />
                  {errors.nombreEmpresaProyecto && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombreEmpresaProyecto}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Giro de Actividad</label>
                  <input
                    type="text"
                    value={formData.informacionEmpresa.giroActividad || ''}
                    onChange={(e) => handleInputChange('informacionEmpresa', 'giroActividad', e.target.value)}
                    className={`${inputStyles} ${errors.giroActividad ? errorInputStyles : normalInputStyles}`}
                    required
                  />
                  {errors.giroActividad && (
                    <p className="mt-1 text-sm text-red-600">{errors.giroActividad}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Descripción de la Actividad</label>
                  <textarea
                    value={formData.informacionEmpresa.descripcionActividad}
                    onChange={(e) => handleInputChange('informacionEmpresa', 'descripcionActividad', e.target.value)}
                    className={`${inputStyles} ${errors.descripcionActividad ? errorInputStyles : normalInputStyles}`}
                    rows={3}
                    required
                  />
                  {errors.descripcionActividad && (
                    <p className="mt-1 text-sm text-red-600">{errors.descripcionActividad}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">¿Tiene empleados?</label>
                  <select
                    value={formData.informacionEmpresa.tieneEmpleados ? 'true' : 'false'}
                    onChange={(e) => handleInputChange('informacionEmpresa', 'tieneEmpleados', e.target.value === 'true')}
                    className={`${inputStyles} ${errors.tieneEmpleados ? errorInputStyles : normalInputStyles}`}
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>

                {formData.informacionEmpresa.tieneEmpleados && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Número de Empleados</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.informacionEmpresa.numeroEmpleados}
                      onChange={(e) => handleInputChange('informacionEmpresa', 'numeroEmpleados', parseInt(e.target.value))}
                      className={`${inputStyles} ${errors.numeroEmpleados ? errorInputStyles : normalInputStyles}`}
                      required
                    />
                    {errors.numeroEmpleados && (
                      <p className="mt-1 text-sm text-red-600">{errors.numeroEmpleados}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Ventas Anuales (MXN)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.informacionEmpresa.ventasAnuales || ''}
                    onChange={(e) => handleInputChange('informacionEmpresa', 'ventasAnuales', parseFloat(e.target.value))}
                    className={`${inputStyles} ${errors.ventasAnuales ? errorInputStyles : normalInputStyles}`}
                    required
                  />
                  {errors.ventasAnuales && (
                    <p className="mt-1 text-sm text-red-600">{errors.ventasAnuales}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Sector</label>
                  <select
                    value={formData.informacionEmpresa.sector}
                    onChange={(e) => handleInputChange('informacionEmpresa', 'sector', e.target.value)}
                    className={`${inputStyles} ${errors.sector ? errorInputStyles : normalInputStyles}`}
                    required
                  >
                    <option value="">Seleccione un sector</option>
                    {sectoresIndustria.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                  {errors.sector && (
                    <p className="mt-1 text-sm text-red-600">{errors.sector}</p>
                  )}
                </div>

                {/* <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
                  <input
                    type="text"
                    value={formData.informacionEmpresa.nombreEmpresa}
                    onChange={(e) => handleInputChange('informacionEmpresa', 'nombreEmpresa', e.target.value)}
                    className={`${inputStyles} ${errors.nombreEmpresa ? errorInputStyles : normalInputStyles}`}
                    required
                  />
                  {errors.nombreEmpresa && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombreEmpresa}</p>
                  )}
                </div> */}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                  <select
                    value={formData.informacionEmpresa.ubicacion}
                    onChange={(e) => handleInputChange('informacionEmpresa', 'ubicacion', e.target.value)}
                    className={`${inputStyles} ${errors.ubicacion ? errorInputStyles : normalInputStyles}`}
                    required
                  >
                    <option value="">Seleccione un país</option>
                    {paisesMundo.map(pais => (
                      <option key={pais} value={pais}>{pais}</option>
                    ))}
                  </select>
                  {errors.ubicacion && (
                    <p className="mt-1 text-sm text-red-600">{errors.ubicacion}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                  <input
                    type="text"
                    value={formData.informacionEmpresa.codigoPostal}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      handleInputChange('informacionEmpresa', 'codigoPostal', value);
                    }}
                    className={`${inputStyles} ${errors.codigoPostal ? errorInputStyles : normalInputStyles}`}
                    placeholder="5 dígitos"
                    maxLength="5"
                    required
                  />
                  {errors.codigoPostal && (
                    <p className="mt-1 text-sm text-red-600">{errors.codigoPostal}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                  <input
                    type="text"
                    value={formData.informacionEmpresa.ciudad}
                    onChange={(e) => handleInputChange('informacionEmpresa', 'ciudad', e.target.value)}
                    className={`${inputStyles} ${errors.ciudad ? errorInputStyles : normalInputStyles}`}
                    required
                  />
                  {errors.ciudad && (
                    <p className="mt-1 text-sm text-red-600">{errors.ciudad}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Antigüedad (años)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.informacionEmpresa.antiguedad}
                    onChange={(e) => handleInputChange('informacionEmpresa', 'antiguedad', parseInt(e.target.value))}
                    className={`${inputStyles} ${errors.antiguedad ? errorInputStyles : normalInputStyles}`}
                    required
                  />
                  {errors.antiguedad && (
                    <p className="mt-1 text-sm text-red-600">{errors.antiguedad}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Importancia de Áreas */}
          {currentStep === 3 && (
            <div className="space-y-6 bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Importancia de Áreas</h2>
              <div className="space-y-8">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción del Proyecto</label>
                  <textarea
                    value={formData.proyectoObjetivos.descripcionProyecto}
                    onChange={(e) => handleNestedInputChange('proyectoObjetivos', 'descripcionProyecto', e.target.value)}
                    className={`${inputStyles} ${errors.descripcionProyecto ? errorInputStyles : normalInputStyles}`}
                    rows={4}
                    required
                  />
                  {errors.descripcionProyecto && (
                    <p className="mt-1 text-sm text-red-600">{errors.descripcionProyecto}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Objetivo de la Consultoría</label>
                  <textarea
                    value={formData.proyectoObjetivos.objetivoConsultoria}
                    onChange={(e) => handleNestedInputChange('proyectoObjetivos', 'objetivoConsultoria', e.target.value)}
                    required
                  />
                  {errors.objetivoConsultoria && (
                    <p className="mt-1 text-sm text-red-600">{errors.objetivoConsultoria}</p>
                  )}
                </div> */}

                <div>
                  <div className="space-y-4">
                    {Object.entries(formData.proyectoObjetivos.importanciaAreas).map(([area, value]) => (
                      <div key={area} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {area.charAt(0).toUpperCase() + area.slice(1).replace(/([A-Z])/g, ' $1')}
                        </label>
                        <div className={barStyles.container} style={{ position: 'relative', height: '44px' }}>
                          <div
                            className={
                              `${barStyles.bar} pointer-events-none ` +
                              (value === 0 ? 'bg-gray-300' :
                               value === 1 ? 'bg-red-500' :
                               value === 2 ? 'bg-orange-500' :
                               value === 3 ? 'bg-yellow-500' :
                               value === 4 ? 'bg-blue-500' : 'bg-green-500')
                            }
                            style={{
                              width: `${(value / 5) * 100}%`,
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              height: '100%',
                              zIndex: 1,
                              transition: 'width 0.3s',
                            }}
                          />
                          <div className="flex h-full w-full items-center justify-between px-2" style={{ position: 'relative', zIndex: 2 }}>
                            {[1, 2, 3, 4, 5].map(num => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => handleNestedInputChange('proyectoObjetivos', 'importanciaAreas', { ...formData.proyectoObjetivos.importanciaAreas, [area]: num })}
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                  ${value === num ? 'bg-indigo-600 text-white border-indigo-600 scale-110' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                title={`Nivel ${num}`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className={barStyles.labels}>
                          <span>Baja</span>
                          <span>Media</span>
                          <span>Alta</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Evaluación de Áreas */}
          {currentStep === 4 && (
            <div className="space-y-6 bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Evaluación de Áreas</h2>
              {renderEvaluacionAreas()}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Anterior
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Guardar Diagnóstico
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 