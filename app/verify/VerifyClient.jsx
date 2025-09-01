"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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
        const res = await fetch(`/api/verify?token=${encodeURIComponent(token)}`, {
          method: "GET",
          cache: "no-store",
        });
        const data = await res.json();
        if (ignore) return;

        if (res.ok) {
          setStatus("success");
          setMessage("Correo verificado")
        } else {
          setStatus("error");
        }
      } catch {
        if (!ignore) {
          setStatus("error");
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [token]);

  if (status === "success") {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center">
        {/* Logo */}
        <header className="w-full max-w-5xl px-6 pt-12">
          <div className="flex justify-center">
 <img
  src="/icon.png"
  alt="Community Lab Alliance"
  className="h-21 w-auto"
/>

          </div>
          <hr className="mt-6 border-t-2 border-[#2F6E93]/30" />
        </header>

        {/* Contenido */}
        <section className="w-full max-w-3xl px-6 text-center mt-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#60656B]">
            ¡Tu correo ha sido confirmado con éxito!
          </h1>

          {/* Icono */}
          <div className="mt-8 flex justify-center">
<svg
  viewBox="0 0 240 180"
  width="90"
  height="70"
  aria-hidden="true"
>
  {/* Fondo verde con esquinas redondeadas */}
  <rect x="6" y="12" width="228" height="156" rx="18" fill="#B2D23E" />

  {/* Chevron blanco grueso (relleno, extremos rectos) */}
  <polygon
    fill="#FFFFFF"
    points="
      24,54     120,112     216,54
      216,72    120,130     24,72
    "
  />
</svg>
            </div>

          <p className="mt-8 text-base md:text-lg text-[#30343A] leading-relaxed">
            Muchas gracias por verificar tu correo electrónico. Ahora puedes continuar y
            descubrir el mundo de soluciones y redes que tenemos para ti.
          </p>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-block rounded-full bg-[#1F6FA3] px-8 py-3 text-white text-lg font-semibold shadow-md hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-[#1F6FA3]/30"
            >
              Continúa a CLA
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="p-6 max-w-md rounded-2xl shadow-lg bg-white text-center">
        {status === "loading" && <p className="text-gray-500">{message}</p>}
        {status === "error" && (
          <>
            <p className="text-red-600 font-semibold mb-4">{message}</p>
            <Link
              href="/"
              className="inline-block rounded-full bg-gray-800 px-5 py-2 text-white font-medium hover:opacity-90"
            >
              Volver al inicio
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
