"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import config from "@/config";

export default function DiagnosisDetails({ params }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  // Datos base
  const [empresa, setEmpresa] = useState(null); // InfoEmpresa
  const [prediagnostico, setPrediagnostico] = useState(null); // Prediagnóstico elegido
  const [ast, setAst] = useState(null); // AST vinculado al prediagnóstico o más reciente del usuario

  // Propuestas del asistente proyectosPreAST
  const [proyectos, setProyectos] = useState([]);
  const [loadingProyectos, setLoadingProyectos] = useState(false);
  const [generating, setGenerating] = useState(false);

  // UI
  const [proposalName, setProposalName] = useState("Nombre de la propuesta");

  // ---------------- Helpers ----------------
  const preId = useMemo(
    () => (params?.id ? decodeURIComponent(params.id) : ""),
    [params?.id]
  );

  const normalizeId = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object" && v.$oid) return v.$oid; // por si viene con $oid
    return String(v);
  };

  const lastByDate = (arr) =>
    Array.isArray(arr)
      ? [...arr].sort(
          (a, b) =>
            new Date(b?.updatedAt || b?.createdAt || 0) -
            new Date(a?.updatedAt || a?.createdAt || 0)
        )[0]
      : arr;

  const parseJSONSafe = (v) => {
    if (!v) return null;
    try {
      return typeof v === "string" ? JSON.parse(v) : v;
    } catch {
      return null;
    }
  };

  const toArray = (v) => (Array.isArray(v) ? v : v ? String(v).split(/[•\n,\.;]/g) : []);
  const cleanList = (arr) => (arr || []).map((x) => x?.toString().trim()).filter(Boolean);

  const sizeLabel = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num)) return "—";
    if (num <= 10) return "Micro empresa";
    if (num <= 50) return "Pequeña empresa";
    if (num <= 250) return "Mediana empresa";
    return "Grande";
  };

  const fmtMoney = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return v ?? "—";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(n);
  };

  // Carga AST: toma el que coincida con prediagnosticoId si existe, si no el más reciente
  const loadASTForUser = async (userId, prediagnosticoId) => {
    const res = await fetch(`/api/prediagnosticoAST/${userId}`, { cache: "no-store" });
    if (!res.ok) return null;
    const list = await res.json();
    const arr = Array.isArray(list) ? list : [];
    const byPre = arr.find((a) => normalizeId(a.prediagnosticoId) === prediagnosticoId);
    return byPre ?? lastByDate(arr) ?? null;
  };

  // ---------------- Carga inicial ----------------
  useEffect(() => {
    if (!session) {
      router.push(config?.auth?.callbackUrl || "/login");
      return;
    }
    if (!preId) return;

    const load = async () => {
      setIsLoading(true);
      try {
        // 1) InfoEmpresa
        try {
          const resEmp = await fetch(`/api/infoEmpresa/${session.user.id}`, { cache: "no-store" });
          if (resEmp.ok) {
            const emp = await resEmp.json();
            setEmpresa(emp || null);
          } else if (resEmp.status === 404) {
            setEmpresa(null);
          } else {
            toast.error("No se pudo cargar la información de la empresa");
          }
        } catch (e) {
          console.error(e);
          toast.error("Error de red al cargar InfoEmpresa");
        }

        // 2) Prediagnóstico (lista del usuario) -> filtra por params.id
        try {
          const resPre = await fetch(`/api/prediagnostico/${session.user.id}`, { cache: "no-store" });
          if (resPre.ok) {
            const list = await resPre.json();
            const chosen = (list || []).find((p) => normalizeId(p._id) === preId);
            setPrediagnostico(chosen || null);
            if (!chosen) toast.error("No encontré ese prediagnóstico");
          } else {
            toast.error("No se pudo cargar el prediagnóstico");
          }
        } catch (e) {
          console.error(e);
          toast.error("Error de red al cargar el prediagnóstico");
        }

        // 3) AST vinculado al prediagnóstico (o el más reciente)
        const foundAst = await loadASTForUser(session.user.id, preId);
        setAst(foundAst);

        // 4) Polling si no existe aún el AST (cada 3s hasta ~30s)
        if (!foundAst) {
          setIsPolling(true);
          let tries = 0;
          const maxTries = 10;
          const timer = setInterval(async () => {
            tries++;
            const again = await loadASTForUser(session.user.id, preId);
            if (again) {
              setAst(again);
              setIsPolling(false);
              clearInterval(timer);
            } else if (tries >= maxTries) {
              setIsPolling(false);
              clearInterval(timer);
            }
          }, 3000);
          return () => clearInterval(timer);
        }
      } catch (e) {
        console.error(e);
        toast.error("Error al cargar el diagnóstico");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [session, router, preId]);

  // ---------------- Derivados (AST y Prediagnóstico) ----------------
  const astParsed = useMemo(() => {
    const r = ast?.resultado;
    if (!r) return {};
    return typeof r === "string" ? (parseJSONSafe(r) || {}) : r;
  }, [ast]);

  // Nombre de propuesta sugerido (si existiera en otra estructura)
  useEffect(() => {
    const maybeName =
      astParsed?.propuesta?.nombre ||
      astParsed?.propuesta?.titulo ||
      astParsed?.proposal?.name;
    if (maybeName) setProposalName(maybeName);
  }, [astParsed]);

  const resumenEmpresa =
    astParsed?.resumenEmpresa ||
    astParsed?.resumen ||
    astParsed?.companySummary ||
    (() => {
      const empleados = empresa?.numEmpleados ?? empresa?.numeroEmpleados ?? "—";
      const giro = empresa?.actividad || empresa?.giroActividad || "—";
      return `La empresa ${empresa?.name || empresa?.nombreEmpresaProyecto || "—"} se dedica a ${giro}. Con ${empleados} empleados, busca optimizar procesos e incrementar clientes.`;
    })();

  const necesidades = useMemo(
    () => astParsed.DiagnosticoNecesidades || astParsed.necesidades || astParsed.needs || {},
    [astParsed]
  );

  const estrategiasFijas = cleanList(
    necesidades.EstrategiasFijas || necesidades.estrategias || []
  );

  const situacionActual =
    necesidades.SituacionActual ||
    necesidades.situacionActual ||
    prediagnostico?.preguntaIntentos ||
    resumenEmpresa;

  const retosPrincipales = cleanList(
    necesidades.RetosPrincipales ||
      necesidades.retos ||
      toArray(prediagnostico?.preguntaObstaculo)
  );

  const objetivosIdentificados = cleanList(
    necesidades.ObjetivosIdentificados ||
      necesidades.objetivos ||
      toArray(prediagnostico?.preguntasKpis)
  );

  const industria = astParsed.Industria || empresa?.actividad || empresa?.giroActividad || "—";
  const tamanoAST = astParsed.Tamano || null;
  const presupuesto = astParsed.Presupuesto || null;

  const servicios = cleanList(
    astParsed?.propuesta?.servicios ||
      astParsed?.proposal?.services ||
      astParsed?.Servicios ||
      []
  );

  // ---------------- Propuestas: fetch & generar ----------------
  const fetchProyectos = async () => {
    if (!session?.user?.id || !preId) return;
    setLoadingProyectos(true);
    try {
      const url = `/api/assistant/ProyectosPre?userId=${session.user.id}&prediagnosticoId=${preId}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudieron cargar las propuestas");
      setProyectos(Array.isArray(data?.proyectos) ? data.proyectos.slice(0, 3) : []);
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Error cargando propuestas");
    } finally {
      setLoadingProyectos(false);
    }
  };

  const handleGenerarPropuestas = async () => {
    try {
      if (!ast) {
        toast.error("Aún no hay AST para generar propuestas");
        return;
      }
      setGenerating(true);

      // Payload: mandamos TODO el AST + userId/prediagnosticoId normalizados
      const payload = {
        ...ast,
        userId: normalizeId(ast.userId) || session.user.id,
        prediagnosticoId: normalizeId(ast.prediagnosticoId) || preId,
      };

      const res = await fetch("/api/assistant/ProyectosPre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error generando propuestas");

      setProyectos(Array.isArray(data?.proyectos) ? data.proyectos.slice(0, 3) : []);
      toast.success("Propuestas generadas ✅");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "No se pudo generar");
    } finally {
      setGenerating(false);
    }
  };

  // Cargar propuestas guardadas al tener session + preId
  useEffect(() => {
    if (session?.user?.id && preId) {
      fetchProyectos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, preId]);

  // ---------------- UI ----------------
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="text-sm text-slate-600 hover:underline"
        >
          ← Volver al dashboard
        </button>
        <div className="flex items-baseline gap-2">
          <span className="px-2.5 py-1 rounded bg-slate-200 text-xs font-semibold">
            COMMUNITY LAB
          </span>
          <span className="text-[11px] tracking-widest text-slate-500">ALLIANCE</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-3">Detalles del Diagnóstico</h1>

      {/* Sección 1: Información de la Empresa */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
        <h2 className="text-base font-semibold mb-3">📌 Información de la Empresa</h2>

        {!empresa ? (
          <div className="text-sm text-slate-500">No hay información de empresa vinculada.</div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <InfoRow label="Nombre" value={empresa.name || empresa.nombreEmpresaProyecto || "—"} />
                <InfoRow label="Industria" value={empresa.actividad || empresa.giroActividad || "—"} />
                {empresa.ubicacion && <InfoRow label="Ubicación" value={empresa.ubicacion} />}
              </div>
              <div className="space-y-2">
                <InfoRow
                  label="Tamaño"
                  value={tamanoAST || sizeLabel(empresa.numEmpleados || empresa.numeroEmpleados)}
                />
                <InfoRow label="Ventas anuales" value={fmtMoney(empresa.ventasAnuales)} />
              </div>
            </div>
          </>
        )}
      </section>

      {/* Sección 2: Diagnóstico de Necesidades */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
        <h2 className="text-base font-semibold mb-3">🧩 Diagnóstico de Necesidades</h2>

        <div className="flex flex-wrap gap-2 mb-2">
          {(estrategiasFijas.length ? estrategiasFijas : ["—"]).map((t, i) => (
            <span key={`${t}-${i}`} className="px-3 py-1 rounded-full border text-xs bg-slate-50">
              {t}
            </span>
          ))}
        </div>

        <Block title="Situación actual">
          <p className="text-slate-600 text-sm leading-6">{situacionActual}</p>
        </Block>

        <Block title="Retos principales">
          <List items={retosPrincipales} />
        </Block>

        <Block title="Objetivos identificados">
          <List items={objetivosIdentificados} />
        </Block>
      </section>

      {/* Sección 3: Propuestas de Solución */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">💡 Propuestas de Solución</h2>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={fetchProyectos}
              disabled={loadingProyectos}
              className="px-3 py-1.5 text-sm rounded-md border hover:bg-slate-50 disabled:opacity-50"
            >
              {loadingProyectos ? "Cargando..." : "Refrescar"}
            </button>
            <button
              type="button"
              onClick={handleGenerarPropuestas}
              disabled={generating || !ast}
              className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {generating ? "Generando..." : "Generar 3 propuestas"}
            </button>
          </div>
        </div>

        {/* Grid de 3 propuestas del asistente (nombre, resumen, descripción) */}
        {proyectos.length === 0 ? (
          <div className="text-sm text-slate-600 mb-3">
            No hay propuestas guardadas todavía. Da clic en <strong>“Generar 3 propuestas”</strong>.
          </div>
        ) : null}

        <div className="grid md:grid-cols-3 gap-4">
          {proyectos.map((p, idx) => (
            <ProposalCard key={p._id || idx} p={p} idx={idx} />
          ))}
        </div>
      </section>

      {(isLoading || isPolling) && (
        <div className="text-center text-sm text-slate-500">
          {isLoading ? "Cargando…" : "Generando análisis… (buscando AST)"}
        </div>
      )}
    </div>
  );
}


function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-3 text-sm">
      <div className="text-slate-500">{label}:</div>
      <div className="text-slate-800">{value ?? "—"}</div>
    </div>
  );
}

function Block({ title, children }) {
  return (
    <div className="mt-3">
      <div className="font-semibold mb-1 text-sm">{title}</div>
      {children}
    </div>
  );
}

function List({ items = [] }) {
  if (!items.length) return <div className="text-sm text-slate-500">—</div>;
  return (
    <div className="grid gap-2">
      {items.map((t, i) => (
        <div key={`${t}-${i}`} className="text-sm border rounded-md bg-slate-50 px-3 py-2">
          {t}
        </div>
      ))}
    </div>
  );
}

function ProposalCard({ p, idx }) {
  return (
    <div className="border rounded-xl p-4 bg-slate-50">
      <div className="text-xs text-slate-500 mb-1">Propuesta {idx + 1}</div>

      <div className="font-semibold text-slate-900 mb-2">
        {p.nombreProyecto || "—"}
      </div>

      <div className="text-sm mb-2">
        <div className="font-semibold">Resumen</div>
        <p className="text-slate-700 leading-6">
          {p.resumenProyecto || "—"}
        </p>
      </div>

      <div className="text-sm">
        <div className="font-semibold">Descripción</div>
        <p className="text-slate-700 leading-6">
          {p.descripcionProyecto || "—"}
        </p>
      </div>
    </div>
  );
}
