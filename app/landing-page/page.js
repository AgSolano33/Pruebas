"use client";

import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import ButtonSignin from "@/components/ButtonSignin";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <Header />
      
      <main className="container mx-auto px-4">
      
        <div className="my-8">
          <Carousel />
        </div>

       
        <div className="flex flex-col items-center justify-center py-16 space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Pre-diagnóstico Empresarial
          </h1>
          <p className="text-xl text-center max-w-2xl text-base-content/80">
            Optimiza tu empresa con nuestras herramientas de diagnóstico y consultoría especializada
          </p>
          <ButtonSignin 
            text="Comenzar Ahora" 
            extraStyle="btn-primary btn-lg"
          />
        </div>
      </main>
    </div>
  );
}
