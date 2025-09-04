"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import postulacionesStore from "@/libs/postulacionesStore";

/** ========= Datos de ejemplo (cámbialos por tus fetch/props) ========= */
const demo = {
  proyecto: "NOMBRE DEL PROYECTO",
  tareas: [
    {
      id: "T-1",
      estado: "todo",
      titulo: "Análisis de requerimientos",
      detalle:
        "Realizar un análisis detallado de los requerimientos del proyecto",
      responsable: "Pedro García",
      vence: "2024-02-15",
      prioridad: "Alta",
    },
    {
      id: "T-2",
      estado: "doing",
      titulo: "Desarrollo del frontend",
      detalle: "Implementar la interfaz de usuario",
      responsable: "Paola García",
      vence: "2024-02-25",
      prioridad: "Alta",
    },
  ],
  expertos: [
    {
      id: "E-1",
      nombre: "Alejandra",
      rol: "Experta",
      correo: "correo@mail.co",
      telefono: "614 345",
      foto: "/avatar-1.jpg", // ponla en /public o usa un placeholder
      rating: 5,
    },
    {
      id: "E-2",
      nombre: "Alejandra",
      rol: "Experta",
      correo: "correo@mail.co",
      telefono: "614 345",
      foto: "/avatar-1.jpg",
      rating: 5,
    },
  ],
  // para el pie: completadas vs en proceso
  progreso: { completadas: 1, enProceso: 3 },
};

/** ========= Utilidades ========= */
function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

/** ========= Componentes atómicos ========= */

function Card({ children, style = {} }) {
  const cardStyles = {
    top: '260px',
    left: '179px',
    width: '200px',
    height: '80px',
    backgroundColor: '#edfcf2',
    borderRadius: '12px',
    ...style
  };
  
  return (
    <div style={cardStyles}>
      {children}
    </div>
  );
}

