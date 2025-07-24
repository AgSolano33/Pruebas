import React from "react";
import ButtonSignin from "./ButtonSignin";

export default function Seccion7() {
  return (
    <section className="py-16 bg-white flex flex-col items-center justify-center text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-6 max-w-2xl leading-tight">
        No pierdas más tiempo buscando soluciones incompletas, empieza gratis ahora.
      </h2>
      <p className="text-xl md:text-2xl mb-10 max-w-xl">
        Dinos qué te duele. Nosotros te decimos quién puede ayudarte.
      </p>
      <ButtonSignin
        text="¡Quiero mi Diagnóstico Gratis!"
        extraStyle="btn-primary flex items-center justify-center text-xl px-10 py-5 rounded-full shadow-lg hover:scale-105 transition min-w-[300px] h-full min-h-[64px]"
      />
    </section>
  );
} 