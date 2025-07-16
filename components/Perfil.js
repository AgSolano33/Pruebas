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
      sector: "",
      nombreEmpresa: "",
      ubicacion: "",
      ventasAnuales: 0,
      antiguedad: 0
    }
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch(`/api/Contact?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setPerfil(data[0]);
          }
        }
      } catch (error) {
        // Manejo de error
      }
    };
    fetchPerfil();
  }, [session]);

  if (!session) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Por favor inicia sesión para ver tu perfil</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8">
      {/* Avatar y datos personales */}
      <div className="flex flex-col items-center md:items-start md:w-1/3 gap-4">
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || perfil.informacionpersonal.nombre || "Avatar"}
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-700">
            {session.user?.name?.charAt(0) || perfil.informacionpersonal.nombre.charAt(0) || "U"}
          </div>
        )}
        <div className="text-center md:text-left">
          <div className="text-xl font-semibold text-[#1A3D7C]">
            {perfil.informacionpersonal.nombre} {perfil.informacionpersonal.apellido}
          </div>
          <div className="text-gray-500">{perfil.informacionpersonal.puesto}</div>
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
            <span className="text-gray-800">{perfil.informacionpersonal.telefono}</span>
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-[#1A3D7C] mb-2">Empresa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-green-700">Nombre:</span> {perfil.informacionempresa.nombreEmpresa}
            </div>
            <div>
              <span className="font-semibold text-green-700">Sector:</span> {perfil.informacionempresa.sector}
            </div>
            <div>
              <span className="font-semibold text-green-700">Ubicación:</span> {perfil.informacionempresa.ubicacion}
            </div>
            <div>
              <span className="font-semibold text-green-700">Ventas Anuales:</span> ${perfil.informacionempresa.ventasAnuales?.toLocaleString()}
            </div>
            <div>
              <span className="font-semibold text-green-700">Antigüedad:</span> {perfil.informacionempresa.antiguedad} años
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Actualizar datos
          </button>
        </div>
      </div>
    </div>
  );
} 