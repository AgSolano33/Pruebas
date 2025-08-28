"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Perfil() {
  const { data: session } = useSession();
  const [perfil, setPerfil] = useState({
    informacionpersonal: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      puesto: ""
    },
    informacionempresa: {
      _id: "", 
      sector: "",
      nombreEmpresa: "",
      ubicacion: "",
      codigoPostal: "",
      descripcionActividad: "",
      tieneEmpleados: false,
      numeroEmpleados: 0,
      ventasAnuales: 0,
      antiguedad: 0
    }
  });
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!session?.user?.id) return;

      try {
        // Traer info de usuario
        const userRes = await fetch(`/api/user/${session.user.id}`);
        const userData = await userRes.json();

        // Traer info de empresa
        const empresaRes = await fetch(`/api/infoEmpresa/${session.user.id}`);
        const empresaData = empresaRes.ok ? await empresaRes.json() : null;

        // Separar nombre y apellido
        const nombres = userData.name ? userData.name.split(" ") : ["", ""];
        const nombre = nombres[0] || "";
        const apellido = nombres.slice(1).join(" ") || "";

        setPerfil({
          informacionpersonal: {
            nombre,
            apellido,
            email: userData.email || "",
            telefono: userData.telefono || "",
            puesto: userData.puesto || ""
          },
          informacionempresa: {
            _id: empresaData?._id || "",
            nombreEmpresa: empresaData?.name || "",
            sector: empresaData?.tipoNegocio || "",
            ubicacion: empresaData?.ubicacion || "",
            codigoPostal: empresaData?.codigoPostal || "",
            descripcionActividad: empresaData?.descripcionActividad || "",
            tieneEmpleados: empresaData?.numEmpleados ? true : false,
            numeroEmpleados: parseInt(empresaData?.numEmpleados) || 0,
            ventasAnuales: parseInt(empresaData?.ventasAnuales) || 0,
            antiguedad: empresaData?.antiguedad || 0
          }
        });
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    fetchPerfil();
  }, [session]);

  const handleChange = (e, section, field) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setPerfil(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleActualizar = async () => {
  setMensaje("");

  try {
    // 1️⃣ Actualizar info personal (users)
    const userUpdateResponse = await fetch(`/api/user/${session.user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apellido: perfil.informacionpersonal.apellido,
        telefono: perfil.informacionpersonal.telefono,
        puesto: perfil.informacionpersonal.puesto,
        // Si tu backend necesita más campos como nivelEstudios o studies:
        // nivelEstudios: perfil.informacionpersonal.nivelEstudios,
        // studies: perfil.informacionpersonal.studies,
      })
    });

    if (!userUpdateResponse.ok) {
      const err = await userUpdateResponse.json();
      throw new Error(err.error || "Error al actualizar usuario");
    }

    // 2️⃣ Actualizar info empresa (infoEmpresa)
    const empresaResponse = await fetch(`/api/infoEmpresa/${session.user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipoNegocio: perfil.informacionempresa.sector,
        name: perfil.informacionempresa.nombreEmpresa,
        sector: perfil.informacionempresa.sector,
        ubicacion: perfil.informacionempresa.ubicacion,
        actividad: perfil.informacionempresa.descripcionActividad,
        descripcionActividad: perfil.informacionempresa.descripcionActividad,
        numEmpleados: perfil.informacionempresa.numeroEmpleados,
        ventasAnuales: perfil.informacionempresa.ventasAnuales,
        antiguedad: perfil.informacionempresa.antiguedad,
        cp: perfil.informacionempresa.codigoPostal,
      })
    });

    if (!empresaResponse.ok) {
      const err = await empresaResponse.json();
      throw new Error(err.error || "Error al actualizar InfoEmpresa");
    }

    setMensaje("Datos actualizados correctamente.");
    setEditando(false);

  } catch (error) {
    console.error(error);
    setMensaje(error.message || "Error de red al actualizar los datos.");
  }
};

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row gap-8">
      {/* Avatar y datos personales */}
      <div className="flex flex-col items-center md:items-start md:justify-start md:w-1/3 gap-4 min-w-[110px] md:min-w-[160px]">
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || perfil.informacionpersonal.nombre || "Avatar"}
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-200 max-w-full max-h-24"
            style={{ objectPosition: 'center' }}
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-700">
            {session.user?.name?.charAt(0) || perfil.informacionpersonal.nombre.charAt(0) || "U"}
          </div>
        )}
        <div className="text-center md:text-left">
          {editando ? (
            <>
              <input
                className="block w-full border rounded px-2 py-1 mb-1"
                value={perfil.informacionpersonal.nombre}
                disabled
              />
              <input
                className="block w-full border rounded px-2 py-1 mb-1"
                value={perfil.informacionpersonal.email}
                disabled
              />
              <input
                className="block w-full border rounded px-2 py-1 mb-1"
                value={perfil.informacionpersonal.apellido}
                onChange={e => handleChange(e, 'informacionpersonal', 'apellido')}
                placeholder="Apellido"
              />
              <input
                className="block w-full border rounded px-2 py-1 mb-1"
                value={perfil.informacionpersonal.puesto}
                onChange={e => handleChange(e, 'informacionpersonal', 'puesto')}
                placeholder="Puesto"
              />
            </>
          ) : (
            <>
              <div className="text-xl font-semibold text-[#1A3D7C]">
                {perfil.informacionpersonal.nombre} {perfil.informacionpersonal.apellido}
              </div>
              <div className="text-gray-500">{perfil.informacionpersonal.puesto}</div>
            </>
          )}
        </div>
      </div>

      {/* Información detallada */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-green-700">Email:</span>
            <span className="text-gray-800">{perfil.informacionpersonal.email}</span>
          </div>
          <div className="hidden md:block h-4 border-l border-gray-300"></div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-green-700">Teléfono:</span>
            {editando ? (
              <input
                className="border rounded px-2 py-1"
                value={perfil.informacionpersonal.telefono}
                onChange={e => handleChange(e, 'informacionpersonal', 'telefono')}
                placeholder="Teléfono"
              />
            ) : (
              <span className="text-gray-800">{perfil.informacionpersonal.telefono}</span>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-[#1A3D7C] mb-2">Empresa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-green-700">Nombre:</span>
              <span> {perfil.informacionempresa.nombreEmpresa}</span>
            </div>
            <div>
              <span className="font-semibold text-green-700">Sector:</span>
              {editando ? (
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={perfil.informacionempresa.sector}
                  onChange={e => handleChange(e, 'informacionempresa', 'sector')}
                  placeholder="Sector"
                />
              ) : (
                <span> {perfil.informacionempresa.sector}</span>
              )}
            </div>
            <div>
              <span className="font-semibold text-green-700">Ubicación:</span>
              {editando ? (
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={perfil.informacionempresa.ubicacion}
                  onChange={e => handleChange(e, 'informacionempresa', 'ubicacion')}
                  placeholder="Ubicación"
                />
              ) : (
                <span> {perfil.informacionempresa.ubicacion}</span>
              )}
            </div>
            <div className="md:col-span-2">
              <span className="font-semibold text-green-700">Descripción de la empresa:</span>
              {editando ? (
                <textarea
                  className="border rounded px-2 py-1 w-full min-h-[60px]"
                  value={perfil.informacionempresa.descripcionActividad}
                  onChange={e => handleChange(e, 'informacionempresa', 'descripcionActividad')}
                  placeholder="Describe la actividad de la empresa"
                  rows={3}
                />
              ) : (
                <span> {perfil.informacionempresa.descripcionActividad}</span>
              )}
            </div>
            <div>
              <span className="font-semibold text-green-700">Ventas Anuales:</span>
              {editando ? (
                <input
                  className="border rounded px-2 py-1 w-full"
                  type="number"
                  value={perfil.informacionempresa.ventasAnuales}
                  onChange={e => handleChange(e, 'informacionempresa', 'ventasAnuales')}
                  placeholder="Ventas anuales"
                />
              ) : (
                <span> ${perfil.informacionempresa.ventasAnuales?.toLocaleString()}</span>
              )}
            </div>
            <div>
              <span className="font-semibold text-green-700">Antigüedad:</span>
              {editando ? (
                <input
                  className="border rounded px-2 py-1 w-full"
                  type="number"
                  value={perfil.informacionempresa.antiguedad}
                  onChange={e => handleChange(e, 'informacionempresa', 'antiguedad')}
                  placeholder="Antigüedad (años)"
                />
              ) : (
                <span> {perfil.informacionempresa.antiguedad} años</span>
              )}
            </div>
          </div>
        </div>

        {mensaje && (
          <div className={`mt-2 text-sm ${mensaje.includes('correctamente') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </div>
        )}

        <div className="flex justify-end mt-4 gap-2">
          {editando ? (
            <>
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={handleActualizar}
              >
                Guardar
              </button>
              <button
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                onClick={() => { setEditando(false); setMensaje(""); }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setEditando(true)}
            >
              Actualizar datos
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
