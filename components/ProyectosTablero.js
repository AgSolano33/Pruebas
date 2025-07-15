"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaUsers, FaChartLine, FaClock, FaIndustry, FaCheckCircle, FaTimesCircle, FaSpinner, FaEye } from "react-icons/fa";
import Modal from "@/components/Modal";
import ProyectoContextMenu from "@/components/ProyectoContextMenu";

export default function ProyectosTablero() {
  const { data: session } = useSession();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [seleccionado, setSeleccionado] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [allMatches, setAllMatches] = useState([]);
  const [matches, setMatches] = useState([]); // <-- restaurar este estado
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [errorMatches, setErrorMatches] = useState(null);
  const [expertosData, setExpertosData] = useState(null);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [selectedProyectoForContext, setSelectedProyectoForContext] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProyectos();
      fetchExpertosData();
    }
  }, [session, filtroEstado]);

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
        setProyectos(result.data);
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
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
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
              <div className="p-4">
                {/* Análisis de OpenAI */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaChartLine />
                    Análisis de Compatibilidad
                  </h4>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">
                      {proyecto.analisisOpenAI.match}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        Industria: {proyecto.analisisOpenAI.industriaMejor}
                      </span>
                      <span className="text-xs font-semibold text-blue-600">
                        {proyecto.analisisOpenAI.puntuacionMatch}% match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Categorías de servicio */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Servicios Buscados:</h4>
                  <div className="flex flex-wrap gap-1">
                    {proyecto.categoriasServicioBuscado.map((categoria, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {categoria}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Objetivo */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Objetivo:</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {proyecto.objetivoEmpresa}
                  </p>
                </div>

                {/* Estadísticas */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1">
                    <FaUsers />
                    <span>{proyecto.matchesGenerados} expertos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>{new Date(proyecto.fechaPublicacion).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
                {/* Botón para ver matches */}
                <div className="mb-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenContextMenu(proyecto);
                    }}
                    className="px-3 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs font-semibold flex items-center gap-2"
                  >
                    <FaEye />
                    Ver expertos que hacen match
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
    </div>
  );
} 