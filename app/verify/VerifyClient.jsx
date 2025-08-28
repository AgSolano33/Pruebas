"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyClient() {
  const sp = useSearchParams();
  const token = sp.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verificando...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token no proporcionado ❌");
      return;
    }

    let ignore = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/verify?token=${encodeURIComponent(token)}`,
          { method: "GET", cache: "no-store" }
        );
        const data = await res.json();
        if (ignore) return;

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Correo verificado correctamente ✅");
        } else {
          setStatus("error");
          setMessage(data.error || "Token inválido o expirado ❌");
        }
      } catch {
        if (!ignore) {
          setStatus("error");
          setMessage("Error al conectar con el servidor ❌");
        }
      }
    })();

    return () => { ignore = true; };
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="p-6 max-w-md rounded-2xl shadow-lg bg-white text-center">
        {status === "loading" && <p className="text-gray-500">{message}</p>}
        {status === "success" && <p className="text-green-600 font-semibold">{message}</p>}
        {status === "error" && <p className="text-red-600 font-semibold">{message}</p>}
      </div>
    </main>
  );
}
