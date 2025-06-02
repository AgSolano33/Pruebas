"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import ButtonSignin from "@/components/ButtonSignin";
import Modal from "@/components/Modal";
import FormDiagnostico from "@/components/FormDiagnostico";

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
          <button
            onClick={handleOpenModal}
            className="btn btn-lg text-white"
            style={{ backgroundColor: '#BFD730' }}
          >
            Nuevo Diagnóstico
          </button>
        </div>
      </main>

      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <FormDiagnostico onSuccess={handleCloseModal} />
      </Modal>
    </div>
  );
}
