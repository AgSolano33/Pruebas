"use client";
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';

export default function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [expertos, setExpertos] = useState([]);
  const [loadingExpertos, setLoadingExpertos] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchMatches(),
      fetchExpertos()
    ]);
    setLoading(false);
  };

  const fetchMatches = async () => {
    setLoadingMatch(true);
    try {
      const res = await fetch('/api/expert-matching?limit=10&page=1');
      const data = await res.json();
      if (data.success) {
        setMatches(data.data);
      }
    } catch (e) {}
    setLoadingMatch(false);
  };

  const fetchExpertos = async () => {
    setLoadingExpertos(true);
    try {
      const res = await fetch('/api/expertos');
      const data = await res.json();
      if (data.success) {
        setExpertos(data.data.filter(e => e.estado === 'pendiente'));
      }
    } catch (e) {}
    setLoadingExpertos(false);
  };

  const aprobarExperto = async (id) => {
    await fetch(`/api/expertos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'aprobado' })
    });
    fetchExpertos();
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Análisis de Match de Proyecto</h2>
          <div className="bg-gray-100 p-4 rounded">
            {loadingMatch ? 'Cargando...' : (
              <ul>
                {matches.length === 0 && <li>No hay análisis de match.</li>}
                {matches.map((match, idx) => (
                  <li key={match._id || idx} className="mb-2">
                    <b>Empresa:</b> {match.nombreEmpresa || 'N/A'}<br/>
                    <b>Puntuación:</b> {match.puntuacionMatch || 'N/A'}<br/>
                    <b>Fecha:</b> {match.fechaCreacion ? new Date(match.fechaCreacion).toLocaleString() : 'N/A'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Expertos para Aprobar</h2>
          <div className="bg-gray-100 p-4 rounded">
            {loadingExpertos ? 'Cargando...' : (
              <ul>
                {expertos.length === 0 && <li>No hay expertos pendientes.</li>}
                {expertos.map(experto => (
                  <li key={experto._id} className="mb-2 flex items-center justify-between">
                    <span>
                      <b>{experto.nombre}</b> - {experto.categorias} ({experto.gradoExperiencia})
                    </span>
                    <button
                      className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => aprobarExperto(experto._id)}
                    >
                      Aprobar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </>
  );
} 