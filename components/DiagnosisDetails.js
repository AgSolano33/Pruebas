  <>
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Métricas Principales</h2>
      {diagnosis.porcentajes ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(diagnosis.porcentajes).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <p className="text-2xl font-bold text-blue-600">{value}%</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Diagnóstico Central Pendiente
          </h3>
          <p className="text-gray-600 mb-4">
            Para visualizar las métricas principales de tu negocio, necesitas completar el diagnóstico central.
          </p>
          <p className="text-gray-500 mb-6">
            El diagnóstico central te proporcionará un análisis detallado y métricas específicas para mejorar tu negocio.
          </p>
          <Link 
            href="/diagnostico-central" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span>Crear Diagnóstico Central</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>

    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Diagnóstico General</h2>
      {diagnosis.analysis?.resumenGeneral ? (
        <div className="prose max-w-none">
          <p>{diagnosis.analysis.resumenGeneral}</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Diagnóstico General Pendiente
          </h3>
          <p className="text-gray-600 mb-4">
            El diagnóstico general te ayudará a entender mejor el estado actual de tu negocio.
          </p>
          <p className="text-gray-500 mb-6">
            Completa el diagnóstico central para obtener un análisis detallado y recomendaciones específicas.
          </p>
          <Link 
            href="/diagnostico-central" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span>Crear Diagnóstico Central</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>

    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Conclusiones</h2>
      {diagnosis.conclusion ? (
        <div className="prose max-w-none">
          <p>{diagnosis.conclusion}</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Conclusiones Pendientes
          </h3>
          <p className="text-gray-600 mb-4">
            Las conclusiones te proporcionarán un resumen de los hallazgos y recomendaciones clave.
          </p>
          <p className="text-gray-500 mb-6">
            Completa el diagnóstico central para obtener conclusiones detalladas y un plan de acción.
          </p>
          <Link 
            href="/diagnostico-central" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span>Crear Diagnóstico Central</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  </> 