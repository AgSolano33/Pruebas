"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import config from "@/config";
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import MarcasCarousel from "@/components/MarcasCarousel";
import CarouselAliados from "@/components/CarouselAliados";
import Seccion6 from "@/components/Seccion6";
import Seccion7 from "@/components/Seccion7";
import Seccion8 from "@/components/Seccion8";
import Seccion2 from "@/components/Seccion2";
import Footer from "@/components/Footer";
import Image from "next/image";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleOpenModal = () => {
    if (status === 'unauthenticated') {
      signIn(undefined, { callbackUrl: "/dashboard" });
      return;
    }
    router.push("/dashboard");
  };

  // Add loading state handling
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A3D7C] to-[#00AEEF]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Community Lab Alliance</h2>
          <p className="text-white/80">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Carousel onOpenModal={handleOpenModal} />
        <div className="my-8">
          <MarcasCarousel />
        </div>

        {/* Sección Cómo funciona? */}
        <section className="">
          <Seccion2 />
        </section>
        <section className="">
          <Seccion8 />
        </section>

        {/* Sección Testimonios */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Testimonios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-[#1A3D7C]">"Aprendí que no quiero ser programadora toda la vida pero que saber sobre Tecnología me va a ayudar en lo que sea que haga"</p>
                <p className="mt-4 text-right font-semibold text-[#BFD730]">- Belém, estudiante de preparatoria</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-[#1A3D7C]">"Gracias a su programa de digitalización tenemos mejor control de nuestros procesos y documentos, eso nos va a ayudar a crecer más".</p>
                <p className="mt-4 text-right font-semibold text-[#BFD730]">- Ivett, empleada en agencia de viajes</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-[#1A3D7C]">"En este equipo entendí que un científico también puede trabajar fuera del laboratorio y que los ingenieros necesitan aprender más sobre negocios y mercadotecnia".</p>
                <p className="mt-4 text-right font-semibold text-[#BFD730]">- Francisco- Freelance</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-[#1A3D7C]">"Los productos que adquirimos en el marketplace de Community Lab Alliance son mejores cada día".</p>
                <p className="mt-4 text-right font-semibold text-[#BFD730]">- Fabian- Gerente en empresa de electrocomponentes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Aliados */}
        <section className="py-16 bg-gray-50">
          <CarouselAliados />
        </section>
        {/* grid de ayudas */}
        <section className="">
          <Seccion6 />
        </section>
         {/* calltoaction */}
        <section className="">
          <Seccion7 />
        </section>
      </main>
      <Footer />
    </div>
  );
}
