import { useState } from "react";

const FormularioMarketingVentas = ({ onAnalysisComplete, userId, metricKey }) => {
  const [formData, setFormData] = useState({
    // Estrategia de Marketing (EM)
    em_c1: "",
    em_c2: "",
    em_abierta: "",
    
    // Canales de Distribución (CD)
    cd_c1: "",
    cd_c2: "",
    cd_abierta: "",
    
    // Gestión de Ventas (GV)
    gv_c1: "",
    gv_c2: "",
    gv_abierta: "",
    
    // Análisis de Mercado (AM)
    am_c1: "",
    am_c2: "",
    am_abierta: "",
    
    // Branding y Posicionamiento (BP)
    bp_c1: "",
    bp_c2: "",
    bp_abierta: "",
    
    // Digital Marketing (DM)
    dm_c1: "",
    dm_c2: "",
    dm_abierta: "",
    
    // Relaciones con Clientes (RC)
    rc_c1: "",
    rc_c2: "",
    rc_abierta: "",
    
    // Medición y ROI (MR)
    mr_c1: "",
    mr_c2: "",
    mr_abierta: ""
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
      // Calcular el valor porcentual basado en las respuestas (escala 0-5)
      const closedQuestions = ['em_c1', 'em_c2', 'cd_c1', 'cd_c2', 'gv_c1', 'gv_c2', 'am_c1', 'am_c2', 'bp_c1', 'bp_c2', 'dm_c1', 'dm_c2', 'rc_c1', 'rc_c2', 'mr_c1', 'mr_c2'];
      const answeredQuestions = closedQuestions.filter(q => formData[q] !== "");
      const totalScore = answeredQuestions.reduce((sum, q) => sum + parseInt(formData[q]), 0);
      const averageScore = answeredQuestions.length > 0 ? totalScore / answeredQuestions.length : 0;
      const valorPorcentual = Math.round((averageScore / 5) * 100);

      // Preparar datos para el análisis
      const datosMetrica = {
        formData,
        valorPorcentual,
        metricKey: 'marketingVentas',
        metricTitle: 'Marketing y Ventas'
      };

      const response = await fetch(`/api/metric-analysis/${metricKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          metricKey,
          metricTitle: 'Marketing y Ventas',
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
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Evaluación de Marketing y Ventas</h3>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Estrategia de Marketing (EM) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Estrategia de Marketing (EM)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectiva es la estrategia de marketing general?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="em_c1"
                      value={value}
                      checked={formData.em_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('em_c1', e.target.value)}
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
                2. ¿Qué tan bien se alinea el marketing con los objetivos del negocio?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="em_c2"
                      value={value}
                      checked={formData.em_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('em_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en la estrategia de marketing? (Opcional)
              </label>
              <textarea
                value={formData.em_abierta}
                onChange={(e) => handleTextChange('em_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Canales de Distribución (CD) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Canales de Distribución (CD)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivos son los canales de distribución utilizados?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="cd_c1"
                      value={value}
                      checked={formData.cd_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('cd_c1', e.target.value)}
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
                2. ¿Qué tan bien se gestionan las relaciones con los distribuidores?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="cd_c2"
                      value={value}
                      checked={formData.cd_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('cd_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en los canales de distribución? (Opcional)
              </label>
              <textarea
                value={formData.cd_abierta}
                onChange={(e) => handleTextChange('cd_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Gestión de Ventas (GV) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Gestión de Ventas (GV)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivo es el equipo de ventas?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="gv_c1"
                      value={value}
                      checked={formData.gv_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('gv_c1', e.target.value)}
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
                2. ¿Qué tan bien se gestiona el pipeline de ventas?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="gv_c2"
                      value={value}
                      checked={formData.gv_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('gv_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en la gestión de ventas? (Opcional)
              </label>
              <textarea
                value={formData.gv_abierta}
                onChange={(e) => handleTextChange('gv_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Análisis de Mercado (AM) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Análisis de Mercado (AM)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivo es el análisis de mercado y competencia?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="am_c1"
                      value={value}
                      checked={formData.am_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('am_c1', e.target.value)}
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
                2. ¿Qué tan bien se identifican las oportunidades de mercado?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="am_c2"
                      value={value}
                      checked={formData.am_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('am_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en el análisis de mercado? (Opcional)
              </label>
              <textarea
                value={formData.am_abierta}
                onChange={(e) => handleTextChange('am_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Branding y Posicionamiento (BP) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Branding y Posicionamiento (BP)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan fuerte es la marca y su posicionamiento?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="bp_c1"
                      value={value}
                      checked={formData.bp_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('bp_c1', e.target.value)}
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
                2. ¿Qué tan efectiva es la comunicación de la marca?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="bp_c2"
                      value={value}
                      checked={formData.bp_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('bp_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en branding y posicionamiento? (Opcional)
              </label>
              <textarea
                value={formData.bp_abierta}
                onChange={(e) => handleTextChange('bp_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Digital Marketing (DM) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Digital Marketing (DM)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectiva es la estrategia de marketing digital?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="dm_c1"
                      value={value}
                      checked={formData.dm_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('dm_c1', e.target.value)}
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
                2. ¿Qué tan bien se utilizan las herramientas digitales de marketing?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="dm_c2"
                      value={value}
                      checked={formData.dm_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('dm_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en marketing digital? (Opcional)
              </label>
              <textarea
                value={formData.dm_abierta}
                onChange={(e) => handleTextChange('dm_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Relaciones con Clientes (RC) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Relaciones con Clientes (RC)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectiva es la gestión de relaciones con clientes?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="rc_c1"
                      value={value}
                      checked={formData.rc_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('rc_c1', e.target.value)}
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
                2. ¿Qué tan bien se fideliza a los clientes existentes?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="rc_c2"
                      value={value}
                      checked={formData.rc_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('rc_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en las relaciones con clientes? (Opcional)
              </label>
              <textarea
                value={formData.rc_abierta}
                onChange={(e) => handleTextChange('rc_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Medición y ROI (MR) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Medición y ROI (MR)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivos son los indicadores de marketing y ventas?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="mr_c1"
                      value={value}
                      checked={formData.mr_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('mr_c1', e.target.value)}
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
                2. ¿Qué tan bien se mide el ROI de las actividades de marketing?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="mr_c2"
                      value={value}
                      checked={formData.mr_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('mr_c2', e.target.value)}
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
                3. ¿Qué métricas adicionales podrían mejorar la medición? (Opcional)
              </label>
              <textarea
                value={formData.mr_abierta}
                onChange={(e) => handleTextChange('mr_abierta', e.target.value)}
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

export default FormularioMarketingVentas; 