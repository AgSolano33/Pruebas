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

  // Datos
  const [empresa, setEmpresa] = useState(null); // InfoEmpresa
  const [prediagnostico, setPrediagnostico] = useState(null); // Prediagnóstico elegido
  const [ast, setAst] = useState(null); // AST vinculado al prediagnóstico o más reciente del usuario

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
        // 1) InfoEmpresa (tu endpoint regresa UN objeto)
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

  // ---------------- Acciones ----------------
  const handlePublish = async () => {
    try {
      // Conecta aquí tu endpoint real si aplica (ej. /api/propuesta/publicar)
      toast.success("✅ Publicado");
    } catch {
      toast.error("No se pudo publicar");
    }
  };

  const handleReject = async () => {
    try {
      // Conecta aquí tu endpoint real si aplica
      toast("Propuesta rechazada", { icon: "❌" });
    } catch {
      toast.error("No se pudo rechazar");
    }
  };

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
        <h2 className="text-base font-semibold mb-3">💡 Propuestas de Solución</h2>

        <Block title="Nombre de la propuesta">
          <input
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={proposalName}
            onChange={(e) => setProposalName(e.target.value)}
            placeholder="Ingresa un nombre…"
          />
        </Block>

        <p className="text-slate-600 text-sm leading-6 mb-3">
          {astParsed?.propuesta?.resumen ||
            astParsed?.proposal?.summary ||
            "Resumen generado a partir de la información de la empresa y tu prediagnóstico."}
        </p>

        <div className="text-sm mb-3">
          <strong>Industria: </strong>
          <span>{industria}</span>
          {presupuesto && <span className="ml-2 text-slate-500">· Presupuesto: {presupuesto}</span>}
        </div>

        <Block title="Objetivos Identificados :">
          <List items={objetivosIdentificados} />
        </Block>

        <Block title="Servicios:">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(servicios.length ? servicios : ["—"]).map((s, i) => (
              <button
                key={`${s}-${i}`}
                type="button"
                className="w-full border rounded-lg py-2 text-sm font-semibold bg-slate-50 hover:bg-slate-100"
              >
                {s}
              </button>
            ))}
          </div>
        </Block>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handlePublish}
            className="px-4 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 text-sm"
            type="button"
          >
            Publicar
          </button>
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded-md text-white bg-rose-600 hover:bg-rose-700 text-sm"
            type="button"
          >
            Rechazar
          </button>
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

/* ---------------- Subcomponentes ---------------- */

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