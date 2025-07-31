import { useState } from "react";

const FormularioEficienciaOperativa = ({ onAnalysisComplete, userId, metricKey }) => {
  const [formData, setFormData] = useState({
    // Procesos y Flujos de Trabajo (PF)
    pf_c1: "",
    pf_c2: "",
    pf_abierta: "",
    
    // Gestión de Recursos (GR)
    gr_c1: "",
    gr_c2: "",
    gr_abierta: "",
    
    // Calidad y Control (CC)
    cc_c1: "",
    cc_c2: "",
    cc_abierta: "",
    
    // Productividad (PR)
    pr_c1: "",
    pr_c2: "",
    pr_abierta: "",
    
    // Optimización de Costos (OC)
    oc_c1: "",
    oc_c2: "",
    oc_abierta: "",
    
    // Gestión de Inventarios (GI)
    gi_c1: "",
    gi_c2: "",
    gi_abierta: "",
    
    // Logística y Distribución (LD)
    ld_c1: "",
    ld_c2: "",
    ld_abierta: "",
    
    // Medición y KPIs (MK)
    mk_c1: "",
    mk_c2: "",
    mk_abierta: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScaleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTextChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calcular el valor porcentual basado en las respuestas
      const closedQuestions = ['pf_c1', 'pf_c2', 'gr_c1', 'gr_c2', 'cc_c1', 'cc_c2', 'pr_c1', 'pr_c2', 'oc_c1', 'oc_c2', 'gi_c1', 'gi_c2', 'ld_c1', 'ld_c2', 'mk_c1', 'mk_c2'];
      const answeredQuestions = closedQuestions.filter(q => formData[q] !== "");
      const totalScore = answeredQuestions.reduce((sum, q) => sum + parseInt(formData[q]), 0);
      const averageScore = answeredQuestions.length > 0 ? totalScore / answeredQuestions.length : 0;
      const valorPorcentual = Math.round((averageScore / 5) * 100);

      // Preparar datos para el análisis
      const datosMetrica = {
        formData,
        valorPorcentual,
        metricKey: 'eficienciaOperativa',
        metricTitle: 'Eficiencia Operativa'
      };

      const response = await fetch(`/api/metric-analysis/${metricKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          metricKey,
          metricTitle: 'Eficiencia Operativa',
          valorPorcentual,
          empresa: { nombre: 'Empresa', sector: 'General' },
          datosMetrica
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          onAnalysisComplete(result.metricAnalysis);
        } else {
          alert('Error al analizar los datos: ' + result.error);
        }
      } else {
        alert('Error al enviar el formulario');
      }
    } catch (error) {
      alert('Error al enviar el formulario: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Evaluación de Eficiencia Operativa</h3>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Procesos y Flujos de Trabajo (PF) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Procesos y Flujos de Trabajo (PF)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan eficientes y optimizados están los procesos principales?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="pf_c1"
                      value={value}
                      checked={formData.pf_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('pf_c1', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Qué tan bien documentados y estandarizados están los flujos de trabajo?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="pf_c2"
                      value={value}
                      checked={formData.pf_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('pf_c2', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. ¿Qué procesos podrían optimizarse para mejorar la eficiencia? (Opcional)
              </label>
              <textarea
                value={formData.pf_abierta}
                onChange={(e) => handleTextChange('pf_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe los procesos que necesitan optimización..."
              />
            </div>
          </div>
        </div>

        {/* Gestión de Recursos (GR) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Gestión de Recursos (GR)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectiva es la asignación y utilización de recursos?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="gr_c1"
                      value={value}
                      checked={formData.gr_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('gr_c1', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Qué tan bien se planifican y gestionan los recursos disponibles?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="gr_c2"
                      value={value}
                      checked={formData.gr_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('gr_c2', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. ¿Qué mejoras se necesitan en la gestión de recursos? (Opcional)
              </label>
              <textarea
                value={formData.gr_abierta}
                onChange={(e) => handleTextChange('gr_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Calidad y Control (CC) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Calidad y Control (CC)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivos son los sistemas de control de calidad?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="cc_c1"
                      value={value}
                      checked={formData.cc_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('cc_c1', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Qué tan bien se mantienen los estándares de calidad?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="cc_c2"
                      value={value}
                      checked={formData.cc_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('cc_c2', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. ¿Qué áreas de calidad necesitan más atención? (Opcional)
              </label>
              <textarea
                value={formData.cc_abierta}
                onChange={(e) => handleTextChange('cc_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las áreas que necesitan atención..."
              />
            </div>
          </div>
        </div>

        {/* Productividad (PR) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Productividad (PR)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan alta es la productividad general de la operación?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="pr_c1"
                      value={value}
                      checked={formData.pr_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('pr_c1', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Qué tan efectivos son los incentivos para mejorar la productividad?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="pr_c2"
                      value={value}
                      checked={formData.pr_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('pr_c2', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. ¿Qué estrategias podrían aumentar la productividad? (Opcional)
              </label>
              <textarea
                value={formData.pr_abierta}
                onChange={(e) => handleTextChange('pr_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las estrategias potenciales..."
              />
            </div>
          </div>
        </div>

        {/* Optimización de Costos (OC) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Optimización de Costos (OC)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectiva es la gestión de costos operativos?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="oc_c1"
                      value={value}
                      checked={formData.oc_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('oc_c1', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Qué tan bien se identifican y reducen costos innecesarios?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="oc_c2"
                      value={value}
                      checked={formData.oc_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('oc_c2', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. ¿Qué áreas de costos podrían optimizarse mejor? (Opcional)
              </label>
              <textarea
                value={formData.oc_abierta}
                onChange={(e) => handleTextChange('oc_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las áreas de costos..."
              />
            </div>
          </div>
        </div>

        {/* Gestión de Inventarios (GI) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Gestión de Inventarios (GI)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan eficiente es la gestión de inventarios?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="gi_c1"
                      value={value}
                      checked={formData.gi_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('gi_c1', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Qué tan bien se controlan los niveles de stock?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="gi_c2"
                      value={value}
                      checked={formData.gi_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('gi_c2', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. ¿Qué mejoras se necesitan en la gestión de inventarios? (Opcional)
              </label>
              <textarea
                value={formData.gi_abierta}
                onChange={(e) => handleTextChange('gi_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Logística y Distribución (LD) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Logística y Distribución (LD)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan eficiente es la cadena de suministro y distribución?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ld_c1"
                      value={value}
                      checked={formData.ld_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('ld_c1', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Qué tan bien se gestionan los tiempos de entrega?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ld_c2"
                      value={value}
                      checked={formData.ld_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('ld_c2', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. ¿Qué mejoras se necesitan en logística y distribución? (Opcional)
              </label>
              <textarea
                value={formData.ld_abierta}
                onChange={(e) => handleTextChange('ld_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Medición y KPIs (MK) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Medición y KPIs (MK)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivos son los indicadores de rendimiento operativo?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="mk_c1"
                      value={value}
                      checked={formData.mk_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('mk_c1', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Qué tan bien se monitorean y analizan los KPIs operativos?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="mk_c2"
                      value={value}
                      checked={formData.mk_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('mk_c2', e.target.value)}
                      className="mr-2"
                      required
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. ¿Qué métricas adicionales podrían mejorar el seguimiento operativo? (Opcional)
              </label>
              <textarea
                value={formData.mk_abierta}
                onChange={(e) => handleTextChange('mk_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las métricas adicionales..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Evaluación'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioEficienciaOperativa; 