"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import config from "@/config";
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import MarcasCarousel from "@/components/MarcasCarousel";
import CarouselAliados from "@/components/CarouselAliados";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import FormDiagnostico from "@/components/FormDiagnostico";
import Image from "next/image";

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleOpenModal = () => {
    if (!session) {
      router.push(config.auth.callbackUrl);
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Carousel onOpenModal={handleOpenModal} />
        <div className="my-8">
          <MarcasCarousel />
        </div>

        {/* Sección Cómo funciona? */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#BFD730] mb-8">¿Cómo funciona?</h2>
            <p className="text-xl text-gray-600 mb-12">
              Somos la única plataforma en español que conecta, gestiona y capacita equipos freelance para ofrecer soluciones integrales para empresas.
            </p>
            {/* Espacio para la imagen */}
            <div className="mb-12 flex justify-center">
              <Image
                src="/funcion.png"
                alt="Cómo funciona CLA"
                width={800} 
                height={400} 
                layout="responsive"
                objectFit="contain"
              />
            </div>
          </div>
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
      </main>
      <Footer />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FormDiagnostico onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
