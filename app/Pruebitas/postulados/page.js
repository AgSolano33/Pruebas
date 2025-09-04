export default function PostuladosPage() {
  // Datos estáticos para el diseño
  const expertos = [
    {
      id: 1,
      nombre: "Dr. María González",
      especialidad: "Inteligencia Artificial",
      progreso: 70,
      experiencia: "5 años",
      rating: 4.8
    },
    {
      id: 2,
      nombre: "Ing. Carlos Rodríguez",
      especialidad: "Desarrollo Web",
      progreso: 85,
      experiencia: "7 años",
      rating: 4.9
    },
    {
      id: 3,
      nombre: "Lic. Ana Martínez",
      especialidad: "Marketing Digital",
      progreso: 60,
      experiencia: "4 años",
      rating: 4.7
    },
    {
      id: 4,
      nombre: "Dr. Luis Fernández",
      especialidad: "Ciberseguridad",
      progreso: 90,
      experiencia: "8 años",
      rating: 4.9
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-blue-800 rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-800">COMMUNITY LAB</h1>
            <p className="text-lg text-blue-600 font-medium">ALLIANCE</p>
          </div>
        </div>

        {/* Botón Central */}
        <div className="flex justify-center mb-12">
          <button className="px-8 py-4 bg-white border-2 border-blue-800 rounded-xl text-blue-800 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50">
            Expertos Postulados
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="space-y-6">
          {expertos.map((experto) => (
              <div
                key={experto.id}
                className="bg-white border-2 border-blue-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-6">
                  {/* Icono de Usuario */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Información del Experto */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {experto.nombre}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">★</span>
                        <span className="text-gray-600 font-medium">
                          {experto.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-blue-600 font-medium mb-3">
                      {experto.especialidad} • {experto.experiencia} de experiencia
                    </p>
                  </div>

                  {/* Barra de Progreso y Porcentaje */}
                  <div className="flex items-center gap-4">
                    <div className="w-48">
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${experto.progreso}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-800">
                        {experto.progreso}%
                      </span>
                      <p className="text-sm text-gray-500">Progreso</p>
                    </div>
                  </div>
                </div>

                {/* Información Adicional */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        Disponible
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verificado
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200 font-medium">
                      Agendar Sesion
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Footer con estadísticas */}
        <div className="mt-12 bg-white border-2 border-blue-800 rounded-xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-800">{expertos.length}</div>
              <div className="text-gray-600">Total Expertos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-800">
                {Math.round(expertos.reduce((acc, exp) => acc + exp.progreso, 0) / expertos.length)}%
              </div>
              <div className="text-gray-600">Progreso Promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-800">
                {expertos.filter(exp => exp.rating >= 4.8).length}
              </div>
              <div className="text-gray-600">Altamente Calificados</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
