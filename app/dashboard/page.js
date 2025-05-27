"use client";

import { useState } from "react";
import ButtonAccount from "@/components/ButtonAccount";
import FormDiagnostico from "@/components/FormDiagnostico";
import DiagnosticoList from "@/components/DiagnosticoList";
import Modal from "@/components/Modal";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-4xl mx-auto space-y-8">
        <ButtonAccount />
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">Diagnóstico Empresarial</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Nuevo Diagnóstico
          </button>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <FormDiagnostico onSuccess={() => setIsModalOpen(false)} />
        </Modal>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Diagnósticos Registrados</h2>
          <DiagnosticoList />
        </div>
      </section>
    </main>
  );
}
