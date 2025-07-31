import { useState } from "react";

const FormularioMadurezDigital = ({ onAnalysisComplete, userId, metricKey }) => {
  const [formData, setFormData] = useState({
    // Estrategia Digital (ED)
    ed_c1: "",
    ed_c2: "",
    ed_abierta: "",
    
    // Tecnología e Infraestructura (TI)
    ti_c1: "",
    ti_c2: "",
    ti_abierta: "",
    
    // Procesos Digitales (PD)
    pd_c1: "",
    pd_c2: "",
    pd_abierta: "",
    
    // Datos y Analytics (DA)
    da_c1: "",
    da_c2: "",
    da_abierta: "",
    
    // Experiencia del Usuario (EU)
    eu_c1: "",
    eu_c2: "",
    eu_abierta: "",
    
    // Seguridad y Privacidad (SP)
    sp_c1: "",
    sp_c2: "",
    sp_abierta: "",
    
    // Talento Digital (TD)
    td_c1: "",
    td_c2: "",
    td_abierta: "",
    
    // Gobernanza Digital (GD)
    gd_c1: "",
    gd_c2: "",
    gd_abierta: ""
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
      const closedQuestions = ['ed_c1', 'ed_c2', 'ti_c1', 'ti_c2', 'pd_c1', 'pd_c2', 'da_c1', 'da_c2', 'eu_c1', 'eu_c2', 'sp_c1', 'sp_c2', 'td_c1', 'td_c2', 'gd_c1', 'gd_c2'];
      const answeredQuestions = closedQuestions.filter(q => formData[q] !== "");
      const totalScore = answeredQuestions.reduce((sum, q) => sum + parseInt(formData[q]), 0);
      const averageScore = answeredQuestions.length > 0 ? totalScore / answeredQuestions.length : 0;
      const valorPorcentual = Math.round((averageScore / 5) * 100);

      // Preparar datos para el análisis
      const datosMetrica = {
        formData,
        valorPorcentual,
        metricKey: 'madurezDigital',
        metricTitle: 'Madurez Digital'
      };

      const response = await fetch(`/api/metric-analysis/${metricKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          metricKey,
          metricTitle: 'Madurez Digital',
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
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Evaluación de Madurez Digital</h3>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Estrategia Digital (ED) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Estrategia Digital (ED)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan clara y definida está la estrategia digital de la empresa?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ed_c1"
                      value={value}
                      checked={formData.ed_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('ed_c1', e.target.value)}
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
                2. ¿Qué tan bien alineada está la transformación digital con los objetivos del negocio?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ed_c2"
                      value={value}
                      checked={formData.ed_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('ed_c2', e.target.value)}
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
                3. ¿Qué aspectos de la estrategia digital necesitan más desarrollo? (Opcional)
              </label>
              <textarea
                value={formData.ed_abierta}
                onChange={(e) => handleTextChange('ed_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe los aspectos que necesitan desarrollo..."
              />
            </div>
          </div>
        </div>

        {/* Tecnología e Infraestructura (TI) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Tecnología e Infraestructura (TI)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan moderna y robusta es la infraestructura tecnológica?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ti_c1"
                      value={value}
                      checked={formData.ti_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('ti_c1', e.target.value)}
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
                2. ¿Qué tan efectiva es la adopción de tecnologías emergentes?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ti_c2"
                      value={value}
                      checked={formData.ti_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('ti_c2', e.target.value)}
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
                3. ¿Qué tecnologías podrían mejorar la infraestructura actual? (Opcional)
              </label>
              <textarea
                value={formData.ti_abierta}
                onChange={(e) => handleTextChange('ti_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las tecnologías potenciales..."
              />
            </div>
          </div>
        </div>

        {/* Procesos Digitales (PD) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Procesos Digitales (PD)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan digitalizados están los procesos principales de la empresa?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="pd_c1"
                      value={value}
                      checked={formData.pd_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('pd_c1', e.target.value)}
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
                2. ¿Qué tan eficientes son los flujos de trabajo digitales?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="pd_c2"
                      value={value}
                      checked={formData.pd_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('pd_c2', e.target.value)}
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
                3. ¿Qué procesos podrían beneficiarse más de la digitalización? (Opcional)
              </label>
              <textarea
                value={formData.pd_abierta}
                onChange={(e) => handleTextChange('pd_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe los procesos que necesitan digitalización..."
              />
            </div>
          </div>
        </div>

        {/* Datos y Analytics (DA) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Datos y Analytics (DA)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectiva es la gestión y análisis de datos?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="da_c1"
                      value={value}
                      checked={formData.da_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('da_c1', e.target.value)}
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
                2. ¿Qué tan bien se utilizan los insights de datos para la toma de decisiones?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="da_c2"
                      value={value}
                      checked={formData.da_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('da_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en la gestión de datos? (Opcional)
              </label>
              <textarea
                value={formData.da_abierta}
                onChange={(e) => handleTextChange('da_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Experiencia del Usuario (EU) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Experiencia del Usuario (EU)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan satisfactoria es la experiencia digital para los usuarios?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="eu_c1"
                      value={value}
                      checked={formData.eu_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('eu_c1', e.target.value)}
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
                2. ¿Qué tan accesibles y fáciles de usar son las plataformas digitales?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="eu_c2"
                      value={value}
                      checked={formData.eu_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('eu_c2', e.target.value)}
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
                3. ¿Qué aspectos de la experiencia del usuario necesitan mejora? (Opcional)
              </label>
              <textarea
                value={formData.eu_abierta}
                onChange={(e) => handleTextChange('eu_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe los aspectos que necesitan mejora..."
              />
            </div>
          </div>
        </div>

        {/* Seguridad y Privacidad (SP) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Seguridad y Privacidad (SP)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan robustas son las medidas de seguridad digital?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="sp_c1"
                      value={value}
                      checked={formData.sp_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('sp_c1', e.target.value)}
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
                2. ¿Qué tan efectiva es la protección de datos y privacidad?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="sp_c2"
                      value={value}
                      checked={formData.sp_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('sp_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en seguridad y privacidad? (Opcional)
              </label>
              <textarea
                value={formData.sp_abierta}
                onChange={(e) => handleTextChange('sp_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Talento Digital (TD) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Talento Digital (TD)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan preparado está el equipo para la transformación digital?
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
                2. ¿Qué tan efectivo es el programa de capacitación digital?
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
                3. ¿Qué habilidades digitales necesitan más desarrollo en el equipo? (Opcional)
              </label>
              <textarea
                value={formData.td_abierta}
                onChange={(e) => handleTextChange('td_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las habilidades que necesitan desarrollo..."
              />
            </div>
          </div>
        </div>

        {/* Gobernanza Digital (GD) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Gobernanza Digital (GD)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectiva es la gobernanza de las iniciativas digitales?
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
                2. ¿Qué tan bien se gestionan los riesgos digitales?
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
                3. ¿Qué mejoras se necesitan en la gobernanza digital? (Opcional)
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

export default FormularioMadurezDigital; 