function Badge({ children, tone = "default" }) {
  const tones = {
    default: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

function Button({ children, variant = "primary", ...props }) {
  const variants = {
    primary:
      "bg-[#2B74A8] text-white hover:brightness-110 focus:ring-4 focus:ring-[#2B74A8]/20",
    ghost:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-2 focus:ring-slate-200",
  };
  return (
    <button
      {...props}
      className={classNames(
        "px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition",
        variants[variant]
      )}
    >
      {children}
    </button>
  );
}

function StatCard({ icon, label, value, tone = "default" }) {
  const valueColors = {
    default: "text-green-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
  };
  
  const backgroundColors = {
    default: "#edfcf2",
    green: "#edfcf2",
    yellow: "#fdfae4",
    purple: "#f8f2ff",
  };
  
  return (
    <Card style={{ 
      position: 'relative',
      top: 'auto',
      left: 'auto',
      width: '100%',
      height: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: backgroundColors[tone]
    }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-gray-500 text-sm">{icon}</span>
        <span className="text-gray-600 text-xs font-medium">{label}</span>
      </div>
      <div className={classNames("text-2xl font-bold", valueColors[tone])}>{value}</div>
    </Card>
  );
}

function TaskCard({ t }) {
  const priorityColors = {
    Alta: "bg-red-100 text-red-800",
    Media: "bg-yellow-100 text-yellow-800",
    Baja: "bg-green-100 text-green-800",
  };
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-800 mb-1">{t.titulo}</h4>
          <p className="text-xs text-gray-500">{t.detalle}</p>
        </div>
        {t.estado === "todo" && (
          <button
            aria-label="Cerrar"
            className="text-red-500 hover:text-red-700 text-lg font-bold"
          >
            ×
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1">
            <span>👤</span> {t.responsable}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1">
            <span>📅</span> Vence: {t.vence}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className={classNames("px-2 py-1 rounded-full text-xs font-medium", priorityColors[t.prioridad] || priorityColors.Media)}>
            {t.prioridad}
          </span>
          <Button variant="ghost" className="text-xs px-2 py-1">Ver detalles</Button>
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ title, count, tone, children }) {
  const tones = {
    slate: "border-gray-200 bg-white",
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
  };
  const iconColors = {
    slate: "bg-gray-400",
    blue: "bg-blue-500",
    green: "bg-green-500",
  };
  return (
    <div
      className={classNames(
        "rounded-lg border p-3 min-h-[300px]",
        tones[tone]
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={classNames("w-2 h-2 rounded-full", iconColors[tone])}></div>
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        <span className="text-xs text-gray-500">({count})</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function PieChart({ completadas, enProceso }) {
  const total = Math.max(1, completadas + enProceso);
  const percentCompletadas = (completadas / total) * 100;
  const angle = (percentCompletadas / 100) * 360;

  // SVG pie manual con dos arcos
  const r = 60;
  const cx = 80;
  const cy = 80;

  const largeArc = angle > 180 ? 1 : 0;
  const rad = (ang) => (Math.PI / 180) * ang;
  const x = cx + r * Math.cos(rad(angle - 90));
  const y = cy + r * Math.sin(rad(angle - 90));

  const pathCompletadas = `
    M ${cx} ${cy}
    L ${cx} ${cy - r}
    A ${r} ${r} 0 ${largeArc} 1 ${x} ${y}
    Z
  `;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-700">
        <span>📊</span>
        <span className="font-semibold text-sm">Progreso</span>
        <span className="text-xs text-slate-500 ml-auto">
          {Math.round((completadas / total) * 100)} %
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-[160px_1fr] items-center gap-4">
        <svg viewBox="0 0 160 160" className="w-48 h-48 mx-auto">
          {/* fondo (en proceso) */}
          <circle cx={cx} cy={cy} r={r} fill="#1E3A8A" opacity="0.85" />
          {/* slice completadas */}
          <path d={pathCompletadas} fill="#A6CE39" />
        </svg>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm bg-[#A6CE39]" />
            <span className="text-sm text-slate-700">Completadas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm bg-[#1E3A8A]" />
            <span className="text-sm text-slate-700">En Proceso</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpertCard({ e }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow w-full">
      <div className="flex items-center gap-4">
        <img
          src={e.foto || "/avatar-placeholder.png"}
          alt={e.nombre}
          className="h-12 w-12 rounded-full object-cover border-2 border-gray-100"
        />
        <div className="flex-1">
          <div className="text-gray-900 font-semibold leading-tight mb-1">
            {e.nombre}
          </div>
          <div className="text-sm text-gray-500 mb-1">{e.rol}</div>
          <div className="space-y-1">
            <a
              href={`mailto:${e.correo}`}
              className="text-sm text-blue-600 hover:text-blue-800 underline block"
            >
              {e.correo}
            </a>
            <div className="text-sm text-gray-600">{e.telefono}</div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-yellow-400">{i < e.rating ? "★" : "☆"}</span>
        ))}
      </div>
    </div>
  );
}

function ExpertCarousel({ expertos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextExpert = () => {
    setCurrentIndex((prev) => (prev + 1) % expertos.length);
  };
  
  const prevExpert = () => {
    setCurrentIndex((prev) => (prev - 1 + expertos.length) % expertos.length);
  };
  
  if (expertos.length === 0) return null;
  
  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        {/* Flecha izquierda */}
        <button
          onClick={prevExpert}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <span className="text-gray-600 text-lg">‹</span>
        </button>
        
        {/* Contenedor del carrusel - muestra 2 tarjetas */}
        <div className="flex-1 overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 50}%)` }}
          >
            {expertos.map((experto, index) => (
              <div key={experto.id} className="w-1/2 flex-shrink-0 px-2">
                <ExpertCard e={experto} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Flecha derecha */}
        <button
          onClick={nextExpert}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <span className="text-gray-600 text-lg">›</span>
        </button>
      </div>
      
      {/* Indicadores de posición */}
      {expertos.length > 2 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(expertos.length / 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** ========= Page ========= */
export default function DashboardProyectoPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [expertosAsignados, setExpertosAsignados] = useState([]);
  const [loadingExpertos, setLoadingExpertos] = useState(true);
  const [errorExpertos, setErrorExpertos] = useState(null);
  const [currentExpertIndex, setCurrentExpertIndex] = useState(0);

  const todo = useMemo(
    () => demo.tareas.filter((t) => t.estado === "todo"),
    []
  );
  const doing = useMemo(
    () => demo.tareas.filter((t) => t.estado === "doing"),
    []
  );
  const done = useMemo(
    () => demo.tareas.filter((t) => t.estado === "done"),
    []
  );

  useEffect(() => {
    const loadExpertosAsignados = async () => {
      try {
        setLoadingExpertos(true);
        // 1) Cargar catálogo base de expertos
        const res = await fetch("/expertos.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const base = data?.expertos_formulario || [];

        // 2) Obtener postulaciones del proyecto y filtrar aceptadas
        const postulaciones = postulacionesStore.getPostulaciones(projectId);
        const aceptadas = (postulaciones || []).filter(p => p?.estado === "aceptada");

        // 3) Mapear a tarjetas ExpertCard (shape esperado por el componente)
        const asignados = aceptadas
          .map(p => {
            // p.experto puede venir con _id o ID; empatar con JSON
            const match = base.find(x => (x.ID === p.experto.ID) || (x.ID === p.experto._id) || (x.ID === p.experto.ID?.toString()));
            const nombre = match?.nombre_experto || p.experto?.nombre || "Experto";
            return {
              id: match?.ID || p.experto?._id || p.experto?.ID,
              nombre,
              rol: "Experto", // no hay rol en JSON, dejamos etiqueta fija
              correo: match?.email_experto || p.experto?.email || "",
              telefono: match?.telefono_experto || p.experto?.telefono || "",
              foto: "/avatar-1.jpg",
              rating: 5
            };
          })
          .filter(Boolean);

        setExpertosAsignados(asignados);
      } catch (err) {
        setErrorExpertos("No fue posible cargar expertos asignados.");
      } finally {
        setLoadingExpertos(false);
      }
    };

    if (projectId) {
      loadExpertosAsignados();
    } else {
      setLoadingExpertos(false);
    }
  }, [projectId]);

  return (
    <main className="min-h-screen bg-slate-50 py-8">
      {/* Contenedor */}
      <div className="mx-auto w-full max-w-6xl rounded-[20px] bg-white p-5 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src="/icon.png" alt="CLA" className="h-12 w-auto" />
            </div>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium">
              <span>←</span> Regresar
            </button>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-center text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">
          {demo.proyecto}
        </h1>

        {/* Métricas */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <StatCard icon="📋" label="Total Tareas" value={3} />
          <StatCard icon="⏳" label="En Proceso" value={1} tone="yellow" />
          <StatCard icon="👥" label="Expertos" value={demo.expertos.length} tone="purple" />
        </section>

        {/* Avances del Proyecto (Kanban) */}
        <section className="mb-12">
          <div className="mb-4 text-gray-800 text-lg font-semibold flex items-center gap-2">
            <span>🚀</span> Avances del Proyecto
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <KanbanColumn title="Por Hacer" count={todo.length} tone="slate">
              {todo.map((t) => (
                <TaskCard key={t.id} t={t} />
              ))}
            </KanbanColumn>

            <KanbanColumn title="En Proceso" count={doing.length} tone="blue">
              {doing.map((t) => (
                <TaskCard key={t.id} t={t} />
              ))}
            </KanbanColumn>

            <KanbanColumn title="Terminadas" count={done.length} tone="green">
              {done.map((t) => (
                <TaskCard key={t.id} t={t} />
              ))}
            </KanbanColumn>
          </div>
        </section>

        {/* Progreso y Acciones */}
        <section className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-500">📊</span>
              <span className="font-semibold text-sm text-gray-700">Progreso</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-8">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600">25:</span>
                    <span className="text-blue-600">En Proceso</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Completadas</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 items-center">
                <Button variant="primary" className="px-6 py-2">
                  Mis minutas
                </Button>
                <Button variant="primary" className="px-6 py-2">
                  DETALLES DEL PROYECTO
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Expertos */}
        <section className="mb-8">
          <div className="mb-4 text-gray-800 text-lg font-semibold flex items-center gap-2">
            <span>🧩</span> Expertos Asignados al Proyecto
          </div>

          {loadingExpertos ? (
            <div className="text-sm text-slate-500">Cargando expertos...</div>
          ) : errorExpertos ? (
            <div className="text-sm text-red-600">{errorExpertos}</div>
          ) : !projectId ? (
            <div className="text-sm text-slate-500">
              Proporciona ?projectId=... en la URL para ver expertos asignados.
            </div>
          ) : expertosAsignados.length === 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-slate-500 mb-4">No hay expertos asignados a este proyecto.</div>
              <div className="text-xs text-slate-400 mb-4">Previsualización de cómo se verían los expertos:</div>
              <ExpertCarousel expertos={demo.expertos} />
            </div>
          ) : (
            <ExpertCarousel expertos={expertosAsignados} />
          )}
        </section>
      </div>
    </main>
  );
}