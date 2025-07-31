import { useState } from "react";

const FormularioSaludFinanciera = ({ onAnalysisComplete, userId, metricKey }) => {
  const [formData, setFormData] = useState({
    // Planificación y Presupuesto (PP)
    pp_c1: "",
    pp_c2: "",
    pp_abierta: "",
    
    // Flujo de Efectivo (FE)
    fe_c1: "",
    fe_c2: "",
    fe_abierta: "",
    
    // Costos y Rentabilidad (CR)
    cr_c1: "",
    cr_c2: "",
    cr_abierta: "",
    
    // Financiamiento y Capital (FC)
    fc_c1: "",
    fc_c2: "",
    fc_abierta: "",
    
    // Indicadores y Reportes (IR)
    ir_c1: "",
    ir_c2: "",
    ir_abierta: "",
    
    // Riesgos y Cumplimiento (RC)
    rc_c1: "",
    rc_c2: "",
    rc_abierta: ""
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
      const closedQuestions = ['pp_c1', 'pp_c2', 'fe_c1', 'fe_c2', 'cr_c1', 'cr_c2', 'fc_c1', 'fc_c2', 'ir_c1', 'ir_c2', 'rc_c1', 'rc_c2'];
      const answeredQuestions = closedQuestions.filter(q => formData[q] !== "");
      const totalScore = answeredQuestions.reduce((sum, q) => sum + parseInt(formData[q]), 0);
      const averageScore = answeredQuestions.length > 0 ? totalScore / answeredQuestions.length : 0;
      const valorPorcentual = Math.round((averageScore / 5) * 100);

      // Preparar datos para el análisis
      const datosMetrica = {
        formData,
        valorPorcentual,
        metricKey: 'saludFinanciera',
        metricTitle: 'Salud Financiera'
      };

      const response = await fetch(`/api/metric-analysis/${metricKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          metricKey,
          metricTitle: 'Salud Financiera',
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
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Evaluación de Salud Financiera</h3>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Planificación y Presupuesto (PP) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Planificación y Presupuesto (PP)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectiva es la planificación financiera anual de la empresa?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="pp_c1"
                      value={value}
                      checked={formData.pp_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('pp_c1', e.target.value)}
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
                2. ¿Qué tan bien se cumple el presupuesto establecido?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="pp_c2"
                      value={value}
                      checked={formData.pp_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('pp_c2', e.target.value)}
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
                3. ¿Cuáles son los principales desafíos en la planificación financiera? (Opcional)
              </label>
              <textarea
                value={formData.pp_abierta}
                onChange={(e) => handleTextChange('pp_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe los desafíos principales..."
              />
            </div>
          </div>
        </div>

        {/* Flujo de Efectivo (FE) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Flujo de Efectivo (FE)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan saludable es el flujo de efectivo de la empresa?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="fe_c1"
                      value={value}
                      checked={formData.fe_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('fe_c1', e.target.value)}
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
                2. ¿Qué tan efectiva es la gestión de cobranzas y pagos?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="fe_c2"
                      value={value}
                      checked={formData.fe_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('fe_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en la gestión del flujo de efectivo? (Opcional)
              </label>
              <textarea
                value={formData.fe_abierta}
                onChange={(e) => handleTextChange('fe_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Costos y Rentabilidad (CR) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Costos y Rentabilidad (CR)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan bien se controlan los costos operativos?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="cr_c1"
                      value={value}
                      checked={formData.cr_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('cr_c1', e.target.value)}
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
                2. ¿Qué tan rentable es la operación actual de la empresa?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="cr_c2"
                      value={value}
                      checked={formData.cr_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('cr_c2', e.target.value)}
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
                3. ¿Qué estrategias podrían mejorar la rentabilidad? (Opcional)
              </label>
              <textarea
                value={formData.cr_abierta}
                onChange={(e) => handleTextChange('cr_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las estrategias potenciales..."
              />
            </div>
          </div>
        </div>

        {/* Financiamiento y Capital (FC) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Financiamiento y Capital (FC)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan adecuada es la estructura de capital de la empresa?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="fc_c1"
                      value={value}
                      checked={formData.fc_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('fc_c1', e.target.value)}
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
                2. ¿Qué tan accesible es el financiamiento para la empresa?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="fc_c2"
                      value={value}
                      checked={formData.fc_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('fc_c2', e.target.value)}
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
                3. ¿Qué opciones de financiamiento podrían ser más beneficiosas? (Opcional)
              </label>
              <textarea
                value={formData.fc_abierta}
                onChange={(e) => handleTextChange('fc_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las opciones de financiamiento..."
              />
            </div>
          </div>
        </div>

        {/* Indicadores y Reportes (IR) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Indicadores y Reportes (IR)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan efectivos son los indicadores financieros utilizados?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ir_c1"
                      value={value}
                      checked={formData.ir_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('ir_c1', e.target.value)}
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
                2. ¿Qué tan oportuna y clara es la información financiera reportada?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="ir_c2"
                      value={value}
                      checked={formData.ir_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('ir_c2', e.target.value)}
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
                3. ¿Qué mejoras se necesitan en los reportes financieros? (Opcional)
              </label>
              <textarea
                value={formData.ir_abierta}
                onChange={(e) => handleTextChange('ir_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las mejoras necesarias..."
              />
            </div>
          </div>
        </div>

        {/* Riesgos y Cumplimiento (RC) */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Riesgos y Cumplimiento (RC)</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Qué tan bien se identifican y gestionan los riesgos financieros?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
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
                2. ¿Qué tan efectivo es el cumplimiento de regulaciones financieras?
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
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
                3. ¿Qué áreas de riesgo financiero necesitan más atención? (Opcional)
              </label>
              <textarea
                value={formData.rc_abierta}
                onChange={(e) => handleTextChange('rc_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las áreas de riesgo..."
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

export default FormularioSaludFinanciera; 