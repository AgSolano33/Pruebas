import { useState } from "react";

const FormularioRecursosHumanos = ({ onAnalysisComplete, userId, metricKey }) => {
  const [formData, setFormData] = useState({
    // Reclutamiento y Selección (RS)
    rs_c1: "",
    rs_c2: "",
    rs_abierta: "",
    
    // Desarrollo y Capacitación (DC)
    dc_c1: "",
    dc_c2: "",
    dc_abierta: "",
    
    // Gestión del Desempeño (GD)
    gd_c1: "",
    gd_c2: "",
    gd_abierta: "",
    
    // Compensación y Beneficios (CB)
    cb_c1: "",
    cb_c2: "",
    cb_abierta: "",
    
    // Cultura Organizacional (CO)
    co_c1: "",
    co_c2: "",
    co_abierta: "",
    
    // Retención y Engagement (RE)
    re_c1: "",
    re_c2: "",
    re_abierta: "",
    
    // Liderazgo y Gestión (LG)
    lg_c1: "",
    lg_c2: "",
    lg_abierta: "",
    
    // Bienestar y Seguridad (BS)
    bs_c1: "",
    bs_c2: "",
    bs_abierta: ""
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
      const closedQuestions = ['rs_c1', 'rs_c2', 'dc_c1', 'dc_c2', 'gd_c1', 'gd_c2', 'cb_c1', 'cb_c2', 'co_c1', 'co_c2', 're_c1', 're_c2', 'lg_c1', 'lg_c2', 'bs_c1', 'bs_c2'];
      const answeredQuestions = closedQuestions.filter(q => formData[q] !== "");
      const totalScore = answeredQuestions.reduce((sum, q) => sum + parseInt(formData[q]), 0);
      const averageScore = answeredQuestions.length > 0 ? totalScore / answeredQuestions.length : 0;
      const valorPorcentual = Math.round((averageScore / 5) * 100);

      // Preparar datos para el análisis
      const datosMetrica = {
        formData,
        valorPorcentual,
        metricKey: 'recursosHumanos',
        metricTitle: 'Recursos Humanos'
      };

      const response = await fetch(`/api/metric-analysis/${metricKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          metricKey,
          metricTitle: 'Recursos Humanos',
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
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Evaluación de Recursos Humanos</h3>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Reclutamiento y Selección (RS) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Reclutamiento y Selección (RS)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivo es el proceso de reclutamiento y selección?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="rs_c1"
                      value={value}
                      checked={formData.rs_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('rs_c1', e.target.value)}
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
                2. ¿Qué tan bien se identifican y atraen los talentos adecuados?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="rs_c2"
                      value={value}
                      checked={formData.rs_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('rs_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en el proceso de reclutamiento? (Opcional)
              </label>
              <textarea
                value={formData.rs_abierta}
                onChange={(e) => handleTextChange('rs_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Desarrollo y Capacitación (DC) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Desarrollo y Capacitación (DC)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivos son los programas de desarrollo y capacitación?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="dc_c1"
                      value={value}
                      checked={formData.dc_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('dc_c1', e.target.value)}
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
                2. ¿Qué tan bien se identifican las necesidades de desarrollo del personal?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="dc_c2"
                      value={value}
                      checked={formData.dc_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('dc_c2', e.target.value)}
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
                3. ¿Qué áreas de desarrollo necesitan más atención? (Opcional)
              </label>
              <textarea
                value={formData.dc_abierta}
                onChange={(e) => handleTextChange('dc_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las áreas que necesitan atención..."
              />
            </div>
          </div>
        </div>

        {/* Gestión del Desempeño (GD) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Gestión del Desempeño (GD)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivo es el sistema de evaluación del desempeño?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="gd_c1"
                      value={value}
                      checked={formData.gd_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('gd_c1', e.target.value)}
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
                2. ¿Qué tan bien se proporciona retroalimentación constructiva?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="gd_c2"
                      value={value}
                      checked={formData.gd_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('gd_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en la gestión del desempeño? (Opcional)
              </label>
              <textarea
                value={formData.gd_abierta}
                onChange={(e) => handleTextChange('gd_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Compensación y Beneficios (CB) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Compensación y Beneficios (CB)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan competitiva es la estructura de compensación?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="cb_c1"
                      value={value}
                      checked={formData.cb_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('cb_c1', e.target.value)}
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
                2. ¿Qué tan atractivos son los beneficios y prestaciones?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="cb_c2"
                      value={value}
                      checked={formData.cb_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('cb_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en compensación y beneficios? (Opcional)
              </label>
              <textarea
                value={formData.cb_abierta}
                onChange={(e) => handleTextChange('cb_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Cultura Organizacional (CO) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Cultura Organizacional (CO)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan fuerte y positiva es la cultura organizacional?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
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
                2. ¿Qué tan bien se fomenta la colaboración y el trabajo en equipo?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
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
                3. ¿Qué aspectos de la cultura organizacional necesitan mejora? (Opcional)
              </label>
              <textarea
                value={formData.co_abierta}
                onChange={(e) => handleTextChange('co_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe los aspectos que necesitan mejora..."
              />
            </div>
          </div>
        </div>

        {/* Retención y Engagement (RE) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Retención y Engagement (RE)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivas son las estrategias de retención de talento?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="re_c1"
                      value={value}
                      checked={formData.re_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('re_c1', e.target.value)}
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
                2. ¿Qué tan alto es el nivel de engagement de los empleados?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="re_c2"
                      value={value}
                      checked={formData.re_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('re_c2', e.target.value)}
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
                3. ¿Qué acciones podrían mejorar la retención y engagement? (Opcional)
              </label>
              <textarea
                value={formData.re_abierta}
                onChange={(e) => handleTextChange('re_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las acciones potenciales..."
              />
            </div>
          </div>
        </div>

        {/* Liderazgo y Gestión (LG) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Liderazgo y Gestión (LG)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivo es el liderazgo en todos los niveles?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="lg_c1"
                      value={value}
                      checked={formData.lg_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('lg_c1', e.target.value)}
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
                2. ¿Qué tan bien se desarrollan las habilidades de gestión?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="lg_c2"
                      value={value}
                      checked={formData.lg_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('lg_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en liderazgo y gestión? (Opcional)
              </label>
              <textarea
                value={formData.lg_abierta}
                onChange={(e) => handleTextChange('lg_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Bienestar y Seguridad (BS) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Bienestar y Seguridad (BS)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivos son los programas de bienestar laboral?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="bs_c1"
                      value={value}
                      checked={formData.bs_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('bs_c1', e.target.value)}
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
                2. ¿Qué tan bien se gestiona la seguridad y salud ocupacional?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="bs_c2"
                      value={value}
                      checked={formData.bs_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('bs_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en bienestar y seguridad? (Opcional)
              </label>
              <textarea
                value={formData.bs_abierta}
                onChange={(e) => handleTextChange('bs_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
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

export default FormularioRecursosHumanos; 