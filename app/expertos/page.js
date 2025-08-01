"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaTachometerAlt, FaIndustry, FaCalendar } from "react-icons/fa";
import NotificacionesExperto from "@/components/NotificacionesExperto";
import ProyectosDisponibles from "@/components/ProyectosDisponibles";
import ExpertoDashboard from "@/components/ExpertoDashboard";
import Header from "@/components/Header";
import toast from "react-hot-toast";
import postulacionesStore from "@/libs/postulacionesStore";

const ExpertosPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [experto, setExperto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [propuestaVisible, setPropuestaVisible] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [isLoadingNotificaciones, setIsLoadingNotificaciones] = useState(true);
  const [notificacionExpandida, setNotificacionExpandida] = useState(null);
  const [expertosData, setExpertosData] = useState(null);
  const [activeTab, setActiveTab] = useState("perfil");
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [selectedProyectoForDashboard, setSelectedProyectoForDashboard] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/expertos?checkProfile=true");
          const data = await res.json();
          if (data.success && data.data) {
            setExperto(data.data);
          }
        } catch (e) {
          //
        } finally {
          setIsLoading(false);
        }
      } else if (status === "unauthenticated") {
        setIsLoading(false);
      }
    };
    fetchPerfil();
  }, [status]);

  useEffect(() => {
    const fetchExpertosData = async () => {
      try {
        const response = await fetch('/expertos.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExpertosData(data);
        
        // Simular que el usuario actual es "Pedro" (primer experto de la lista)
        if (data.expertos_formulario && data.expertos_formulario.length > 0) {
          const pedro = data.expertos_formulario[0];
          // Crear un perfil de experto simulado basado en Pedro
          const perfilPedro = {
            _id: pedro.ID,
            nombre: pedro.nombre_experto,
            semblanza: "Experto en servicios digitales y transformación empresarial",
            industrias: ["Tecnología", "Consultoría", "Digital"],
            categorias: pedro.categoria,
            gradoExperiencia: "Senior",
            experienciaProfesional: pedro.experiencia_experto,
            serviciosPropuestos: "Consultoría digital, Implementación de sistemas, Optimización de procesos",
            estado: "aprobado"
          };
          setExperto(perfilPedro);
        }
      } catch (error) {
        console.error('Error al cargar datos de expertos:', error);
        // Datos mock de respaldo para Pedro
        const perfilPedro = {
          _id: "pedro_001",
          nombre: "Pedro García",
          semblanza: "Experto en servicios digitales y transformación empresarial",
          industrias: ["Tecnología", "Consultoría", "Digital"],
          categorias: "Servicios Digitales,Negocios,STEAM",
          gradoExperiencia: "Senior",
          experienciaProfesional: "Más de 15 años en transformación digital y desarrollo de software.",
          serviciosPropuestos: "Consultoría digital, Implementación de sistemas, Optimización de procesos",
          estado: "aprobado"
        };
        setExperto(perfilPedro);
        setExpertosData({
          expertos_formulario: [
            {
              ID: "pedro_001",
              nombre_experto: "Pedro García",
              categoria: "Servicios Digitales,Negocios,STEAM",
              estudios_expertos: "Doctorado",
              experiencia_experto: "Más de 15 años en transformación digital y desarrollo de software.",
              email_experto: "pedro.garcia@digitalexpert.com",
              telefono_experto: "+525512345678",
              tipo_usuario: "Experto gestor"
            }
          ]
        });
      }
    };
    fetchExpertosData();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      if (experto?._id) {
        try {
          const res = await fetch(`/api/expert-matching?expertoId=${experto._id}&limit=100`);
          const data = await res.json();
          if (data.success && data.data) {
            setMatches(data.data);
          }
        } catch (e) {}
      }
    };
    const fetchProyectos = async () => {
      try {
        const res = await fetch(`/api/proyectos-publicados?limit=100&allProjects=true`);
        const data = await res.json();
        if (data.success && data.data) {
          setProyectos(data.data);
        }
      } catch (e) {}
    };
    if (experto?._id) {
      fetchMatches();
      fetchProyectos();
    }
  }, [experto]);

  useEffect(() => {
    // Obtener proyectos donde el experto fue aceptado
    const fetchProyectosAceptados = async () => {
      if (experto?._id) {
        try {
          setIsLoadingNotificaciones(true);
          
          // Obtener todos los proyectos
          const response = await fetch('/api/proyectos-publicados');
          if (response.ok) {
            const data = await response.json();
            const proyectos = data.data || [];
            
            // Filtrar proyectos donde Pedro fue aceptado
            const proyectosAceptados = proyectos.filter(proyecto => {
              const postulaciones = postulacionesStore.getPostulaciones(proyecto._id);
              return postulaciones.some(post => 
                post.experto._id === experto._id && post.estado === 'aceptada'
              );
            });
            
            // Guardar los proyectos completos para usar en el dashboard
            setProyectos(proyectos);
            
            // Convertir a formato de notificaciones para mostrar
            const notificacionesFormateadas = proyectosAceptados.map(proyecto => ({
              _id: proyecto._id,
              nombreProyecto: proyecto.nombreProyecto,
              nombreEmpresa: proyecto.nombreEmpresa,
              industria: proyecto.industria,
              descripcionProyecto: proyecto.objetivoEmpresa,
              analisisMatch: `Has sido aceptado para trabajar en este proyecto. Estado: ${proyecto.estado}`,
              estado: proyecto.estado
            }));
            
            console.log('Proyectos aceptados encontrados:', proyectosAceptados.length);
            console.log('Notificaciones formateadas:', notificacionesFormateadas);
            
            setNotificaciones(notificacionesFormateadas);
          } else {
            console.error('Error al cargar proyectos');
            setNotificaciones([]);
          }
        } catch (error) {
          console.error('Error al cargar proyectos:', error);
          setNotificaciones([]);
        } finally {
          setIsLoadingNotificaciones(false);
        }
      }
    };
    
    if (experto?._id) {
      fetchProyectosAceptados();
    }
  }, [experto?._id]);

  if (status === "loading" || isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar para pantallas grandes */}
        <aside className="hidden lg:block w-1/4 flex-shrink-0">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg mb-2">Mis proyectos</h3>
              <div className="space-y-2">
                <div className="bg-gray-100 rounded p-2">Proyectos sugeridos</div>
                <div className="bg-gray-100 rounded p-2">Proyectos activos</div>
                <div className="bg-gray-100 rounded p-2">Proyectos finalizados</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg mb-2">Mis servicios</h3>
              <div className="text-gray-400">(Próximamente)</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg mb-2">Mi contabilidad</h3>
              <button
                onClick={() => toast.info('Próximamente: sección de contabilidad')}
                className="w-full text-left text-gray-400 hover:text-gray-700 px-0 py-0 bg-transparent border-none outline-none cursor-pointer"
              >
                (Próximamente)
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 w-full">
          {/* Layout para pantallas medianas y pequeñas */}
          <div className="lg:hidden flex flex-col gap-4 mb-8">
            <button
              onClick={() => router.push("/expertos/editar")}
              className="bg-[#1A3D7C] text-white px-4 py-2 rounded-md hover:bg-[#0f2a5a] transition-colors shadow self-start"
            >
              Editar perfil
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {experto?.nombre || session.user.name || "Nombre del Experto"}
            </h1>
            {/* Información del experto */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col w-full min-h-[220px]">
              <h2 className="font-semibold text-lg mb-2">Tu información</h2>
              {experto ? (
                <>
                  <div className="mb-2"><span className="font-medium">Semblanza:</span> {experto.semblanza}</div>
                  <div className="mb-2"><span className="font-medium">Industrias:</span> {experto.industrias?.join(", ")}</div>
                  <div className="mb-2"><span className="font-medium">Categorías:</span> {experto.categorias}</div>
                  <div className="mb-2"><span className="font-medium">Grado de experiencia:</span> {experto.gradoExperiencia}</div>
                  <div className="mb-2"><span className="font-medium">Experiencia profesional:</span> {experto.experienciaProfesional}</div>
                  <div className="mb-2"><span className="font-medium">Servicios propuestos:</span> {experto.serviciosPropuestos}</div>
                </>
              ) : (
                <button
                  onClick={() => router.push("/expertos/editar")}
                  className="bg-[#1A3D7C] text-white px-4 py-2 rounded-md hover:bg-[#0f2a5a] transition-colors shadow self-start mt-2"
                >
                  Crear perfil
                </button>
              )}
              {/* Calificación (placeholder) */}
              <div className="mt-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
                <span className="ml-2 text-gray-400 text-sm">(Próximamente)</span>
              </div>
            </div>
            {/* Servicios sugeridos */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-center min-h-[100px]">
              <h2 className="font-semibold text-base mb-2">Servicios sugeridos</h2>
              <div className="text-gray-400 text-sm">(Próximamente)</div>
            </div>
            {/* Habilidades que los clientes buscan */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-center min-h-[100px]">
              <h2 className="font-semibold text-base mb-2">Habilidades que los clientes buscan</h2>
              <div className="text-gray-400 text-sm">(Próximamente)</div>
            </div>
            {/* Mis servicios */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg mb-2">Mis servicios</h3>
              <div className="text-gray-400">(Próximamente)</div>
            </div>
            {/* Mi contabilidad */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg mb-2">Mi contabilidad</h3>
              <button
                onClick={() => toast.info('Próximamente: sección de contabilidad')}
                className="w-full text-left text-gray-400 hover:text-gray-700 px-0 py-0 bg-transparent border-none outline-none cursor-pointer"
              >
                (Próximamente)
              </button>
            </div>
            {/* Mis proyectos */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg mb-2">Mis proyectos</h3>
              <div className="space-y-2">
                <div className="bg-gray-100 rounded p-2">Proyectos sugeridos</div>
                <div className="bg-gray-100 rounded p-2">Proyectos activos</div>
                <div className="bg-gray-100 rounded p-2">Proyectos finalizados</div>
              </div>
            </div>
          </div>

          {/* Layout para pantallas grandes (como estaba) */}
          <div className="hidden lg:block">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {experto?.nombre || session.user.name || "Nombre del Experto"}
                </h1>
              </div>
              <button
                onClick={() => router.push("/expertos/editar")}
                className="bg-[#1A3D7C] text-white px-4 py-2 rounded-md hover:bg-[#0f2a5a] transition-colors shadow self-start sm:self-auto"
              >
                Editar perfil
              </button>
            </div>

            {/* Información del experto: sola y ancha */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow p-6 flex flex-col w-full min-h-[260px]">
                <h2 className="font-semibold text-lg mb-2">Tu información</h2>
                {experto ? (
                  <>
                    <div className="mb-2"><span className="font-medium">Semblanza:</span> {experto.semblanza}</div>
                    <div className="mb-2"><span className="font-medium">Industrias:</span> {experto.industrias?.join(", ")}</div>
                    <div className="mb-2"><span className="font-medium">Categorías:</span> {experto.categorias}</div>
                    <div className="mb-2"><span className="font-medium">Grado de experiencia:</span> {experto.gradoExperiencia}</div>
                    <div className="mb-2"><span className="font-medium">Experiencia profesional:</span> {experto.experienciaProfesional}</div>
                    <div className="mb-2"><span className="font-medium">Servicios propuestos:</span> {experto.serviciosPropuestos}</div>
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/expertos/editar")}
                    className="bg-[#1A3D7C] text-white px-4 py-2 rounded-md hover:bg-[#0f2a5a] transition-colors shadow self-start mt-2"
                  >
                    Crear perfil
                  </button>
                )}
                {/* Calificación (placeholder) */}
                <div className="mt-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                  <span className="ml-2 text-gray-400 text-sm">(Próximamente)</span>
                </div>
              </div>
            </div>

            {/* Segunda fila: Servicios sugeridos y Habilidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
              {/* Servicios sugeridos */}
              <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-center min-h-[120px]">
                <h2 className="font-semibold text-base mb-2">Servicios sugeridos</h2>
                <div className="text-gray-400 text-sm">(Próximamente)</div>
              </div>
              {/* Habilidades que los clientes buscan */}
              <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-center min-h-[120px]">
                <h2 className="font-semibold text-base mb-2">Habilidades que los clientes buscan</h2>
                <div className="text-gray-400 text-sm">(Próximamente)</div>
              </div>
            </div>
          </div>

          {/* Proyectos de los que formas parte */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="font-semibold text-lg mb-4">Proyectos de los que formas parte</h2>
            <div className="space-y-4">
              {isLoadingNotificaciones && (
                <div className="text-gray-400">Cargando proyectos...</div>
              )}
              {!isLoadingNotificaciones && notificaciones.length === 0 && (
                <div className="bg-gray-100 rounded p-4 text-gray-400">No formas parte de ningún proyecto aún.</div>
              )}
                            {notificaciones.map((notif, idx) => {
                const expandida = notificacionExpandida === notif._id;
                return (
                  <div
                    key={notif._id || idx}
                    className={`bg-white rounded-lg border shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${expandida ? 'ring-2 ring-[#1A3D7C] shadow-lg' : ''}`}
                    onClick={() => setNotificacionExpandida(expandida ? null : notif._id)}
                  >
                    {/* Header de la tarjeta */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            Proyecto Activo
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {new Date().toLocaleDateString('es-ES')}
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-[#1A3D7C] mb-1">
                        {notif.nombreEmpresa}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {notif.nombreProyecto}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaIndustry />
                        <span>{notif.industria}</span>
                      </div>
                    </div>

                    {/* Contenido expandido */}
                    {expandida && (
                      <>
                        <div className="mb-2 text-sm text-gray-600">{notif.nombreEmpresa} &middot; {notif.industria}</div>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                          {/* Industria */}
                          <div className="bg-white rounded shadow p-3">
                            <div className="font-semibold mb-1 text-sm">Industria</div>
                            <div className="text-gray-700 text-sm">{notif.industria}</div>
                          </div>

                          {/* Nombre del proyecto */}
                          <div className="bg-white rounded shadow p-3">
                            <div className="font-semibold mb-1 text-sm">Nombre del Proyecto</div>
                            <div className="text-gray-700 text-sm">{notif.nombreProyecto}</div>
                          </div>

                          {/* Categorías del proyecto */}
                          <div className="bg-white rounded shadow p-3">
                            <div className="font-semibold mb-1 text-sm">Categorías del Proyecto</div>
                            <div className="flex flex-wrap gap-1">
                              {notif.categoriasServicioBuscado?.map((categoria, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  {categoria}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Descripción del proyecto */}
                          <div className="bg-white rounded shadow p-3">
                            <div className="font-semibold mb-1 text-sm">Descripción del Proyecto</div>
                            <div className="text-gray-700 text-sm">{notif.descripcionProyecto}</div>
                          </div>

                          {/* Servicios */}
                          <div className="bg-white rounded shadow p-3">
                            <div className="font-semibold mb-1 text-sm">Servicios</div>
                            <div className="flex flex-wrap gap-1">
                              {notif.categoriasServicioBuscado?.map((servicio, index) => (
                                <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  {servicio}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Objetivos (Categorizados) */}
                          <div className="bg-white rounded shadow p-3">
                            <div className="font-semibold mb-1 text-sm">Objetivos (Categorizados)</div>
                            <div className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                              <div className="text-gray-700 text-sm">{notif.descripcionProyecto}</div>
                            </div>
                          </div>

                          {/* % de compatibilidad */}
                          <div className="bg-white rounded shadow p-3">
                            <div className="font-semibold mb-1 text-sm">% de Compatibilidad</div>
                            <div className="flex items-center gap-2">
                              <div className="text-2xl font-bold text-blue-600">{notif.puntuacionMatch}%</div>
                              <div className="text-xs text-gray-500">match</div>
                            </div>
                          </div>

                          {/* Justificación de compatibilidad */}
                          <div className="bg-white rounded shadow p-3">
                            <div className="font-semibold mb-1 text-sm">Justificación de Compatibilidad</div>
                            <div className="text-gray-700 text-sm">{notif.analisisMatch}</div>
                          </div>

                          {/* Botones de acción */}
                          <div className="flex gap-2 mt-4">
                            <button className="flex-1 bg-[#1A3D7C] text-white px-4 py-2 rounded-md hover:bg-[#0f2a5a] transition-colors shadow text-sm">
                              Postularse al Proyecto
                            </button>
                            <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow text-sm">
                              Agendar una Cita
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nueva sección: Proyectos Disponibles */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="font-semibold text-lg mb-4">Proyectos Disponibles</h2>
            <ProyectosDisponibles expertoData={experto} />
          </div>
        </main>
      </div>

      {/* Modal del Dashboard del Experto */}
      {dashboardOpen && selectedProyectoForDashboard && (
        <ExpertoDashboard
          proyecto={selectedProyectoForDashboard}
          experto={experto}
          isOpen={dashboardOpen}
          onClose={() => {
            setDashboardOpen(false);
            setSelectedProyectoForDashboard(null);
          }}
        />
      )}
    </div>
  );
};

export default ExpertosPage; 