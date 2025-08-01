"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaUsers, FaChartLine, FaClock, FaIndustry, FaCheckCircle, FaTimesCircle, FaSpinner, FaEye, FaTachometerAlt, FaUserPlus, FaTimes, FaBan } from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";
import Modal from "@/components/Modal";
import ProyectoContextMenu from "@/components/ProyectoContextMenu";
import ProyectoDashboard from "@/components/ProyectoDashboard";
import PostulacionesExpertos from "@/components/PostulacionesExpertos";
import { useProyectosState } from "@/hooks/useProyectosState";

export default function ProyectosTablero() {
  const { data: session } = useSession();
  const [proyectosOriginales, setProyectosOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [proyectoDetalle, setProyectoDetalle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelandoProyecto, setCancelandoProyecto] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning"
  });
  const [seleccionado, setSeleccionado] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [allMatches, setAllMatches] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [errorMatches, setErrorMatches] = useState(null);
  const [expertosData, setExpertosData] = useState(null);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [selectedProyectoForContext, setSelectedProyectoForContext] = useState(null);
  const [shouldRecalculateMatches, setShouldRecalculateMatches] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [selectedProyectoForDashboard, setSelectedProyectoForDashboard] = useState(null);
  const [postulacionesOpen, setPostulacionesOpen] = useState(false);
  const [selectedProyectoForPostulaciones, setSelectedProyectoForPostulaciones] = useState(null);

  // Usar el hook para manejar el estado de los proyectos
  const proyectos = useProyectosState(proyectosOriginales);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProyectos();
      fetchExpertosData();
    }
  }, [session, filtroEstado]);

  // Manejar cierre del modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        handleCerrarModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Recalcular matches cuando se cargan los datos de expertos y hay proyectos para calcular
  useEffect(() => {
    if (expertosData && proyectosOriginales.length > 0 && shouldRecalculateMatches) {
      console.log('Recalculando matches para todos los proyectos...');
      const proyectosConMatches = proyectosOriginales.map(proyecto => {
        const matchCount = calculateExpertMatches(proyecto);
        return {
          ...proyecto,
          matchesGenerados: matchCount
        };
      });
      console.log('Proyectos con matches calculados:', proyectosConMatches);
      setProyectosOriginales(proyectosConMatches);
      setShouldRecalculateMatches(false);
    }
  }, [expertosData, shouldRecalculateMatches]);

  // Fetch all expert matches on mount
  useEffect(() => {
    const fetchAllMatches = async () => {
      try {
        const response = await fetch('/api/expert-matching');
        const result = await response.json();
        if (result.success && result.data) {
          setAllMatches(result.data);
        } else {
          console.error('Error al obtener matches:', result.error);
        }
      } catch (error) {
        console.error('Error al obtener matches:', error);
      }
    };
    fetchAllMatches();
  }, []);

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      const url = filtroEstado === "todos" 
        ? "/api/proyectos-publicados"
        : `/api/proyectos-publicados?estado=${filtroEstado}`;
        
      const response = await fetch(url);
      const result = await response.json();

      console.log("proyectos encontrados", result);

      if (result.success && result.data) {
        setProyectosOriginales(result.data);
        setShouldRecalculateMatches(true);
      } else {
        setError(result.error || 'Error al cargar los proyectos');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpertosData = async () => {
    try {
      // Por ahora usamos datos mock del archivo expertos.json
      // En el futuro esto vendría de una API
      const response = await fetch('/expertos.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setExpertosData(data);
    } catch (error) {
      console.error('Error al cargar datos de expertos:', error);
      // Si falla, usamos datos mock hardcodeados con expertos que hacen match
      setExpertosData({
        expertos_formulario: [
          {
            ID: "mock1",
            nombre_experto: "Dr. Ana Martínez",
            categoria: "Servicios Digitales,Negocios,STEAM",
            estudios_expertos: "Doctorado",
            experiencia_experto: "Más de 15 años en transformación digital y desarrollo de software. Especialista en implementación de sistemas ERP, automatización de procesos y estrategias de digitalización empresarial. He liderado proyectos de transformación digital en más de 50 empresas de diferentes sectores.",
            email_experto: "ana.martinez@digitalexpert.com",
            telefono_experto: "+525512345678",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock2",
            nombre_experto: "Ing. Carlos Rodríguez",
            categoria: "Negocios,Servicios Digitales,Soluciones personalizadas",
            estudios_expertos: "Maestría",
            experiencia_experto: "Consultor especializado en optimización de procesos empresariales y desarrollo de estrategias digitales. Experiencia en implementación de metodologías ágiles, mejora continua y automatización de flujos de trabajo. He ayudado a más de 30 empresas a mejorar su eficiencia operativa.",
            email_experto: "carlos.rodriguez@businessconsulting.com",
            telefono_experto: "+525523456789",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock3",
            nombre_experto: "Lic. María González",
            categoria: "Negocios,Investigación",
            estudios_expertos: "Licenciatura",
            experiencia_experto: "Especialista en investigación de mercados y análisis de datos empresariales. Experiencia en desarrollo de estrategias de negocio basadas en datos, estudios de viabilidad y análisis de tendencias del mercado. He realizado más de 100 estudios de mercado para empresas de diversos sectores.",
            email_experto: "maria.gonzalez@marketresearch.com",
            telefono_experto: "+525534567890",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock4",
            nombre_experto: "Ing. Roberto Silva",
            categoria: "Servicios Digitales,STEAM,Soluciones personalizadas",
            estudios_expertos: "Licenciatura",
            experiencia_experto: "Desarrollador full-stack con experiencia en tecnologías modernas como React, Node.js, Python y bases de datos. Especialista en desarrollo de aplicaciones web, APIs y sistemas de gestión. He desarrollado más de 20 aplicaciones empresariales y sistemas de automatización.",
            email_experto: "roberto.silva@techsolutions.com",
            telefono_experto: "+525545678901",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock5",
            nombre_experto: "Dra. Laura Fernández",
            categoria: "Investigación,STEAM",
            estudios_expertos: "Doctorado",
            experiencia_experto: "Investigadora especializada en análisis de datos y machine learning aplicado a negocios. Experiencia en desarrollo de modelos predictivos, análisis estadístico y visualización de datos. He publicado más de 15 papers científicos y trabajado en proyectos de investigación aplicada.",
            email_experto: "laura.fernandez@dataresearch.com",
            telefono_experto: "+525556789012",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock6",
            nombre_experto: "Lic. Juan Pérez",
            categoria: "Negocios,Servicios Digitales",
            estudios_expertos: "Licenciatura",
            experiencia_experto: "Consultor en estrategia empresarial y marketing digital. Especialista en desarrollo de planes de negocio, estrategias de crecimiento y marketing digital. He asesorado a más de 40 startups y empresas en crecimiento, ayudándolas a desarrollar estrategias efectivas.",
            email_experto: "juan.perez@businessstrategy.com",
            telefono_experto: "+525567890123",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock7",
            nombre_experto: "Ing. Patricia López",
            categoria: "Servicios Digitales,Soluciones personalizadas",
            estudios_expertos: "Maestría",
            experiencia_experto: "Arquitecta de soluciones digitales con experiencia en diseño de sistemas empresariales, integración de APIs y desarrollo de soluciones personalizadas. Especialista en tecnologías cloud y desarrollo de aplicaciones escalables. He diseñado e implementado más de 25 soluciones empresariales.",
            email_experto: "patricia.lopez@digitalarchitect.com",
            telefono_experto: "+525578901234",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock8",
            nombre_experto: "Dr. Miguel Torres",
            categoria: "Investigación,Negocios",
            estudios_expertos: "Doctorado",
            experiencia_experto: "Investigador y consultor especializado en innovación empresarial y desarrollo de nuevos productos. Experiencia en gestión de proyectos de I+D, análisis de viabilidad técnica y comercial, y desarrollo de estrategias de innovación. He liderado más de 30 proyectos de investigación aplicada.",
            email_experto: "miguel.torres@innovationlab.com",
            telefono_experto: "+525589012345",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock9",
            nombre_experto: "Ing. Sofía Mendoza",
            categoria: "Servicios Digitales,STEAM",
            estudios_expertos: "Maestría",
            experiencia_experto: "Especialista en desarrollo de aplicaciones móviles y sistemas web. Experiencia en React Native, Flutter, y desarrollo de APIs RESTful. He desarrollado más de 15 aplicaciones móviles para empresas de diferentes sectores, incluyendo e-commerce, fintech y salud.",
            email_experto: "sofia.mendoza@mobileapps.com",
            telefono_experto: "+525590123456",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock10",
            nombre_experto: "Lic. Alejandro Ruiz",
            categoria: "Negocios,Soluciones personalizadas",
            estudios_expertos: "Licenciatura",
            experiencia_experto: "Consultor especializado en optimización de procesos de ventas y marketing digital. Experiencia en implementación de CRM, automatización de marketing y estrategias de crecimiento. He ayudado a más de 25 empresas a aumentar sus ventas en un promedio del 40%.",
            email_experto: "alejandro.ruiz@salesoptimization.com",
            telefono_experto: "+525501234567",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock11",
            nombre_experto: "Dra. Carmen Vega",
            categoria: "Investigación,STEAM",
            estudios_expertos: "Doctorado",
            experiencia_experto: "Investigadora en inteligencia artificial y machine learning aplicado a negocios. Especialista en desarrollo de algoritmos predictivos, análisis de big data y automatización de procesos. He publicado más de 20 papers científicos y desarrollado soluciones de IA para empresas Fortune 500.",
            email_experto: "carmen.vega@airesearch.com",
            telefono_experto: "+525512345678",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock12",
            nombre_experto: "Ing. Diego Morales",
            categoria: "Servicios Digitales,Negocios",
            estudios_expertos: "Licenciatura",
            experiencia_experto: "Arquitecto de soluciones cloud y especialista en transformación digital. Experiencia en AWS, Azure y Google Cloud. He migrado más de 50 empresas a la nube y optimizado sus costos en un promedio del 30%. Especialista en seguridad informática y compliance.",
            email_experto: "diego.morales@cloudarchitect.com",
            telefono_experto: "+525523456789",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock13",
            nombre_experto: "Lic. Carmen Ruiz",
            categoria: "Digitalización de procesos,Optimización de procesos",
            estudios_expertos: "Maestría",
            experiencia_experto: "Especialista en digitalización y optimización de procesos empresariales. Experiencia en implementación de metodologías ágiles, Scrum y Kanban. He ayudado a más de 25 empresas a digitalizar sus procesos y mejorar su eficiencia operativa en un 40%. Certificada en Lean Six Sigma y Project Management Professional (PMP).",
            email_experto: "carmen.ruiz@processoptimization.com",
            telefono_experto: "+525512345678",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock14",
            nombre_experto: "Dr. Roberto Mendoza",
            categoria: "Capacitación y formación,Optimización de procesos",
            estudios_expertos: "Doctorado",
            experiencia_experto: "Consultor senior en capacitación empresarial y formación de equipos. Especialista en metodologías ágiles, liderazgo organizacional y desarrollo de competencias. He capacitado a más de 500 profesionales en Scrum, Kanban y gestión de proyectos. Experiencia en transformación cultural y mejora de procesos en empresas de diversos sectores.",
            email_experto: "roberto.mendoza@trainingexpert.com",
            telefono_experto: "+525598765432",
            tipo_usuario: "Experto gestor"
          },
          {
            ID: "mock15",
            nombre_experto: "Ing. Ana Sofía Vargas",
            categoria: "Digitalización de procesos,Capacitación y formación",
            estudios_expertos: "Maestría",
            experiencia_experto: "Especialista en transformación digital y formación de equipos de desarrollo. Experiencia en implementación de herramientas digitales, automatización de procesos y capacitación en metodologías ágiles. He liderado proyectos de digitalización en más de 30 empresas, mejorando su productividad en un promedio del 35%.",
            email_experto: "ana.vargas@digitaltransformation.com",
            telefono_experto: "+525545678901",
            tipo_usuario: "Experto gestor"
          }
        ]
      });
    }
  };

  // Función para calcular matches de expertos para un proyecto
  const calculateExpertMatches = (proyecto) => {
    if (!expertosData || !expertosData.expertos_formulario) {
      console.log('No hay datos de expertos disponibles');
      return 0;
    }

    const expertos = expertosData.expertos_formulario;
    console.log(`Calculando matches para proyecto: ${proyecto.nombreProyecto}`);
    console.log(`Total de expertos disponibles: ${expertos.length}`);
    let matchCount = 0;

    expertos.forEach(experto => {
      let puntuacion = 0;
      
      // Matching por categorías
      if (experto.categoria && proyecto.categoriasServicioBuscado) {
        const categoriasExperto = experto.categoria.split(',').map(cat => cat.trim().toLowerCase());
        const categoriasProyecto = proyecto.categoriasServicioBuscado.map(cat => cat.toLowerCase());
        
        // Buscar coincidencias exactas y parciales
        const matchesCategoria = categoriasProyecto.filter(catProyecto => 
          categoriasExperto.some(catExperto => {
            // Coincidencia exacta
            if (catExperto === catProyecto) return true;
            
            // Coincidencia parcial
            if (catExperto.includes(catProyecto) || catProyecto.includes(catExperto)) return true;
            
            // Coincidencias por palabras clave específicas
            const palabrasClave = {
              'servicios digitales': ['digital', 'tecnología', 'software', 'web', 'app', 'digitalización'],
              'negocios': ['negocio', 'empresa', 'estrategia', 'consultoría', 'gestión'],
              'investigación': ['investigación', 'análisis', 'datos', 'estudio', 'reporte'],
              'steam': ['tecnología', 'ciencia', 'ingeniería', 'matemáticas', 'arte'],
              'soluciones personalizadas': ['personalizado', 'custom', 'específico', 'adaptado'],
              'digitalización de procesos': ['digitalización', 'procesos', 'digital', 'automatización'],
              'optimización de procesos': ['optimización', 'procesos', 'mejora', 'eficiencia'],
              'capacitación y formación': ['capacitación', 'formación', 'entrenamiento', 'educación']
            };
            
            const palabrasExperto = palabrasClave[catExperto] || [];
            const palabrasProyecto = palabrasClave[catProyecto] || [];
            
            return palabrasExperto.some(palabra => 
              palabrasProyecto.some(palabraProyecto => 
                palabra.includes(palabraProyecto) || palabraProyecto.includes(palabra)
              )
            );
          })
        );
        
        // Puntuación más alta para coincidencias exactas
        const coincidenciasExactas = categoriasProyecto.filter(catProyecto => 
          categoriasExperto.includes(catProyecto)
        );
        
        puntuacion += (coincidenciasExactas.length / categoriasProyecto.length) * 60;
        puntuacion += ((matchesCategoria.length - coincidenciasExactas.length) / categoriasProyecto.length) * 30;
      }
      
      // Matching por industria
      if (experto.categoria && proyecto.industria) {
        const categoriasExperto = experto.categoria.toLowerCase();
        const industriaProyecto = proyecto.industria.toLowerCase();
        
        if (categoriasExperto.includes(industriaProyecto) || industriaProyecto.includes(categoriasExperto)) {
          puntuacion += 25;
        }
        
        const sectores = {
          'tecnología': ['software', 'digital', 'tech', 'informática'],
          'servicios': ['consultoría', 'asesoría', 'servicios'],
          'manufactura': ['industrial', 'producción', 'fabricación'],
          'comercio': ['retail', 'ventas', 'comercial']
        };
        
        Object.entries(sectores).forEach(([sector, palabras]) => {
          if (palabras.some(palabra => industriaProyecto.includes(palabra))) {
            if (palabras.some(palabra => categoriasExperto.includes(palabra))) {
              puntuacion += 15;
            }
          }
        });
      }
      
      // Matching por experiencia y objetivo
      if (experto.experiencia_experto && proyecto.objetivoEmpresa) {
        const experienciaLower = experto.experiencia_experto.toLowerCase();
        const objetivoLower = proyecto.objetivoEmpresa.toLowerCase();
        
        const palabrasClave = [
          'desarrollo', 'tecnología', 'digital', 'negocios', 'investigación', 'innovación',
          'software', 'sistema', 'proceso', 'optimización', 'mejora', 'estrategia',
          'análisis', 'datos', 'consultoría', 'asesoría', 'implementación', 'gestión'
        ];
        
        const matches = palabrasClave.filter(palabra => 
          experienciaLower.includes(palabra) && objetivoLower.includes(palabra)
        );
        
        puntuacion += (matches.length / palabrasClave.length) * 25;
      }
      
      // Bonus por nivel de estudios
      if (experto.estudios_expertos) {
        const estudios = experto.estudios_expertos.toLowerCase();
        if (estudios.includes('doctorado')) puntuacion += 10;
        else if (estudios.includes('maestría')) puntuacion += 8;
        else if (estudios.includes('licenciatura')) puntuacion += 5;
      }
      
      // Bonus por experiencia específica
      if (experto.experiencia_experto && proyecto.objetivoEmpresa) {
        const experienciaLower = experto.experiencia_experto.toLowerCase();
        const objetivoLower = proyecto.objetivoEmpresa.toLowerCase();
        
        const palabrasEspecificas = ['proyecto', 'empresa', 'cliente', 'implementación', 'solución'];
        const matchesEspecificos = palabrasEspecificas.filter(palabra => 
          experienciaLower.includes(palabra) && objetivoLower.includes(palabra)
        );
        
        puntuacion += matchesEspecificos.length * 2;
      }
      
      // Asegurar que la puntuación no exceda 100
      puntuacion = Math.min(puntuacion, 100);
      
      // Contar como match si la puntuación es >= 20
      if (puntuacion >= 20) {
        matchCount++;
        console.log(`Match encontrado: ${experto.nombre_experto} - ${puntuacion}%`);
      }
    });

    console.log(`Total de matches para ${proyecto.nombreProyecto}: ${matchCount}`);
    return matchCount;
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "publicado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "en_espera":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "en_proceso":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completado":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "publicado":
        return <FaUsers className="text-blue-600" />;
      case "en_espera":
        return <FaClock className="text-orange-600" />;
      case "en_proceso":
        return <FaSpinner className="text-yellow-600" />;
      case "completado":
        return <FaCheckCircle className="text-green-600" />;
      case "cancelado":
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaUsers className="text-gray-600" />;
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case "publicado":
        return "Publicado";
      case "en_espera":
        return "En Espera";
      case "en_proceso":
        return "En Proceso";
      case "completado":
        return "Completado";
      case "cancelado":
        return "Cancelado";
      default:
        return estado;
    }
  };

  const handleVerDetalles = (proyecto) => {
    setProyectoDetalle(proyecto);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setProyectoDetalle(null);
  };

  const handleCancelarProyecto = async (proyectoId) => {
    const proyecto = proyectos.find(p => p._id === proyectoId);
    
    setConfirmDialog({
      isOpen: true,
      title: "Cancelar Proyecto",
      message: `¿Estás seguro de que deseas cancelar el proyecto "${proyecto?.nombreProyecto}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        setCancelandoProyecto(proyectoId);
        
        try {
          const response = await fetch("/api/proyectos-publicados", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              proyectoId,
              nuevoEstado: "cancelado"
            }),
          });

          const result = await response.json();

          if (result.success) {
            toast.success("Proyecto cancelado exitosamente");
            // Actualizar la lista de proyectos
            setProyectosOriginales(proyectosOriginales.map(proyecto => 
              proyecto._id === proyectoId 
                ? { ...proyecto, estado: "cancelado" }
                : proyecto
            ));
          } else {
            toast.error(result.error || "Error al cancelar el proyecto");
          }
        } catch (error) {
          console.error("Error al cancelar proyecto:", error);
          toast.error("Error al cancelar el proyecto");
        } finally {
          setCancelandoProyecto(null);
          setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: null, type: "warning" });
        }
      },
      type: "warning"
    });
  };

  const handleViewMatches = (proyecto) => {
    setSelectedProyecto(proyecto);
    setModalOpen(true);
    setLoadingMatches(false);
    setErrorMatches(null);
    // Filtrar los matches ya obtenidos
    const filtered = allMatches.filter(match => match.nombreEmpresa === proyecto.nombreEmpresa && match.nombreProyecto === proyecto.nombreProyecto);
    setMatches(filtered);
  };

  const handleOpenContextMenu = (proyecto) => {
    setSelectedProyectoForContext(proyecto);
    setContextMenuOpen(true);
  };

  const handleOpenDashboard = (proyecto) => {
    setSelectedProyectoForDashboard(proyecto);
    setDashboardOpen(true);
  };

  const handleOpenPostulaciones = (proyecto) => {
    setSelectedProyectoForPostulaciones(proyecto);
    setPostulacionesOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A3D7C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center">
        <h3 className="text-lg font-semibold text-gray-700">Filtrar por estado:</h3>
        <div className="flex flex-wrap gap-2">
          {["todos", "publicado", "en_espera", "en_proceso", "completado", "cancelado"].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroEstado === estado
                  ? "bg-[#1A3D7C] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {estado === "todos" ? "Todos" : getEstadoTexto(estado)}
            </button>
          ))}
        </div>
      </div>

      {/* Tablero */}
      {proyectos.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <FaUsers className="text-6xl mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No hay proyectos publicados</h3>
          <p>Los proyectos que publiques aparecerán aquí</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((proyecto) => (
            <div
              onClick={() => setSeleccionado(proyecto)}
              key={proyecto._id}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
            >
              {/* Header de la tarjeta */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {getEstadoIcon(proyecto.estado)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(proyecto.estado)}`}>
                      {getEstadoTexto(proyecto.estado)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {new Date(proyecto.fechaPublicacion).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-[#1A3D7C] mb-1">
                  {proyecto.nombreEmpresa}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {proyecto.nombreProyecto}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FaIndustry />
                  <span>{proyecto.industria}</span>
                </div>
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-4 flex-1 flex flex-col">
                {/* Industria */}
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <FaIndustry />
                    Industria
                  </h4>
                  <p className="text-sm text-gray-600">{proyecto.industria}</p>
                </div>

                {/* Nombre del proyecto */}
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Nombre del Proyecto</h4>
                  <p className="text-sm text-gray-600">{proyecto.nombreProyecto}</p>
                </div>

                {/* Categorías del proyecto */}
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Categorías del Proyecto</h4>
                  <div className="flex flex-wrap gap-1">
                    {proyecto.categoriasServicioBuscado.map((categoria, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {categoria}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Descripción del proyecto */}
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Descripción del Proyecto</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {proyecto.objetivoEmpresa}
                  </p>
                </div>

                {/* Servicios */}
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Servicios</h4>
                  <div className="flex flex-wrap gap-1">
                    {proyecto.categoriasServicioBuscado.map((servicio, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        {servicio}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Objetivos (Categorizados) */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Objetivos (Categorizados)</h4>
                  <div className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                    <p className="text-sm text-gray-700">{proyecto.objetivoEmpresa}</p>
                  </div>
                </div>

                {/* Revisar matches */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaChartLine />
                    Revisar Matches
                  </h4>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">
                        Expertos encontrados: {proyecto.matchesGenerados}
                      </span>
                      <span className="text-xs font-semibold text-blue-600">
                        {proyecto.analisisOpenAI.puntuacionMatch}% compatibilidad
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mb-2">
                      {proyecto.analisisOpenAI.match}
                    </p>
                    <button className="w-full text-xs bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 transition-colors">
                      Ver propuestas
                    </button>
                  </div>
                </div>

                {/* Solicitar una cita */}
                <div className="mb-3">
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    Solicitar una cita
                  </button>
                </div>

                {/* Estadísticas */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 mb-4">
                  <div className="flex items-center gap-1">
                    <FaUsers />
                    <span>{proyecto.matchesGenerados} expertos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>{new Date(proyecto.fechaPublicacion).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
                {/* Botones de acción */}
                <div className="mt-auto flex flex-col gap-2 p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerDetalles(proyecto)}
                      className="flex-1 bg-[#1A3D7C] text-white px-4 py-2 rounded-lg hover:bg-[#0f2a5a] transition-colors flex items-center justify-center gap-2 text-xs"
                    >
                      <FaEye />
                      Ver Detalles
                    </button>
                    
                    {/* Botón de cancelar - solo mostrar si no está cancelado */}
                    {proyecto.estado !== "cancelado" && (
                      <button
                        onClick={() => handleCancelarProyecto(proyecto._id)}
                        disabled={cancelandoProyecto === proyecto._id}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center justify-center gap-2 text-xs"
                      >
                        {cancelandoProyecto === proyecto._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaBan />
                        )}
                        {cancelandoProyecto === proyecto._id ? "Cancelando..." : "Cancelar"}
                      </button>
                    )}
                  </div>
                  
                  {proyecto.estado === "publicado" || proyecto.estado === "en_espera" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPostulaciones(proyecto);
                      }}
                      className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs font-semibold flex items-center gap-2 justify-center"
                    >
                      <FaUserPlus />
                      Ver Postulaciones
                    </button>
                  ) : null}
                  
                  {proyecto.estado === "en_proceso" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDashboard(proyecto);
                      }}
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold flex items-center gap-2 justify-center"
                    >
                      <FaTachometerAlt />
                      Dashboard del Proyecto
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal de Detalles */}
      {showModal && proyectoDetalle && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleCerrarModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#1A3D7C]">Detalles del Proyecto</h2>
              <button
                onClick={handleCerrarModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Información General</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Empresa:</span>
                      <p className="text-gray-900">{proyectoDetalle.nombreEmpresa}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Proyecto:</span>
                      <p className="text-gray-900">{proyectoDetalle.nombreProyecto}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Industria:</span>
                      <p className="text-gray-900">{proyectoDetalle.industria}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Estado:</span>
                      <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(proyectoDetalle.estado)}`}>
                        {getEstadoTexto(proyectoDetalle.estado)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Fechas y Estadísticas</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Fecha de Publicación:</span>
                      <p className="text-gray-900">
                        {new Date(proyectoDetalle.fechaPublicacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Expertos Encontrados:</span>
                      <p className="text-gray-900">{proyectoDetalle.matchesGenerados} expertos</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">ID del Proyecto:</span>
                      <p className="text-gray-900 font-mono text-sm">{proyectoDetalle._id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Objetivo del proyecto */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Objetivo del Proyecto</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 leading-relaxed">{proyectoDetalle.objetivoEmpresa}</p>
                </div>
              </div>

              {/* Categorías de servicio */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Servicios Buscados</h3>
                <div className="flex flex-wrap gap-2">
                  {proyectoDetalle.categoriasServicioBuscado.map((categoria, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-[#1A3D7C] text-white text-sm rounded-lg font-medium"
                    >
                      {categoria}
                    </span>
                  ))}
                </div>
              </div>

              {/* Análisis de OpenAI */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaChartLine />
                  Análisis de Compatibilidad
                </h3>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Análisis General</h4>
                      <p className="text-gray-700 leading-relaxed">{proyectoDetalle.analisisOpenAI.match}</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Industria Mejor:</span>
                        <p className="text-gray-900">{proyectoDetalle.analisisOpenAI.industriaMejor}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Puntuación de Match:</span>
                        <p className="text-gray-900 font-semibold text-lg">{proyectoDetalle.analisisOpenAI.puntuacionMatch}%</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Razones del análisis */}
                  {proyectoDetalle.analisisOpenAI.razones && proyectoDetalle.analisisOpenAI.razones.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Razones del Análisis</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {proyectoDetalle.analisisOpenAI.razones.map((razon, index) => (
                          <li key={index} className="text-gray-700">{razon}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del usuario */}
              {proyectoDetalle.userId && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Información del Cliente</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-700">Nombre:</span>
                        <p className="text-gray-900">{proyectoDetalle.userId.name || 'No disponible'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <p className="text-gray-900">{proyectoDetalle.userId.email || 'No disponible'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={handleCerrarModal}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />

      {/* Modal de matches */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4 text-[#1A3D7C]">Expertos que hacen match</h2>
          {loadingMatches ? (
            <div className="flex justify-center items-center min-h-[100px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3D7C]"></div>
            </div>
          ) : errorMatches ? (
            <div className="text-red-500 text-center p-4">{errorMatches}</div>
          ) : matches.length === 0 ? (
            <div className="text-center text-gray-500 p-4">No hay expertos compatibles para este proyecto.</div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {matches.map((match, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold text-gray-800">{match.expertoId?.nombre || 'Experto'}</span>
                      <span className="ml-2 text-xs text-gray-500">{match.gradoExperiencia}</span>
                    </div>
                    <span className="text-xs font-semibold text-blue-600">{match.puntuacionMatch}% match</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1"><strong>Industrias:</strong> {Array.isArray(match.industriasExperto) ? match.industriasExperto.join(', ') : match.industriasExperto}</div>
                  <div className="text-xs text-gray-600 mb-1"><strong>Categorías:</strong> {match.categoriasExperto}</div>
                  <div className="text-xs text-gray-600 mb-1"><strong>Servicios propuestos:</strong> {match.serviciosPropuestos}</div>
                  <div className="text-xs text-gray-600 mb-1"><strong>Semblanza:</strong> {match.semblanza}</div>
                  <div className="text-xs text-gray-600 mb-1"><strong>Análisis:</strong> {match.match}</div>
                  <div className="text-xs text-gray-600 mb-1"><strong>Industria mejor alineada:</strong> {match.industriaMejor}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Menú Contextual de Proyecto */}
      <ProyectoContextMenu
        proyecto={selectedProyectoForContext}
        isOpen={contextMenuOpen}
        onClose={() => {
          setContextMenuOpen(false);
          setSelectedProyectoForContext(null);
        }}
        expertosData={expertosData}
      />

      {/* Dashboard Individual del Proyecto */}
      <ProyectoDashboard
        proyecto={selectedProyectoForDashboard}
        isOpen={dashboardOpen}
        onClose={() => {
          setDashboardOpen(false);
          setSelectedProyectoForDashboard(null);
        }}
        expertosData={expertosData}
      />

      {/* Postulaciones de Expertos */}
      <PostulacionesExpertos
        proyecto={selectedProyectoForPostulaciones}
        isOpen={postulacionesOpen}
        onClose={() => {
          setPostulacionesOpen(false);
          setSelectedProyectoForPostulaciones(null);
        }}
        expertosData={expertosData}
      />
    </div>
  );
} 