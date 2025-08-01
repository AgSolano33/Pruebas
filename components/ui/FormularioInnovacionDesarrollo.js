import { useState } from "react";

const FormularioInnovacionDesarrollo = ({ onAnalysisComplete, userId, metricKey }) => {
  const [formData, setFormData] = useState({
    // Investigación y Desarrollo (ID)
    id_c1: "",
    id_c2: "",
    id_abierta: "",
    
    // Innovación de Productos (IP)
    ip_c1: "",
    ip_c2: "",
    ip_abierta: "",
    
    // Tecnología y Digitalización (TD)
    td_c1: "",
    td_c2: "",
    td_abierta: "",
    
    // Colaboración y Alianzas (CA)
    ca_c1: "",
    ca_c2: "",
    ca_abierta: "",
    
    // Gestión del Conocimiento (GC)
    gc_c1: "",
    gc_c2: "",
    gc_abierta: "",
    
    // Cultura de Innovación (CI)
    ci_c1: "",
    ci_c2: "",
    ci_abierta: "",
    
    // Propiedad Intelectual (PI)
    pi_c1: "",
    pi_c2: "",
    pi_abierta: "",
    
    // Medición y Métricas (MM)
    mm_c1: "",
    mm_c2: "",
    mm_abierta: ""
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
      const closedQuestions = ['id_c1', 'id_c2', 'ip_c1', 'ip_c2', 'td_c1', 'td_c2', 'ca_c1', 'ca_c2', 'gc_c1', 'gc_c2', 'ci_c1', 'ci_c2', 'pi_c1', 'pi_c2', 'mm_c1', 'mm_c2'];
      const answeredQuestions = closedQuestions.filter(q => formData[q] !== "");
      const totalScore = answeredQuestions.reduce((sum, q) => sum + parseInt(formData[q]), 0);
      const averageScore = answeredQuestions.length > 0 ? totalScore / answeredQuestions.length : 0;
      const valorPorcentual = Math.round((averageScore / 5) * 100);

      // Preparar datos para el análisis
      const datosMetrica = {
        formData,
        valorPorcentual,
        metricKey: 'innovacionDesarrollo',
        metricTitle: 'Innovación y Desarrollo'
      };

      const response = await fetch(`/api/metric-analysis/${metricKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          metricKey,
          metricTitle: 'Innovación y Desarrollo',
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
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Evaluación de Innovación y Desarrollo</h3>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Investigación y Desarrollo (ID) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Investigación y Desarrollo (ID)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectiva es la inversión en investigación y desarrollo de la empresa?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="id_c1"
                      value={value}
                      checked={formData.id_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('id_c1', e.target.value)}
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
                2. ¿Qué tan bien estructurado está el proceso de investigación y desarrollo?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="id_c2"
                      value={value}
                      checked={formData.id_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('id_c2', e.target.value)}
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
                3. ¿Cuáles son los principales desafíos en investigación y desarrollo? (Opcional)
              </label>
              <textarea
                value={formData.id_abierta}
                onChange={(e) => handleTextChange('id_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe los desafíos principales..."
              />
            </div>
          </div>
        </div>

        {/* Innovación de Productos (IP) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Innovación de Productos (IP)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan innovadores son los productos/servicios de la empresa?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ip_c1"
                      value={value}
                      checked={formData.ip_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('ip_c1', e.target.value)}
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
                2. ¿Qué tan rápido es el ciclo de desarrollo de nuevos productos?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ip_c2"
                      value={value}
                      checked={formData.ip_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('ip_c2', e.target.value)}
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
                3. ¿Qué áreas de innovación de productos necesitan más atención? (Opcional)
              </label>
              <textarea
                value={formData.ip_abierta}
                onChange={(e) => handleTextChange('ip_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las áreas que necesitan atención..."
              />
            </div>
          </div>
        </div>

        {/* Tecnología y Digitalización (TD) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Tecnología y Digitalización (TD)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan avanzada está la digitalización de la empresa?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="td_c1"
                      value={value}
                      checked={formData.td_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('td_c1', e.target.value)}
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
                2. ¿Qué tan efectiva es la adopción de nuevas tecnologías?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="td_c2"
                      value={value}
                      checked={formData.td_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('td_c2', e.target.value)}
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
                3. ¿Qué tecnologías emergentes podrían beneficiar más a la empresa? (Opcional)
              </label>
              <textarea
                value={formData.td_abierta}
                onChange={(e) => handleTextChange('td_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las tecnologías emergentes..."
              />
            </div>
          </div>
        </div>

        {/* Colaboración y Alianzas (CA) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Colaboración y Alianzas (CA)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivas son las alianzas estratégicas para la innovación?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ca_c1"
                      value={value}
                      checked={formData.ca_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('ca_c1', e.target.value)}
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
                2. ¿Qué tan bien funciona la colaboración con universidades y centros de investigación?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ca_c2"
                      value={value}
                      checked={formData.ca_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('ca_c2', e.target.value)}
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
                3. ¿Qué tipo de colaboraciones podrían fortalecer la innovación? (Opcional)
              </label>
              <textarea
                value={formData.ca_abierta}
                onChange={(e) => handleTextChange('ca_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las colaboraciones potenciales..."
              />
            </div>
          </div>
        </div>

        {/* Gestión del Conocimiento (GC) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Gestión del Conocimiento (GC)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectiva es la captura y documentación del conocimiento?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="gc_c1"
                      value={value}
                      checked={formData.gc_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('gc_c1', e.target.value)}
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
                2. ¿Qué tan bien se comparte el conocimiento entre equipos?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="gc_c2"
                      value={value}
                      checked={formData.gc_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('gc_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en la gestión del conocimiento? (Opcional)
              </label>
              <textarea
                value={formData.gc_abierta}
                onChange={(e) => handleTextChange('gc_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Cultura de Innovación (CI) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Cultura de Innovación (CI)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan fuerte es la cultura de innovación en la empresa?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ci_c1"
                      value={value}
                      checked={formData.ci_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('ci_c1', e.target.value)}
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
                2. ¿Qué tan bien se fomenta la creatividad y el pensamiento innovador?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ci_c2"
                      value={value}
                      checked={formData.ci_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('ci_c2', e.target.value)}
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
                3. ¿Qué acciones podrían fortalecer la cultura de innovación? (Opcional)
              </label>
              <textarea
                value={formData.ci_abierta}
                onChange={(e) => handleTextChange('ci_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las acciones para fortalecer la cultura..."
              />
            </div>
          </div>
        </div>

        {/* Propiedad Intelectual (PI) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Propiedad Intelectual (PI)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan bien se protege la propiedad intelectual de la empresa?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="pi_c1"
                      value={value}
                      checked={formData.pi_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('pi_c1', e.target.value)}
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
                2. ¿Qué tan efectiva es la estrategia de patentes y marcas?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="pi_c2"
                      value={value}
                      checked={formData.pi_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('pi_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en la gestión de propiedad intelectual? (Opcional)
              </label>
              <textarea
                value={formData.pi_abierta}
                onChange={(e) => handleTextChange('pi_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Medición y Métricas (MM) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Medición y Métricas (MM)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan bien se miden los resultados de innovación?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="mm_c1"
                      value={value}
                      checked={formData.mm_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('mm_c1', e.target.value)}
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
                2. ¿Qué tan efectivos son los indicadores de innovación utilizados?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="mm_c2"
                      value={value}
                      checked={formData.mm_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('mm_c2', e.target.value)}
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
                3. ¿Qué métricas adicionales podrían mejorar el seguimiento de la innovación? (Opcional)
              </label>
              <textarea
                value={formData.mm_abierta}
                onChange={(e) => handleTextChange('mm_abierta', e.target.value)}
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

export default FormularioInnovacionDesarrollo; 