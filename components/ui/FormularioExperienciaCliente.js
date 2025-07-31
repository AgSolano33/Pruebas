import { useState } from "react";

const FormularioExperienciaCliente = ({ onAnalysisComplete, userId, metricKey }) => {
  const [formData, setFormData] = useState({
    // Satisfacción del Cliente (SC)
    sc_c1: "",
    sc_c2: "",
    sc_abierta: "",
    
    // Atención al Cliente (AC)
    ac_c1: "",
    ac_c2: "",
    ac_abierta: "",
    
    // Resolución de Problemas (RP)
    rp_c1: "",
    rp_c2: "",
    rp_abierta: "",
    
    // Personalización (PE)
    pe_c1: "",
    pe_c2: "",
    pe_abierta: "",
    
    // Comunicación (CO)
    co_c1: "",
    co_c2: "",
    co_abierta: "",
    
    // Procesos de Servicio (PS)
    ps_c1: "",
    ps_c2: "",
    ps_abierta: "",
    
    // Tecnología de Servicio (TS)
    ts_c1: "",
    ts_c2: "",
    ts_abierta: "",
    
    // Medición de Experiencia (ME)
    me_c1: "",
    me_c2: "",
    me_abierta: ""
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
      const closedQuestions = ['sc_c1', 'sc_c2', 'ac_c1', 'ac_c2', 'rp_c1', 'rp_c2', 'pe_c1', 'pe_c2', 'co_c1', 'co_c2', 'ps_c1', 'ps_c2', 'ts_c1', 'ts_c2', 'me_c1', 'me_c2'];
      const answeredQuestions = closedQuestions.filter(q => formData[q] !== "");
      const totalScore = answeredQuestions.reduce((sum, q) => sum + parseInt(formData[q]), 0);
      const averageScore = answeredQuestions.length > 0 ? totalScore / answeredQuestions.length : 0;
      const valorPorcentual = Math.round((averageScore / 5) * 100);

      // Preparar datos para el análisis
      const datosMetrica = {
        formData,
        valorPorcentual,
        metricKey: 'experienciaCliente',
        metricTitle: 'Experiencia del Cliente'
      };

      const response = await fetch(`/api/metric-analysis/${metricKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          metricKey,
          metricTitle: 'Experiencia del Cliente',
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
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Evaluación de Experiencia del Cliente</h3>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Satisfacción del Cliente (SC) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Satisfacción del Cliente (SC)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan satisfechos están los clientes con los productos/servicios?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="sc_c1"
                      value={value}
                      checked={formData.sc_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('sc_c1', e.target.value)}
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
                2. ¿Qué tan probable es que los clientes recomienden la empresa?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="sc_c2"
                      value={value}
                      checked={formData.sc_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('sc_c2', e.target.value)}
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
                3. ¿Qué aspectos de la satisfacción del cliente necesitan mejora? (Opcional)
              </label>
              <textarea
                value={formData.sc_abierta}
                onChange={(e) => handleTextChange('sc_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe los aspectos que necesitan mejora..."
              />
            </div>
          </div>
        </div>

        {/* Atención al Cliente (AC) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Atención al Cliente (AC)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectiva es la atención al cliente?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ac_c1"
                      value={value}
                      checked={formData.ac_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('ac_c1', e.target.value)}
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
                2. ¿Qué tan accesibles y disponibles están los canales de atención?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ac_c2"
                      value={value}
                      checked={formData.ac_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('ac_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en la atención al cliente? (Opcional)
              </label>
              <textarea
                value={formData.ac_abierta}
                onChange={(e) => handleTextChange('ac_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Resolución de Problemas (RP) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Resolución de Problemas (RP)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectiva es la resolución de problemas y quejas?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="rp_c1"
                      value={value}
                      checked={formData.rp_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('rp_c1', e.target.value)}
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
                2. ¿Qué tan rápido se resuelven las incidencias de los clientes?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="rp_c2"
                      value={value}
                      checked={formData.rp_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('rp_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en la resolución de problemas? (Opcional)
              </label>
              <textarea
                value={formData.rp_abierta}
                onChange={(e) => handleTextChange('rp_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Personalización (PE) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Personalización (PE)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan personalizada es la experiencia que se ofrece a los clientes?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="pe_c1"
                      value={value}
                      checked={formData.pe_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('pe_c1', e.target.value)}
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
                2. ¿Qué tan bien se adaptan los servicios a las necesidades específicas?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="pe_c2"
                      value={value}
                      checked={formData.pe_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('pe_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en la personalización? (Opcional)
              </label>
              <textarea
                value={formData.pe_abierta}
                onChange={(e) => handleTextChange('pe_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Comunicación (CO) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Comunicación (CO)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectiva es la comunicación con los clientes?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="co_c1"
                      value={value}
                      checked={formData.co_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('co_c1', e.target.value)}
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
                2. ¿Qué tan clara y oportuna es la información que se proporciona?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="co_c2"
                      value={value}
                      checked={formData.co_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('co_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en la comunicación con clientes? (Opcional)
              </label>
              <textarea
                value={formData.co_abierta}
                onChange={(e) => handleTextChange('co_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Procesos de Servicio (PS) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Procesos de Servicio (PS)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan eficientes y fluidos son los procesos de servicio al cliente?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ps_c1"
                      value={value}
                      checked={formData.ps_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('ps_c1', e.target.value)}
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
                2. ¿Qué tan bien se optimizan los procesos para mejorar la experiencia?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ps_c2"
                      value={value}
                      checked={formData.ps_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('ps_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en los procesos de servicio? (Opcional)
              </label>
              <textarea
                value={formData.ps_abierta}
                onChange={(e) => handleTextChange('ps_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Tecnología de Servicio (TS) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Tecnología de Servicio (TS)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivas son las herramientas tecnológicas para el servicio al cliente?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ts_c1"
                      value={value}
                      checked={formData.ts_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('ts_c1', e.target.value)}
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
                2. ¿Qué tan bien se integran las tecnologías para mejorar la experiencia?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ts_c2"
                      value={value}
                      checked={formData.ts_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('ts_c2', e.target.value)}
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
                3. ¿Qué mejoras tecnológicas podrían mejorar la experiencia del cliente? (Opcional)
              </label>
              <textarea
                value={formData.ts_abierta}
                onChange={(e) => handleTextChange('ts_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras tecnológicas..."
              />
            </div>
          </div>
        </div>

        {/* Medición de Experiencia (ME) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Medición de Experiencia (ME)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivos son los indicadores de experiencia del cliente?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="me_c1"
                      value={value}
                      checked={formData.me_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('me_c1', e.target.value)}
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
                2. ¿Qué tan bien se monitorea y analiza la experiencia del cliente?
              </label>
              <div className="flex space-x-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="me_c2"
                      value={value}
                      checked={formData.me_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('me_c2', e.target.value)}
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
                3. ¿Qué métricas adicionales podrían mejorar la medición de experiencia? (Opcional)
              </label>
              <textarea
                value={formData.me_abierta}
                onChange={(e) => handleTextChange('me_abierta', e.target.value)}
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

export default FormularioExperienciaCliente; 