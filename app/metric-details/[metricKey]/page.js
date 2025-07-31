"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Componente del formulario de Gestión Financiera
const FormularioGestionFinanciera = ({ onAnalysisComplete, userId, metricKey, initialFormData = {}, hasExistingAnalysis = false }) => {
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

  // Cargar datos iniciales si existen
  useEffect(() => {
    if (hasExistingAnalysis && Object.keys(initialFormData).length > 0) {
      setFormData(initialFormData);
    }
  }, [hasExistingAnalysis, initialFormData]);

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
      console.error('Error:', error);
      alert('Error al procesar el formulario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-[#1A3D7C] mb-6">
        {hasExistingAnalysis ? 'Actualizar Evaluación Financiera' : 'Formulario de Evaluación Financiera'}
      </h2>
      
      {/* Leyenda de la escala */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Escala de evaluación:</h3>
        <div className="flex gap-6 text-xs text-gray-600">
          <div><span className="font-medium">1:</span> Totalmente en desacuerdo</div>
          <div><span className="font-medium">2:</span> En desacuerdo</div>
          <div><span className="font-medium">3:</span> Neutral</div>
          <div><span className="font-medium">4:</span> De acuerdo</div>
          <div><span className="font-medium">5:</span> Totalmente de acuerdo</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Planificación y Presupuesto (PP) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">PP</span>
            Planificación y Presupuesto
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contamos con un presupuesto anual formal que revisamos al menos cada trimestre.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pp_c1"
                      value={value}
                      checked={formData.pp_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('pp_c1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ese presupuesto está alineado con nuestros objetivos estratégicos.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pp_c2"
                      value={value}
                      checked={formData.pp_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('pp_c2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="pp_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuál es tu mayor obstáculo para planificar el presupuesto? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="pp_abierta"
                value={formData.pp_abierta}
                onChange={(e) => handleTextChange('pp_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* Flujo de Efectivo (FE) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">FE</span>
            Flujo de Efectivo
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proyectamos el flujo de efectivo mensualmente y lo comparamos con lo real.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="fe_c1"
                      value={value}
                      checked={formData.fe_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('fe_c1', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Menos del 15% de nuestras cuentas por cobrar superan 90 días de atraso.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="fe_c2"
                      value={value}
                      checked={formData.fe_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('fe_c2', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="fe_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                Describe tu mayor reto de liquidez. <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="fe_abierta"
                value={formData.fe_abierta}
                onChange={(e) => handleTextChange('fe_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* Costos y Rentabilidad (CR) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">CR</span>
            Costos y Rentabilidad
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculamos la rentabilidad por producto o servicio al menos una vez al año.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cr_c1"
                      value={value}
                      checked={formData.cr_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('cr_c1', e.target.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ejecutamos acciones continuas para controlar y reducir costos.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cr_c2"
                      value={value}
                      checked={formData.cr_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('cr_c2', e.target.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="cr_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué gasto inesperado te preocupa más? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="cr_abierta"
                value={formData.cr_abierta}
                onChange={(e) => handleTextChange('cr_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* Financiamiento y Capital (FC) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">FC</span>
            Financiamiento y Capital
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuestro nivel de endeudamiento está dentro de rangos saludables para la industria.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="fc_c1"
                      value={value}
                      checked={formData.fc_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('fc_c1', e.target.value)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Antes de endeudarnos analizamos varias opciones de financiamiento.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="fc_c2"
                      value={value}
                      checked={formData.fc_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('fc_c2', e.target.value)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="fc_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué plan de financiamiento tienes para los próximos 12 meses? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="fc_abierta"
                value={formData.fc_abierta}
                onChange={(e) => handleTextChange('fc_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* Indicadores y Reportes (IR) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">IR</span>
            Indicadores y Reportes
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cerramos la contabilidad mensual en ≤ 7 días y generamos estados financieros puntualmente.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ir_c1"
                      value={value}
                      checked={formData.ir_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('ir_c1', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monitoreamos KPIs clave (EBITDA, margen neto, ROE) cada mes.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ir_c2"
                      value={value}
                      checked={formData.ir_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('ir_c2', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="ir_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué indicador financiero te quita el sueño? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="ir_abierta"
                value={formData.ir_abierta}
                onChange={(e) => handleTextChange('ir_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* Riesgos y Cumplimiento (RC) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">RC</span>
            Riesgos y Cumplimiento
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponemos de un mapa de riesgos financieros actualizado y planes de acción.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rc_c1"
                      value={value}
                      checked={formData.rc_c1 === value.toString()}
                      onChange={(e) => handleScaleChange('rc_c1', e.target.value)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cumplimos puntualmente con obligaciones fiscales y realizamos auditorías internas.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rc_c2"
                      value={value}
                      checked={formData.rc_c2 === value.toString()}
                      onChange={(e) => handleScaleChange('rc_c2', e.target.value)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="rc_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué riesgo regulatorio genera más tensión hoy? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="rc_abierta"
                value={formData.rc_abierta}
                onChange={(e) => handleTextChange('rc_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors font-semibold text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Evaluación'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Componente del formulario de Madurez Digital
const FormularioMadurezDigital = ({ onAnalysisComplete, userId, metricKey, initialFormData = {}, hasExistingAnalysis = false }) => {
  const [formData, setFormData] = useState({
    // 1. Estrategia y Gobernanza Digital (ED)
    ed_1: "",
    ed_2: "",
    ed_abierta: "",
    
    // 2. Infraestructura y Plataformas (IP)
    ip_1: "",
    ip_2: "",
    ip_abierta: "",
    
    // 3. Automatización de Procesos (AP)
    ap_1: "",
    ap_2: "",
    ap_abierta: "",
    
    // 4. Datos, Analítica y Gobierno (DA)
    da_1: "",
    da_2: "",
    da_abierta: "",
    
    // 5. Cultura Digital y Competencias (CD)
    cd_1: "",
    cd_2: "",
    cd_abierta: "",
    
    // 6. Ciberseguridad y Continuidad (CC)
    cc_1: "",
    cc_2: "",
    cc_abierta: "",
    
    // 7. Experiencia Digital del Cliente (CX)
    cx_1: "",
    cx_2: "",
    cx_abierta: "",
    
    // 8. Innovación y Transformación (IN)
    in_1: "",
    in_2: "",
    in_abierta: ""
  });

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calcular el valor porcentual basado en las respuestas
      const closedQuestions = ['ed_1', 'ed_2', 'ip_1', 'ip_2', 'ap_1', 'ap_2', 'da_1', 'da_2', 'cd_1', 'cd_2', 'cc_1', 'cc_2', 'cx_1', 'cx_2', 'in_1', 'in_2'];
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
      console.error('Error:', error);
      alert('Error al procesar el formulario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-[#1A3D7C] mb-6">
        {hasExistingAnalysis ? 'Actualizar Evaluación de Madurez Digital' : 'Formulario de Evaluación de Madurez Digital'}
      </h2>
      
      {/* Leyenda de la escala */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Escala de evaluación:</h3>
        <div className="flex gap-6 text-xs text-gray-600">
          <div><span className="font-medium">1:</span> Totalmente en desacuerdo</div>
          <div><span className="font-medium">2:</span> En desacuerdo</div>
          <div><span className="font-medium">3:</span> Neutral</div>
          <div><span className="font-medium">4:</span> De acuerdo</div>
          <div><span className="font-medium">5:</span> Totalmente de acuerdo</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Estrategia y Gobernanza Digital (ED) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">ED</span>
            1. Estrategia y Gobernanza Digital
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponemos de una hoja de ruta digital alineada al negocio y revisada cada año.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ed_1"
                      value={value}
                      checked={formData.ed_1 === value.toString()}
                      onChange={(e) => handleScaleChange('ed_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Existe un responsable o comité que supervisa la ejecución de la estrategia digital.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ed_2"
                      value={value}
                      checked={formData.ed_2 === value.toString()}
                      onChange={(e) => handleScaleChange('ed_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="ed_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué desafío encuentras para mantener tu estrategia digital vigente? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="ed_abierta"
                value={formData.ed_abierta}
                onChange={(e) => handleTextChange('ed_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 2. Infraestructura y Plataformas (IP) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">IP</span>
            2. Infraestructura y Plataformas
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuestras aplicaciones críticas corren en entornos cloud o SaaS escalables.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ip_1"
                      value={value}
                      checked={formData.ip_1 === value.toString()}
                      onChange={(e) => handleScaleChange('ip_1', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                La infraestructura TI se monitorea y actualiza para evitar obsolescencia.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ip_2"
                      value={value}
                      checked={formData.ip_2 === value.toString()}
                      onChange={(e) => handleScaleChange('ip_2', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="ip_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué parte de tu infraestructura tecnológica causa más dolores de cabeza? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="ip_abierta"
                value={formData.ip_abierta}
                onChange={(e) => handleTextChange('ip_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 3. Automatización de Procesos (AP) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">AP</span>
            3. Automatización de Procesos
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tenemos flujos de trabajo automatizados que reducen tareas manuales clave.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ap_1"
                      value={value}
                      checked={formData.ap_1 === value.toString()}
                      onChange={(e) => handleScaleChange('ap_1', e.target.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Integramos ERP/CRM/HR para evitar retrabajo y duplicidad de datos.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ap_2"
                      value={value}
                      checked={formData.ap_2 === value.toString()}
                      onChange={(e) => handleScaleChange('ap_2', e.target.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="ap_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuál proceso manual te gustaría automatizar primero? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="ap_abierta"
                value={formData.ap_abierta}
                onChange={(e) => handleTextChange('ap_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 4. Datos, Analítica y Gobierno (DA) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">DA</span>
            4. Datos, Analítica y Gobierno
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponemos de un repositorio central para consolidar datos de negocio.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="da_1"
                      value={value}
                      checked={formData.da_1 === value.toString()}
                      onChange={(e) => handleScaleChange('da_1', e.target.value)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usamos dashboards o analítica avanzada para tomar decisiones estratégicas.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="da_2"
                      value={value}
                      checked={formData.da_2 === value.toString()}
                      onChange={(e) => handleScaleChange('da_2', e.target.value)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="da_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué decisión clave extrañarías si hoy perdieras tus dashboards? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="da_abierta"
                value={formData.da_abierta}
                onChange={(e) => handleTextChange('da_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 5. Cultura Digital y Competencias (CD) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">CD</span>
            5. Cultura Digital y Competencias
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Los empleados reciben capacitación continua en herramientas digitales y metodologías ágiles.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cd_1"
                      value={value}
                      checked={formData.cd_1 === value.toString()}
                      onChange={(e) => handleScaleChange('cd_1', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Se fomenta la experimentación con tecnologías emergentes mediante proyectos piloto.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cd_2"
                      value={value}
                      checked={formData.cd_2 === value.toString()}
                      onChange={(e) => handleScaleChange('cd_2', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="cd_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuál habilidad digital falta más en tu equipo? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="cd_abierta"
                value={formData.cd_abierta}
                onChange={(e) => handleTextChange('cd_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 6. Ciberseguridad y Continuidad (CC) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">CC</span>
            6. Ciberseguridad y Continuidad
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponemos de políticas formales de ciberseguridad y pruebas de vulnerabilidad periódicas.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cc_1"
                      value={value}
                      checked={formData.cc_1 === value.toString()}
                      onChange={(e) => handleScaleChange('cc_1', e.target.value)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tenemos planes de respaldo y continuidad operativa probados en el último año.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cc_2"
                      value={value}
                      checked={formData.cc_2 === value.toString()}
                      onChange={(e) => handleScaleChange('cc_2', e.target.value)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="cc_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué incidente de seguridad sería catastrófico para tu operación? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="cc_abierta"
                value={formData.cc_abierta}
                onChange={(e) => handleTextChange('cc_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 7. Experiencia Digital del Cliente (CX) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">CX</span>
            7. Experiencia Digital del Cliente
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ofrecemos una experiencia consistente y omnicanal en todos los puntos de contacto digitales.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cx_1"
                      value={value}
                      checked={formData.cx_1 === value.toString()}
                      onChange={(e) => handleScaleChange('cx_1', e.target.value)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personalizamos contenidos u ofertas usando datos de comportamiento del cliente.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cx_2"
                      value={value}
                      checked={formData.cx_2 === value.toString()}
                      onChange={(e) => handleScaleChange('cx_2', e.target.value)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="cx_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué aspecto de la experiencia digital del cliente más te gustaría mejorar? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="cx_abierta"
                value={formData.cx_abierta}
                onChange={(e) => handleTextChange('cx_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 8. Innovación y Transformación (IN) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">IN</span>
            8. Innovación y Transformación
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contamos con un programa formal que impulsa proyectos de innovación digital cada año.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="in_1"
                      value={value}
                      checked={formData.in_1 === value.toString()}
                      onChange={(e) => handleScaleChange('in_1', e.target.value)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asignamos presupuesto específico para tecnologías emergentes y pilotos de transformación.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="in_2"
                      value={value}
                      checked={formData.in_2 === value.toString()}
                      onChange={(e) => handleScaleChange('in_2', e.target.value)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="in_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                Menciona la iniciativa de innovación digital más ambiciosa que quisieras lanzar. <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="in_abierta"
                value={formData.in_abierta}
                onChange={(e) => handleTextChange('in_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors font-semibold text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Evaluación de Madurez Digital'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Componente del formulario de Eficiencia Operativa
const FormularioEficienciaOperativa = ({ onAnalysisComplete, userId, metricKey, initialFormData = {}, hasExistingAnalysis = false }) => {
  const [formData, setFormData] = useState({
    // 1. Diseño y Mapeo de Procesos (DP)
    dp_1: "",
    dp_2: "",
    dp_abierta: "",
    
    // 2. KPIs y Productividad Operativa (KP)
    kp_1: "",
    kp_2: "",
    kp_abierta: "",
    
    // 3. Tecnología y Automatización (TA)
    ta_1: "",
    ta_2: "",
    ta_abierta: "",
    
    // 4. Calidad y Mejora Continua (CQ)
    cq_1: "",
    cq_2: "",
    cq_abierta: "",
    
    // 5. Colaboración y Cultura de Eficiencia (CC)
    cc_1: "",
    cc_2: "",
    cc_abierta: "",
    
    // 6. Visibilidad y Trazabilidad en Tiempo Real (VT)
    vt_1: "",
    vt_2: "",
    vt_abierta: ""
  });

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calcular el valor porcentual basado en las respuestas
      const closedQuestions = ['dp_1', 'dp_2', 'kp_1', 'kp_2', 'ta_1', 'ta_2', 'cq_1', 'cq_2', 'cc_1', 'cc_2', 'vt_1', 'vt_2'];
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
      console.error('Error:', error);
      alert('Error al procesar el formulario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-[#1A3D7C] mb-6">Formulario de Evaluación de Eficiencia Operativa</h2>
      
      {/* Leyenda de la escala */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Escala de evaluación:</h3>
        <div className="flex gap-6 text-xs text-gray-600">
          <div><span className="font-medium">1:</span> Totalmente en desacuerdo</div>
          <div><span className="font-medium">2:</span> En desacuerdo</div>
          <div><span className="font-medium">3:</span> Neutral</div>
          <div><span className="font-medium">4:</span> De acuerdo</div>
          <div><span className="font-medium">5:</span> Totalmente de acuerdo</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Diseño y Mapeo de Procesos (DP) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">DP</span>
            1. Diseño y Mapeo de Procesos
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuestros procesos clave están documentados, actualizados y cada uno tiene un responsable claro.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dp_1"
                      value={value}
                      checked={formData.dp_1 === value.toString()}
                      onChange={(e) => handleScaleChange('dp_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Revisamos y validamos el mapa de procesos al menos una vez al año.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dp_2"
                      value={value}
                      checked={formData.dp_2 === value.toString()}
                      onChange={(e) => handleScaleChange('dp_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="dp_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué impide que todos los procesos estén documentados y al día? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="dp_abierta"
                value={formData.dp_abierta}
                onChange={(e) => handleTextChange('dp_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 2. KPIs y Productividad Operativa (KP) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">KP</span>
            2. KPIs y Productividad Operativa
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponemos de KPIs operativos (tiempo de ciclo, productividad, defectos) revisados mensualmente con planes de acción.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="kp_1"
                      value={value}
                      checked={formData.kp_1 === value.toString()}
                      onChange={(e) => handleScaleChange('kp_1', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Todo el personal conoce sus metas y recibe retroalimentación de desempeño de forma regular.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="kp_2"
                      value={value}
                      checked={formData.kp_2 === value.toString()}
                      onChange={(e) => handleScaleChange('kp_2', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="kp_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuál KPI operativo te causa mayor dolor hoy? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="kp_abierta"
                value={formData.kp_abierta}
                onChange={(e) => handleTextChange('kp_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 3. Tecnología y Automatización (TA) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">TA</span>
            3. Tecnología y Automatización
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operamos con un sistema integrado (ERP/BPM) que cubre la mayoría de nuestras áreas clave.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ta_1"
                      value={value}
                      checked={formData.ta_1 === value.toString()}
                      onChange={(e) => handleScaleChange('ta_1', e.target.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hemos automatizado tareas repetitivas mediante RPA, macros o workflows digitales.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ta_2"
                      value={value}
                      checked={formData.ta_2 === value.toString()}
                      onChange={(e) => handleScaleChange('ta_2', e.target.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="ta_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué tarea manual te gustaría automatizar primero? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="ta_abierta"
                value={formData.ta_abierta}
                onChange={(e) => handleTextChange('ta_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 4. Calidad y Mejora Continua (CQ) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">CQ</span>
            4. Calidad y Mejora Continua
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contamos con un sistema formal de gestión de calidad que analiza causas raíz y define acciones correctivas.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cq_1"
                      value={value}
                      checked={formData.cq_1 === value.toString()}
                      onChange={(e) => handleScaleChange('cq_1', e.target.value)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aplicamos metodologías Lean o Six Sigma con proyectos activos cada trimestre.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cq_2"
                      value={value}
                      checked={formData.cq_2 === value.toString()}
                      onChange={(e) => handleScaleChange('cq_2', e.target.value)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="cq_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuál es la queja de calidad que más se repite? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="cq_abierta"
                value={formData.cq_abierta}
                onChange={(e) => handleTextChange('cq_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 5. Colaboración y Cultura de Eficiencia (CC) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">CC</span>
            5. Colaboración y Cultura de Eficiencia
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Las áreas trabajan con SLAs y reuniones regulares, compartiendo objetivos de eficiencia comunes.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cc_1"
                      value={value}
                      checked={formData.cc_1 === value.toString()}
                      onChange={(e) => handleScaleChange('cc_1', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Los proyectos de mejora incluyen equipos multidisciplinarios que comparten buenas prácticas.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cc_2"
                      value={value}
                      checked={formData.cc_2 === value.toString()}
                      onChange={(e) => handleScaleChange('cc_2', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="cc_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Dónde notas más silos o fricción entre departamentos? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="cc_abierta"
                value={formData.cc_abierta}
                onChange={(e) => handleTextChange('cc_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 6. Visibilidad y Trazabilidad en Tiempo Real (VT) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">VT</span>
            6. Visibilidad y Trazabilidad en Tiempo Real
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Podemos rastrear en tiempo real pedidos, inventarios y producción en un tablero único.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="vt_1"
                      value={value}
                      checked={formData.vt_1 === value.toString()}
                      onChange={(e) => handleScaleChange('vt_1', e.target.value)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Utilizamos dashboards de BI para tomar decisiones operativas con datos al día.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="vt_2"
                      value={value}
                      checked={formData.vt_2 === value.toString()}
                      onChange={(e) => handleScaleChange('vt_2', e.target.value)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="vt_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué dato operativo te gustaría ver en tiempo real y aún no tienes? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="vt_abierta"
                value={formData.vt_abierta}
                onChange={(e) => handleTextChange('vt_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors font-semibold text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Evaluación de Eficiencia Operativa'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Componente del formulario de Recursos Humanos
const FormularioRecursosHumanos = ({ onAnalysisComplete, userId, metricKey, initialFormData = {}, hasExistingAnalysis = false }) => {
  const [formData, setFormData] = useState({
    // 1. Reclutamiento y Onboarding (RO)
    ro_1: "",
    ro_2: "",
    ro_3: "",
    ro_abierta: "",
    
    // 2. Desarrollo y Retención (DR)
    dr_1: "",
    dr_2: "",
    dr_3: "",
    dr_abierta: "",
    
    // 3. Cultura, Clima y Comunicación (CC)
    cc_1: "",
    cc_2: "",
    cc_3: "",
    cc_abierta: "",
    
    // 4. Liderazgo y Estructura (LE)
    le_1: "",
    le_2: "",
    le_3: "",
    le_abierta: "",
    
    // 5. Desempeño y Reconocimiento (PR)
    pr_1: "",
    pr_2: "",
    pr_3: "",
    pr_abierta: ""
  });

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calcular el valor porcentual basado en las respuestas
      const closedQuestions = ['ro_1', 'ro_2', 'ro_3', 'dr_1', 'dr_2', 'dr_3', 'cc_1', 'cc_2', 'cc_3', 'le_1', 'le_2', 'le_3', 'pr_1', 'pr_2', 'pr_3'];
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
      console.error('Error:', error);
      alert('Error al procesar el formulario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-[#1A3D7C] mb-6">Formulario de Evaluación de Recursos Humanos</h2>
      
      {/* Leyenda de la escala */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Escala de evaluación:</h3>
        <div className="flex gap-6 text-xs text-gray-600">
          <div><span className="font-medium">1:</span> Totalmente en desacuerdo</div>
          <div><span className="font-medium">2:</span> En desacuerdo</div>
          <div><span className="font-medium">3:</span> Neutral</div>
          <div><span className="font-medium">4:</span> De acuerdo</div>
          <div><span className="font-medium">5:</span> Totalmente de acuerdo</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Reclutamiento y Onboarding (RO) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">RO</span>
            1. Reclutamiento y Onboarding
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cada vacante parte de un perfil de puesto actualizado y consensuado con el área solicitante.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ro_1"
                      value={value}
                      checked={formData.ro_1 === value.toString()}
                      onChange={(e) => handleScaleChange('ro_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usamos un proceso de selección estandarizado (entrevistas estructuradas + pruebas) y lo monitoreamos con un ATS o equivalente.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ro_2"
                      value={value}
                      checked={formData.ro_2 === value.toString()}
                      onChange={(e) => handleScaleChange('ro_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                El onboarding incluye plan de 30-60-90 días, mentor asignado y evaluación al final.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ro_3"
                      value={value}
                      checked={formData.ro_3 === value.toString()}
                      onChange={(e) => handleScaleChange('ro_3', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="ro_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Dónde perdemos más candidatos valiosos en el funnel de reclutamiento? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="ro_abierta"
                value={formData.ro_abierta}
                onChange={(e) => handleTextChange('ro_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 2. Desarrollo y Retención (DR) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">DR</span>
            2. Desarrollo y Retención
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cada colaborador tiene un plan de desarrollo individual revisado al menos una vez al año.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dr_1"
                      value={value}
                      checked={formData.dr_1 === value.toString()}
                      onChange={(e) => handleScaleChange('dr_1', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invertimos de forma consistente ≥ 2% de la nómina en formación o certificaciones relevantes.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dr_2"
                      value={value}
                      checked={formData.dr_2 === value.toString()}
                      onChange={(e) => handleScaleChange('dr_2', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tenemos iniciativas de retención (beneficios, flexibilidad, wellness) y medimos su impacto en la rotación.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dr_3"
                      value={value}
                      checked={formData.dr_3 === value.toString()}
                      onChange={(e) => handleScaleChange('dr_3', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="dr_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué beneficio crees que más elevaría la permanencia del talento clave? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="dr_abierta"
                value={formData.dr_abierta}
                onChange={(e) => handleTextChange('dr_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 3. Cultura, Clima y Comunicación (CC) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">CC</span>
            3. Cultura, Clima y Comunicación
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Los valores corporativos están claros y los líderes los refuerzan con el ejemplo.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cc_1"
                      value={value}
                      checked={formData.cc_1 === value.toString()}
                      onChange={(e) => handleScaleChange('cc_1', e.target.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medimos clima laboral al menos una vez al año y generamos planes de acción públicos.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cc_2"
                      value={value}
                      checked={formData.cc_2 === value.toString()}
                      onChange={(e) => handleScaleChange('cc_2', e.target.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Existen canales bidireccionales (town halls, foros, buzón anónimo) y el feedback se toma en cuenta.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cc_3"
                      value={value}
                      checked={formData.cc_3 === value.toString()}
                      onChange={(e) => handleScaleChange('cc_3', e.target.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="cc_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué valor de la cultura actual te parece puro adorno y no se vive? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="cc_abierta"
                value={formData.cc_abierta}
                onChange={(e) => handleTextChange('cc_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 4. Liderazgo y Estructura (LE) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">LE</span>
            4. Liderazgo y Estructura
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                El organigrama es conocido y las responsabilidades están documentadas para evitar solapamientos.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="le_1"
                      value={value}
                      checked={formData.le_1 === value.toString()}
                      onChange={(e) => handleScaleChange('le_1', e.target.value)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Los líderes reciben feedback 360° y coaching para mejorar su estilo.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="le_2"
                      value={value}
                      checked={formData.le_2 === value.toString()}
                      onChange={(e) => handleScaleChange('le_2', e.target.value)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                La toma de decisiones está descentralizada dentro de límites claros, fomentando empowerment.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="le_3"
                      value={value}
                      checked={formData.le_3 === value.toString()}
                      onChange={(e) => handleScaleChange('le_3', e.target.value)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="le_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuál es el mayor obstáculo que te impide decidir rápido en tu rol? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="le_abierta"
                value={formData.le_abierta}
                onChange={(e) => handleTextChange('le_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* 5. Desempeño y Reconocimiento (PR) */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">PR</span>
            5. Desempeño y Reconocimiento
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                La evaluación de desempeño enlaza metas individuales/OKRs con los objetivos de negocio.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pr_1"
                      value={value}
                      checked={formData.pr_1 === value.toString()}
                      onChange={(e) => handleScaleChange('pr_1', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                El desempeño sobresaliente se reconoce con recompensas monetarias y no monetarias visibles.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pr_2"
                      value={value}
                      checked={formData.pr_2 === value.toString()}
                      onChange={(e) => handleScaleChange('pr_2', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Revisamos equidad salarial y brechas de género o antigüedad al menos una vez al año.
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="pr_3"
                      value={value}
                      checked={formData.pr_3 === value.toString()}
                      onChange={(e) => handleScaleChange('pr_3', e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="pr_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué forma de reconocimiento te motiva más y aún no existe? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="pr_abierta"
                value={formData.pr_abierta}
                onChange={(e) => handleTextChange('pr_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors font-semibold text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Evaluación de Recursos Humanos'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Componente del formulario de Marketing y Ventas (0-5 scale)
const FormularioMarketingVentas = ({ onAnalysisComplete, userId, metricKey, initialFormData = {}, hasExistingAnalysis = false }) => {
  const [formData, setFormData] = useState({
    // Sección 1. Estrategia de Marketing y Posicionamiento
    s1_1: "", s1_2: "", s1_3: "", s1_4: "", s1_5: "", s1_6: "", s1_7: "",
    s1_abierta: "",
    
    // Sección 2. Conocimiento del Mercado y Segmentación
    s2_1: "", s2_2: "", s2_3: "", s2_4: "", s2_5: "", s2_6: "", s2_7: "",
    s2_abierta: "",
    
    // Sección 3. Canales de Venta y Ejecución Comercial
    s3_1: "", s3_2: "", s3_3: "", s3_4: "", s3_5: "", s3_6: "", s3_7: "",
    s3_abierta: "",
    
    // Sección 4. Marketing Digital y Automatización
    s4_1: "", s4_2: "", s4_3: "", s4_4: "", s4_5: "", s4_6: "", s4_7: "",
    s4_abierta: "",
    
    // Sección 5. Relación con el Cliente y Retención
    s5_1: "", s5_2: "", s5_3: "", s5_4: "", s5_5: "", s5_6: "", s5_7: "",
    s5_abierta: ""
  });

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calcular el valor porcentual basado en las respuestas (escala 0-5)
      const closedQuestions = ['s1_1', 's1_2', 's1_3', 's1_4', 's1_5', 's1_6', 's1_7', 's2_1', 's2_2', 's2_3', 's2_4', 's2_5', 's2_6', 's2_7', 's3_1', 's3_2', 's3_3', 's3_4', 's3_5', 's3_6', 's3_7', 's4_1', 's4_2', 's4_3', 's4_4', 's4_5', 's4_6', 's4_7', 's5_1', 's5_2', 's5_3', 's5_4', 's5_5', 's5_6', 's5_7'];
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
      console.error('Error:', error);
      alert('Error al procesar el formulario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-[#1A3D7C] mb-6">Formulario de Evaluación de Marketing y Ventas</h2>
      
      {/* Leyenda de la escala */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Escala de evaluación:</h3>
        <div className="flex gap-6 text-xs text-gray-600">
          <div><span className="font-medium">0:</span> Inexistente</div>
          <div><span className="font-medium">1:</span> Muy básico</div>
          <div><span className="font-medium">2:</span> Básico</div>
          <div><span className="font-medium">3:</span> Regular</div>
          <div><span className="font-medium">4:</span> Bueno</div>
          <div><span className="font-medium">5:</span> Excelente</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sección 1. Estrategia de Marketing y Posicionamiento */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">S1</span>
            Estrategia de Marketing y Posicionamiento
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1️⃣ ¿Existe un plan de marketing escrito y alineado al plan de negocio?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s1_1"
                      value={value}
                      checked={formData.s1_1 === value.toString()}
                      onChange={(e) => handleScaleChange('s1_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2️⃣ ¿La propuesta de valor y los diferenciadores se comunican de forma consistente?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s1_2"
                      value={value}
                      checked={formData.s1_2 === value.toString()}
                      onChange={(e) => handleScaleChange('s1_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3️⃣ ¿El posicionamiento de marca (narrativa, identidad visual) está normalizado en todos los canales?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s1_3"
                      value={value}
                      checked={formData.s1_3 === value.toString()}
                      onChange={(e) => handleScaleChange('s1_3', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                4️⃣ ¿Se definen KPIs de marketing (awareness, leads, ROI) y se revisan al menos trimestralmente?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s1_4"
                      value={value}
                      checked={formData.s1_4 === value.toString()}
                      onChange={(e) => handleScaleChange('s1_4', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                5️⃣ ¿El presupuesto de marketing está fijado y se evalúa el retorno de cada iniciativa?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s1_5"
                      value={value}
                      checked={formData.s1_5 === value.toString()}
                      onChange={(e) => handleScaleChange('s1_5', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                6️⃣ ¿La dirección participa activamente en la revisión de la estrategia de marketing?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s1_6"
                      value={value}
                      checked={formData.s1_6 === value.toString()}
                      onChange={(e) => handleScaleChange('s1_6', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                7️⃣ ¿El plan contempla un mix on & offline coherente para cada audiencia?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s1_7"
                      value={value}
                      checked={formData.s1_7 === value.toString()}
                      onChange={(e) => handleScaleChange('s1_7', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="s1_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                🗣️ Pregunta abierta: Describe tu mayor reto actual para hacer que el mercado "entienda" tu propuesta de valor. <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="s1_abierta"
                value={formData.s1_abierta}
                onChange={(e) => handleTextChange('s1_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* Sección 2. Conocimiento del Mercado y Segmentación */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">S2</span>
            Conocimiento del Mercado y Segmentación
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1️⃣ ¿Realizas estudios de mercado (encuestas, focus, desk research) con regularidad?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s2_1"
                      value={value}
                      checked={formData.s2_1 === value.toString()}
                      onChange={(e) => handleScaleChange('s2_1', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2️⃣ ¿Mantienes un mapa competitivo actualizado (fortalezas, precios, share of voice)?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s2_2"
                      value={value}
                      checked={formData.s2_2 === value.toString()}
                      onChange={(e) => handleScaleChange('s2_2', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3️⃣ ¿Segmentas al mercado y adaptas mensajes, precios o productos por segmento?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s2_3"
                      value={value}
                      checked={formData.s2_3 === value.toString()}
                      onChange={(e) => handleScaleChange('s2_3', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                4️⃣ ¿Tienes definidos y documentados buyer-personas o perfiles de cliente ideal?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s2_4"
                      value={value}
                      checked={formData.s2_4 === value.toString()}
                      onChange={(e) => handleScaleChange('s2_4', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                5️⃣ ¿Monitoreas tendencias (tecnológicas, regulatorias, consumo) para anticipar cambios?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s2_5"
                      value={value}
                      checked={formData.s2_5 === value.toString()}
                      onChange={(e) => handleScaleChange('s2_5', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                6️⃣ ¿Empleas herramientas de social listening o analítica de conversaciones on-line?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s2_6"
                      value={value}
                      checked={formData.s2_6 === value.toString()}
                      onChange={(e) => handleScaleChange('s2_6', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                7️⃣ ¿Ajustas propuestas o promociones de acuerdo con cada segmento identificado?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s2_7"
                      value={value}
                      checked={formData.s2_7 === value.toString()}
                      onChange={(e) => handleScaleChange('s2_7', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="s2_abierta" className="block text-sm font-medium text-gray-700 mb-2">
                🗣️ Pregunta abierta: ¿Qué descubrimiento reciente sobre tu mercado te sorprendió más? <span className="text-gray-500 text-xs">(Opcional)</span>
              </label>
              <textarea
                id="s2_abierta"
                value={formData.s2_abierta}
                onChange={(e) => handleTextChange('s2_abierta', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe tu respuesta aquí... (Opcional)"
              />
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors font-semibold text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Evaluación de Marketing y Ventas'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Componente del formulario de Experiencia del Cliente
const FormularioExperienciaCliente = ({ onAnalysisComplete, userId, metricKey, initialFormData = {}, hasExistingAnalysis = false }) => {
  const [formData, setFormData] = useState({
    // Sección 1. Conocimiento y Segmentación del Cliente
    s1_1: "", s1_2: "", s1_3: "", s1_4: "", s1_5: "", s1_6: "", s1_7: "",
    s1_abierta: "",
    
    // Sección 2. Diseño de Experiencia y Journey Mapping
    s2_1: "", s2_2: "", s2_3: "", s2_4: "", s2_5: "", s2_6: "", s2_7: "",
    s2_abierta: "",
    
    // Sección 3. Personalización y Recomendaciones
    s3_1: "", s3_2: "", s3_3: "", s3_4: "", s3_5: "", s3_6: "", s3_7: "",
    s3_abierta: "",
    
    // Sección 4. Feedback y Medición de Satisfacción
    s4_1: "", s4_2: "", s4_3: "", s4_4: "", s4_5: "", s4_6: "", s4_7: "",
    s4_abierta: "",
    
    // Sección 5. Retención y Fidelización
    s5_1: "", s5_2: "", s5_3: "", s5_4: "", s5_5: "", s5_6: "", s5_7: "",
    s5_abierta: ""
  });

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calcular el valor porcentual basado en las respuestas (escala 0-5)
      const closedQuestions = ['s1_1', 's1_2', 's2_1', 's2_2', 's3_1', 's3_2', 's4_1', 's4_2', 's5_1', 's5_2'];
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
      console.error('Error:', error);
      alert('Error al procesar el formulario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-[#1A3D7C] mb-6">Formulario de Evaluación de Experiencia del Cliente</h2>
      
      {/* Leyenda de la escala */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Escala de evaluación:</h3>
        <div className="flex gap-6 text-xs text-gray-600">
          <div><span className="font-medium">0:</span> Inexistente</div>
          <div><span className="font-medium">1:</span> Muy básico</div>
          <div><span className="font-medium">2:</span> Básico</div>
          <div><span className="font-medium">3:</span> Regular</div>
          <div><span className="font-medium">4:</span> Bueno</div>
          <div><span className="font-medium">5:</span> Excelente</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sección 1. Conocimiento y Segmentación del Cliente */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">S1</span>
            Conocimiento y Segmentación del Cliente
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1️⃣ ¿Tenemos perfiles detallados de nuestros clientes principales?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s1_1"
                      value={value}
                      checked={formData.s1_1 === value.toString()}
                      onChange={(e) => handleScaleChange('s1_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2️⃣ ¿Entendemos las necesidades y expectativas de cada segmento de clientes?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s1_2"
                      value={value}
                      checked={formData.s1_2 === value.toString()}
                      onChange={(e) => handleScaleChange('s1_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué aspectos específicos de la experiencia del cliente te gustaría mejorar? (Opcional)
              </label>
              <textarea
                value={formData.s1_abierta}
                onChange={(e) => handleTextChange('s1_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe los aspectos que consideras importantes..."
              />
            </div>
          </div>
        </div>

        {/* Sección 2. Diseño de Experiencia y Journey Mapping */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">S2</span>
            Diseño de Experiencia y Journey Mapping
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1️⃣ ¿Hemos mapeado el journey completo del cliente?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s2_1"
                      value={value}
                      checked={formData.s2_1 === value.toString()}
                      onChange={(e) => handleScaleChange('s2_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2️⃣ ¿Identificamos y optimizamos los puntos de contacto críticos?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s2_2"
                      value={value}
                      checked={formData.s2_2 === value.toString()}
                      onChange={(e) => handleScaleChange('s2_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué canales de atención al cliente consideras más importantes para tu negocio? (Opcional)
              </label>
              <textarea
                value={formData.s2_abierta}
                onChange={(e) => handleTextChange('s2_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe los canales y su importancia..."
              />
            </div>
          </div>
        </div>

        {/* Sección 3. Personalización y Recomendaciones */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">S3</span>
            Personalización y Recomendaciones
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1️⃣ ¿Ofrecemos experiencias personalizadas basadas en el comportamiento del cliente?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s3_1"
                      value={value}
                      checked={formData.s3_1 === value.toString()}
                      onChange={(e) => handleScaleChange('s3_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2️⃣ ¿Utilizamos datos para hacer recomendaciones relevantes?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s3_2"
                      value={value}
                      checked={formData.s3_2 === value.toString()}
                      onChange={(e) => handleScaleChange('s3_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué tipo de personalización te gustaría implementar? (Opcional)
              </label>
              <textarea
                value={formData.s3_abierta}
                onChange={(e) => handleTextChange('s3_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las oportunidades de personalización..."
              />
            </div>
          </div>
        </div>

        {/* Sección 4. Feedback y Medición de Satisfacción */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">S4</span>
            Feedback y Medición de Satisfacción
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1️⃣ ¿Recopilamos feedback de los clientes de manera sistemática?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s4_1"
                      value={value}
                      checked={formData.s4_1 === value.toString()}
                      onChange={(e) => handleScaleChange('s4_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2️⃣ ¿Medimos y analizamos métricas de satisfacción del cliente?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s4_2"
                      value={value}
                      checked={formData.s4_2 === value.toString()}
                      onChange={(e) => handleScaleChange('s4_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué métricas de satisfacción consideras más importantes para tu negocio? (Opcional)
              </label>
              <textarea
                value={formData.s4_abierta}
                onChange={(e) => handleTextChange('s4_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las métricas clave..."
              />
            </div>
          </div>
        </div>

        {/* Sección 5. Retención y Fidelización */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">S5</span>
            Retención y Fidelización
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1️⃣ ¿Tenemos estrategias activas para retener clientes existentes?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s5_1"
                      value={value}
                      checked={formData.s5_1 === value.toString()}
                      onChange={(e) => handleScaleChange('s5_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2️⃣ ¿Implementamos programas de fidelización efectivos?
              </label>
              <div className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s5_2"
                      value={value}
                      checked={formData.s5_2 === value.toString()}
                      onChange={(e) => handleScaleChange('s5_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué estrategias de fidelización te gustaría implementar? (Opcional)
              </label>
              <textarea
                value={formData.s5_abierta}
                onChange={(e) => handleTextChange('s5_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las estrategias de fidelización..."
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors font-semibold text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Evaluación de Experiencia del Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Componente del formulario de Gestión de Riesgos
const FormularioGestionRiesgos = ({ onAnalysisComplete, userId, metricKey, initialFormData = {}, hasExistingAnalysis = false }) => {
  const [formData, setFormData] = useState({
    // Sección 1. Identificación y Evaluación de Riesgos
    s1_1: "", s1_2: "", s1_3: "", s1_4: "", s1_5: "", s1_6: "", s1_7: "",
    s1_abierta: "",
    
    // Sección 2. Cumplimiento Normativo y Legal
    s2_1: "", s2_2: "", s2_3: "", s2_4: "", s2_5: "", s2_6: "", s2_7: "",
    s2_abierta: "",
    
    // Sección 3. Documentación y Controles
    s3_1: "", s3_2: "", s3_3: "", s3_4: "", s3_5: "", s3_6: "", s3_7: "",
    s3_abierta: "",
    
    // Sección 4. Auditorías y Monitoreo
    s4_1: "", s4_2: "", s4_3: "", s4_4: "", s4_5: "", s4_6: "", s4_7: "",
    s4_abierta: "",
    
    // Sección 5. Capacitación y Cultura de Cumplimiento
    s5_1: "", s5_2: "", s5_3: "", s5_4: "", s5_5: "", s5_6: "", s5_7: "",
    s5_abierta: ""
  });

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calcular el valor porcentual basado en las respuestas (escala 1-5)
      const closedQuestions = ['s1_1', 's1_2', 's2_1', 's2_2', 's3_1', 's3_2', 's4_1', 's4_2', 's5_1', 's5_2'];
      const answeredQuestions = closedQuestions.filter(q => formData[q] !== "");
      const totalScore = answeredQuestions.reduce((sum, q) => sum + parseInt(formData[q]), 0);
      const averageScore = answeredQuestions.length > 0 ? totalScore / answeredQuestions.length : 0;
      const valorPorcentual = Math.round((averageScore / 5) * 100);

      // Preparar datos para el análisis
      const datosMetrica = {
        formData,
        valorPorcentual,
        metricKey: 'gestionRiesgos',
        metricTitle: 'Gestión de Riesgos'
      };

      const response = await fetch(`/api/metric-analysis/${metricKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          metricKey,
          metricTitle: 'Gestión de Riesgos',
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
      console.error('Error:', error);
      alert('Error al procesar el formulario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-[#1A3D7C] mb-6">Formulario de Evaluación de Gestión de Riesgos</h2>
      
      {/* Leyenda de la escala */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Escala de evaluación:</h3>
        <div className="flex gap-6 text-xs text-gray-600">
          <div><span className="font-medium">1:</span> Totalmente en desacuerdo</div>
          <div><span className="font-medium">2:</span> En desacuerdo</div>
          <div><span className="font-medium">3:</span> Neutral</div>
          <div><span className="font-medium">4:</span> De acuerdo</div>
          <div><span className="font-medium">5:</span> Totalmente de acuerdo</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sección 1. Identificación y Evaluación de Riesgos */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">S1</span>
            Identificación y Evaluación de Riesgos
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Identificamos y evaluamos regularmente los riesgos operativos de nuestro negocio?
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s1_1"
                      value={value}
                      checked={formData.s1_1 === value.toString()}
                      onChange={(e) => handleScaleChange('s1_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Tenemos un proceso formal para la gestión de riesgos?
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s1_2"
                      value={value}
                      checked={formData.s1_2 === value.toString()}
                      onChange={(e) => handleScaleChange('s1_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué tipos de riesgos consideras más críticos para tu negocio? (Opcional)
              </label>
              <textarea
                value={formData.s1_abierta}
                onChange={(e) => handleTextChange('s1_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe los riesgos principales..."
              />
            </div>
          </div>
        </div>

        {/* Sección 2. Cumplimiento Normativo y Legal */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">S2</span>
            Cumplimiento Normativo y Legal
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Cumplimos con todas las regulaciones aplicables a nuestro sector?
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s2_1"
                      value={value}
                      checked={formData.s2_1 === value.toString()}
                      onChange={(e) => handleScaleChange('s2_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Mantenemos actualizados nuestros registros legales y permisos?
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s2_2"
                      value={value}
                      checked={formData.s2_2 === value.toString()}
                      onChange={(e) => handleScaleChange('s2_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué aspectos del cumplimiento normativo te preocupan más? (Opcional)
              </label>
              <textarea
                value={formData.s2_abierta}
                onChange={(e) => handleTextChange('s2_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las preocupaciones de cumplimiento..."
              />
            </div>
          </div>
        </div>

        {/* Sección 3. Documentación y Controles */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">S3</span>
            Documentación y Controles
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Mantenemos documentación actualizada de nuestros procesos y políticas?
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s3_1"
                      value={value}
                      checked={formData.s3_1 === value.toString()}
                      onChange={(e) => handleScaleChange('s3_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Implementamos controles internos efectivos para mitigar riesgos?
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s3_2"
                      value={value}
                      checked={formData.s3_2 === value.toString()}
                      onChange={(e) => handleScaleChange('s3_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué tipo de documentación consideras más importante para tu negocio? (Opcional)
              </label>
              <textarea
                value={formData.s3_abierta}
                onChange={(e) => handleTextChange('s3_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe la documentación clave..."
              />
            </div>
          </div>
        </div>

        {/* Sección 4. Auditorías y Monitoreo */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">S4</span>
            Auditorías y Monitoreo
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Realizamos auditorías internas o externas regularmente?
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s4_1"
                      value={value}
                      checked={formData.s4_1 === value.toString()}
                      onChange={(e) => handleScaleChange('s4_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Monitoreamos continuamente el cumplimiento de nuestros controles?
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s4_2"
                      value={value}
                      checked={formData.s4_2 === value.toString()}
                      onChange={(e) => handleScaleChange('s4_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué tipo de auditorías o monitoreo consideras más valioso? (Opcional)
              </label>
              <textarea
                value={formData.s4_abierta}
                onChange={(e) => handleTextChange('s4_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las auditorías importantes..."
              />
            </div>
          </div>
        </div>

        {/* Sección 5. Capacitación y Cultura de Cumplimiento */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">S5</span>
            Capacitación y Cultura de Cumplimiento
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. ¿Capacitamos a nuestro personal en temas de cumplimiento y gestión de riesgos?
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s5_1"
                      value={value}
                      checked={formData.s5_1 === value.toString()}
                      onChange={(e) => handleScaleChange('s5_1', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. ¿Promovemos una cultura de cumplimiento y gestión de riesgos en la organización?
              </label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="s5_2"
                      value={value}
                      checked={formData.s5_2 === value.toString()}
                      onChange={(e) => handleScaleChange('s5_2', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué tipo de capacitación en gestión de riesgos te gustaría implementar? (Opcional)
              </label>
              <textarea
                value={formData.s5_abierta}
                onChange={(e) => handleTextChange('s5_abierta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Describe las necesidades de capacitación..."
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors font-semibold text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Evaluación de Gestión de Riesgos'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default function MetricDetails({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState(null);
  const [centralAnalysis, setCentralAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [hasExistingAnalysis, setHasExistingAnalysis] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { metricKey } = params;
  const userId = searchParams.get('userId');

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!userId) {
        setError("No se encontró el ID de usuario");
        return;
      }

      try {
        let hasCentralAnalysis = false;
        let hasSpecificAnalysis = false;

        // 1. Cargar análisis central (diagnóstico central con porcentajes)
        const responseCentral = await fetch(`/api/analysis_results?userId=${userId}`);
        console.log('Respuesta del análisis central:', responseCentral.status);
        
        if (responseCentral.ok) {
          const result = await responseCentral.json();
          console.log('Datos del análisis central:', result);
          
          if (result.success && result.data) {
            setCentralAnalysis(result.data);
            hasCentralAnalysis = true;
            
            // Extraer datos de la métrica específica del análisis central
            const metricAnalysis = result.data.analisisMetricas[metricKey];
            const valorPorcentual = result.data.metricasPorcentuales[metricKey];
            
            console.log('Métrica del análisis central:', metricAnalysis);
            console.log('Valor porcentual:', valorPorcentual);
            
            if (metricAnalysis) {
              setAnalysis({
                ...metricAnalysis,
                valorPorcentual: valorPorcentual || 0
              });
            }
          }
        }

        // 2. Cargar análisis específico de la métrica (si existe)
        const response = await fetch(`/api/metric-analysis/${metricKey}?userId=${userId}`);
        console.log('Respuesta del análisis específico:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Datos del análisis específico:', result);
          
          if (result.success && result.data) {
            setAnalysis(result.data);
            setHasExistingAnalysis(true);
            hasSpecificAnalysis = true;
            
            // Cargar datos del formulario si existen
            if (result.data.datosMetrica && result.data.datosMetrica.formData) {
              setFormData(result.data.datosMetrica.formData);
            }
          }
        }

        // Si no se encuentra ningún análisis
        console.log('Estado final - hasCentralAnalysis:', hasCentralAnalysis, 'hasSpecificAnalysis:', hasSpecificAnalysis);
        
        if (!hasCentralAnalysis && !hasSpecificAnalysis) {
          setError("No se encontró el análisis para esta métrica");
        }
      } catch (error) {
        setError("Error al cargar el análisis: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [userId, metricKey]);

  const getMetricTitle = (key) => {
    const titles = {
      madurezDigital: "Madurez Digital",
      saludFinanciera: "Salud Financiera",
      eficienciaOperativa: "Eficiencia Operativa",
      recursosHumanos: "Recursos Humanos",
      marketingVentas: "Marketing y Ventas",
      innovacionDesarrollo: "Innovación y Desarrollo",
      experienciaCliente: "Experiencia del Cliente",
      gestionRiesgos: "Gestión de Riesgos"
    };
    return titles[key] || key;
  };

  const getLevelColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLevelText = (percentage) => {
    if (percentage >= 80) return 'Excelente';
    if (percentage >= 60) return 'Bueno';
    if (percentage >= 40) return 'Regular';
    return 'Necesita Mejora';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A3D7C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-gray-500 text-xl mb-4">No hay análisis disponible</div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A3D7C]">{getMetricTitle(metricKey)}</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors"
          >
            Volver
          </button>
        </div>
      </div>

      {/* Mostrar resultados del análisis si existen */}
      {analysis && (
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <div className="border-b-2 border-[#1A3D7C] pb-4 mb-8">
            <h2 className="text-3xl font-bold text-[#1A3D7C] mb-2">📊 Análisis Detallado</h2>
            <p className="text-gray-600 text-lg">Resultados completos del análisis de {getMetricTitle(metricKey)}</p>
          </div>

          {/* Sección 1: Datos del Diagnóstico Central */}
          {centralAnalysis && centralAnalysis.analisisMetricas[metricKey] && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-[#1A3D7C] mb-6 flex items-center">
                <span className="mr-3">🎯</span>
                Diagnóstico Central - {getMetricTitle(metricKey)}
              </h3>
              
              {/* Header con puntuación destacada */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-t-xl">
                <div className="text-center">
                  <h4 className="text-lg font-medium mb-2 opacity-90">Puntuación General</h4>
                  <div className="text-6xl font-bold mb-2">{centralAnalysis.metricasPorcentuales[metricKey] || 0}%</div>
                  <div className={`text-lg font-medium px-4 py-2 rounded-full inline-block ${
                    getLevelColor(centralAnalysis.metricasPorcentuales[metricKey] || 0) === 'text-green-600' ? 'bg-green-100 text-green-800' :
                    getLevelColor(centralAnalysis.metricasPorcentuales[metricKey] || 0) === 'text-blue-600' ? 'bg-blue-100 text-blue-800' :
                    getLevelColor(centralAnalysis.metricasPorcentuales[metricKey] || 0) === 'text-yellow-600' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getLevelText(centralAnalysis.metricasPorcentuales[metricKey] || 0)}
                  </div>
                </div>
              </div>

              {/* Contenido organizado en cards */}
              <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg">
                <div className="p-6">
                  {/* Descripción del Módulo */}
                  {centralAnalysis.analisisMetricas[metricKey].descripcionModulo && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-2">📋</span>
                        Descripción del Módulo
                      </h4>
                      {typeof centralAnalysis.analisisMetricas[metricKey].descripcionModulo === 'string' ? (
                        <p className="text-gray-700 leading-relaxed">
                          {centralAnalysis.analisisMetricas[metricKey].descripcionModulo}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {centralAnalysis.analisisMetricas[metricKey].descripcionModulo.objetivo && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <h5 className="font-semibold text-blue-800 mb-2">🎯 Objetivo</h5>
                              <p className="text-blue-700 text-sm leading-relaxed">
                                {centralAnalysis.analisisMetricas[metricKey].descripcionModulo.objetivo}
                              </p>
                            </div>
                          )}
                          {centralAnalysis.analisisMetricas[metricKey].descripcionModulo.alcance && (
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                              <h5 className="font-semibold text-indigo-800 mb-2">📏 Alcance</h5>
                              <p className="text-indigo-700 text-sm leading-relaxed">
                                {centralAnalysis.analisisMetricas[metricKey].descripcionModulo.alcance}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      {centralAnalysis.analisisMetricas[metricKey].descripcionModulo.componentes && 
                       centralAnalysis.analisisMetricas[metricKey].descripcionModulo.componentes.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-semibold text-gray-800 mb-3">🔧 Componentes Evaluados</h5>
                          <div className="flex flex-wrap gap-2">
                            {centralAnalysis.analisisMetricas[metricKey].descripcionModulo.componentes.map((componente, index) => (
                              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border">
                                {componente}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Conclusión y Análisis */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Conclusión Basada en Puntuación */}
                    {centralAnalysis.analisisMetricas[metricKey].conclusionBasadaPuntuacion && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                        <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                          <span className="mr-2">📊</span>
                          Conclusión General
                        </h4>
                        <div className="space-y-4">
                          {centralAnalysis.analisisMetricas[metricKey].conclusionBasadaPuntuacion.nivel && (
                            <div>
                              <h5 className="font-medium text-green-700 mb-1">Nivel Actual</h5>
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                {centralAnalysis.analisisMetricas[metricKey].conclusionBasadaPuntuacion.nivel}
                              </span>
                            </div>
                          )}
                          {centralAnalysis.analisisMetricas[metricKey].conclusionBasadaPuntuacion.impactoGeneral && (
                            <div>
                              <h5 className="font-medium text-green-700 mb-2">Impacto General</h5>
                              <p className="text-green-700 text-sm leading-relaxed">
                                {centralAnalysis.analisisMetricas[metricKey].conclusionBasadaPuntuacion.impactoGeneral}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Fortalezas y Áreas de Mejora */}
                    <div className="space-y-4">
                      {centralAnalysis.analisisMetricas[metricKey].conclusionBasadaPuntuacion?.fortalezas && 
                       centralAnalysis.analisisMetricas[metricKey].conclusionBasadaPuntuacion.fortalezas.length > 0 && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h5 className="font-semibold text-green-800 mb-3 flex items-center">
                            <span className="mr-2">✅</span>
                            Fortalezas Identificadas
                          </h5>
                          <ul className="space-y-2">
                            {centralAnalysis.analisisMetricas[metricKey].conclusionBasadaPuntuacion.fortalezas.map((fortaleza, index) => (
                              <li key={index} className="text-green-700 text-sm flex items-start">
                                <span className="mr-2 mt-1">•</span>
                                {fortaleza}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {centralAnalysis.analisisMetricas[metricKey].conclusionBasadaPuntuacion?.areasMejora && 
                       centralAnalysis.analisisMetricas[metricKey].conclusionBasadaPuntuacion.areasMejora.length > 0 && (
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <h5 className="font-semibold text-orange-800 mb-3 flex items-center">
                            <span className="mr-2">⚠️</span>
                            Áreas de Mejora
                          </h5>
                          <ul className="space-y-2">
                            {centralAnalysis.analisisMetricas[metricKey].conclusionBasadaPuntuacion.areasMejora.map((area, index) => (
                              <li key={index} className="text-orange-700 text-sm flex items-start">
                                <span className="mr-2 mt-1">•</span>
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interpretación Completa */}
                  {centralAnalysis.analisisMetricas[metricKey].interpretacionCompleta && (
                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-2">🔍</span>
                        Análisis Detallado
                      </h4>
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        {centralAnalysis.analisisMetricas[metricKey].interpretacionCompleta.analisisDetallado && (
                          <div className="mb-6">
                            <h5 className="font-semibold text-gray-800 mb-3">Análisis Detallado</h5>
                            <p className="text-gray-700 leading-relaxed">
                              {centralAnalysis.analisisMetricas[metricKey].interpretacionCompleta.analisisDetallado}
                            </p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {centralAnalysis.analisisMetricas[metricKey].interpretacionCompleta.tendencias && 
                           centralAnalysis.analisisMetricas[metricKey].interpretacionCompleta.tendencias.length > 0 && (
                            <div>
                              <h5 className="font-semibold text-gray-800 mb-3">📈 Tendencias</h5>
                              <ul className="space-y-2">
                                {centralAnalysis.analisisMetricas[metricKey].interpretacionCompleta.tendencias.map((tendencia, index) => (
                                  <li key={index} className="text-gray-700 text-sm flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    {tendencia}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {centralAnalysis.analisisMetricas[metricKey].interpretacionCompleta.factoresClave && 
                           centralAnalysis.analisisMetricas[metricKey].interpretacionCompleta.factoresClave.length > 0 && (
                            <div>
                              <h5 className="font-semibold text-gray-800 mb-3">🔑 Factores Clave</h5>
                              <ul className="space-y-2">
                                {centralAnalysis.analisisMetricas[metricKey].interpretacionCompleta.factoresClave.map((factor, index) => (
                                  <li key={index} className="text-gray-700 text-sm flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    {factor}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        {centralAnalysis.analisisMetricas[metricKey].interpretacionCompleta.impactoEstrategico && (
                          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h5 className="font-semibold text-blue-800 mb-2">🎯 Impacto Estratégico</h5>
                            <p className="text-blue-700 leading-relaxed">
                              {centralAnalysis.analisisMetricas[metricKey].interpretacionCompleta.impactoEstrategico}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recomendaciones */}
                  {centralAnalysis.analisisMetricas[metricKey].recomendaciones && 
                   centralAnalysis.analisisMetricas[metricKey].recomendaciones.length > 0 && (
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-2">💡</span>
                        Recomendaciones
                      </h4>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                        <ul className="space-y-3">
                          {centralAnalysis.analisisMetricas[metricKey].recomendaciones.map((recomendacion, index) => (
                            <li key={index} className="text-purple-700 leading-relaxed flex items-start">
                              <span className="mr-3 mt-1 text-purple-500 font-bold">{index + 1}.</span>
                              {recomendacion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
                      {/* Sección 2: Análisis Específico de la Métrica (solo si existe) */}
            {hasExistingAnalysis && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-[#1A3D7C] mb-4 flex items-center">
                  <span className="mr-2">🔍</span>
                  Análisis Específico de {getMetricTitle(metricKey)}
                </h3>
              </div>
            )}

            {hasExistingAnalysis && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna 1: Resumen y Descripción */}
                <div className="lg:col-span-1 space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center">
                    <span className="mr-2">📈</span>
                    Resumen Ejecutivo
                  </h3>
                <div className="flex flex-col items-center mb-6">
                  <div className="text-center">
                    <span className="text-6xl font-bold text-[#00AEEF]">{analysis.valorPorcentual || 0}%</span>
                    <div className={`mt-2 text-lg font-medium ${getLevelColor(analysis.valorPorcentual || 0)}`}>
                      {getLevelText(analysis.valorPorcentual || 0)}
                    </div>
                                         <div className="text-sm text-gray-600 mt-1">
                       Análisis Específico de {getMetricTitle(metricKey)}
                     </div>
                  </div>
                </div>
                {analysis.descripcionModulo && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Descripción del Módulo</h4>
                    {typeof analysis.descripcionModulo === 'string' ? (
                      <p className="text-gray-600 text-sm leading-relaxed">{analysis.descripcionModulo}</p>
                    ) : (
                      <div className="space-y-3">
                        {analysis.descripcionModulo.objetivo && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-1">Objetivo</h5>
                            <p className="text-gray-600 text-sm leading-relaxed">{analysis.descripcionModulo.objetivo}</p>
                          </div>
                        )}
                        {analysis.descripcionModulo.alcance && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-1">Alcance</h5>
                            <p className="text-gray-600 text-sm leading-relaxed">{analysis.descripcionModulo.alcance}</p>
                          </div>
                        )}
                        {analysis.descripcionModulo.componentes && analysis.descripcionModulo.componentes.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-1">Componentes</h5>
                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                              {analysis.descripcionModulo.componentes.map((componente, index) => (
                                <li key={index}>{componente}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {analysis.conclusion && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#1A3D7C] mb-3">Conclusión General</h3>
                  {typeof analysis.conclusion === 'string' ? (
                    <p className="text-gray-700 text-sm leading-relaxed">{analysis.conclusion}</p>
                  ) : (
                    <div className="space-y-3">
                      {analysis.conclusion.impactoGeneral && (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">Impacto General</h4>
                          <p className="text-gray-700 text-sm">{analysis.conclusion.impactoGeneral}</p>
                        </div>
                      )}
                      {analysis.conclusion.nivel && !analysis.interpretacion && (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">Nivel Actual</h4>
                          <p className="text-gray-700 text-sm">{analysis.conclusion.nivel}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Columna 2: Análisis Detallado */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center">
                  <span className="mr-2">🔍</span>
                  Análisis Detallado Específico
                </h3>
                <div className="space-y-6">
                  {analysis.interpretacion && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="mr-2">📝</span>
                        Interpretación del Resultado
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">{analysis.interpretacion}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysis.conclusion && analysis.conclusion.fortalezas && analysis.conclusion.fortalezas.length > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                          <span className="mr-2">✅</span>
                          Fortalezas Identificadas
                        </h4>
                        <ul className="list-disc list-inside text-green-700 text-sm space-y-2">
                          {analysis.conclusion.fortalezas.map((fortaleza, index) => (
                            <li key={index} className="leading-relaxed">{fortaleza}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {analysis.conclusion && analysis.conclusion.areasMejora && analysis.conclusion.areasMejora.length > 0 && (
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                          <span className="mr-2">⚠️</span>
                          Áreas de Mejora
                        </h4>
                        <ul className="list-disc list-inside text-orange-700 text-sm space-y-2">
                          {analysis.conclusion.areasMejora.map((area, index) => (
                            <li key={index} className="leading-relaxed">{area}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Recomendaciones */}
                  {analysis.recomendaciones && analysis.recomendaciones.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                        <span className="mr-2">💡</span>
                        Recomendaciones de Acción
                      </h4>
                      <ul className="list-disc list-inside text-blue-700 text-sm space-y-2">
                        {analysis.recomendaciones.map((recomendacion, index) => (
                          <li key={index} className="leading-relaxed">{recomendacion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Proyecto Propuesto - Información Interna */}
              {analysis.proyectoPropuesto && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center">
                    <span className="mr-2">📋</span>
                    Proyecto de Mejora Propuesto
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Nombre del Proyecto</h4>
                      <p className="text-gray-700 font-semibold">{analysis.proyectoPropuesto.nombreProyecto}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Descripción</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{analysis.proyectoPropuesto.descripcionProyecto}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Estimación de Mejora</h4>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-green-600 mr-2">+{analysis.proyectoPropuesto.estimacionMejora}%</span>
                          <span className="text-sm text-gray-600">mejora estimada</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Áreas Involucradas</h4>
                        <div className="flex flex-wrap gap-1">
                          {analysis.proyectoPropuesto.areasInvolucradas && analysis.proyectoPropuesto.areasInvolucradas.map((area, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {analysis.proyectoPropuesto.expertosIdeales && analysis.proyectoPropuesto.expertosIdeales.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Expertos Recomendados</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.proyectoPropuesto.expertosIdeales.map((experto, index) => (
                            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                              {experto}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

                                {/* Proyectos Generados por IA */}
                  {analysis.recomendaciones && analysis.recomendaciones.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                      <h3 className="text-xl font-semibold text-[#1A3D7C] mb-4 flex items-center">
                        <span className="mr-2">🚀</span>
                        Proyectos Generados por IA
                      </h3>
                      <p className="text-gray-600 mb-6 text-sm">
                        Basado en las recomendaciones de acción, se han generado los siguientes proyectos de mejora:
                      </p>
                      
                      <div className="space-y-6">
                        {analysis.recomendaciones.map((recomendacion, index) => (
                          <div key={index} className="bg-white p-6 rounded-lg border border-purple-200 shadow-sm">
                            <div className="mb-4">
                              <h4 className="text-lg font-semibold text-purple-800">
                                Proyecto {index + 1}
                              </h4>
                            </div>
                            
                            <div className="mb-4">
                              <h5 className="font-semibold text-gray-800 mb-2">📋 Nombre del Proyecto</h5>
                              <p className="text-gray-700 text-sm">
                                {recomendacion}
                              </p>
                            </div>
                            
                            <div className="mb-4">
                              <h5 className="font-semibold text-gray-800 mb-2">📝 Descripción del Proyecto</h5>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {recomendacion}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-semibold text-gray-800 mb-2">🔧 Servicios</h5>
                                <ul className="text-gray-700 text-sm space-y-1">
                                  <li>• Consultoría especializada</li>
                                  <li>• Implementación de soluciones</li>
                                  <li>• Seguimiento y monitoreo</li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-gray-800 mb-2">🎯 Objetivos</h5>
                                <ul className="text-gray-700 text-sm space-y-1">
                                  <li>• Mejorar la métrica de {getMetricTitle(metricKey)}</li>
                                  <li>• Implementar las mejores prácticas</li>
                                  <li>• Optimizar procesos y recursos</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm flex items-center">
                          <span className="mr-2">ℹ️</span>
                          <strong>Nota:</strong> Estos proyectos han sido generados automáticamente por IA basándose en las recomendaciones de acción. 
                          Cada proyecto incluye los elementos necesarios para su implementación.
                        </p>
                      </div>
                    </div>
                  )}

              {/* Información del Análisis */}
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">📊</span>
                  Información del Análisis Específico
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Métrica analizada:</span> {getMetricTitle(metricKey)}
                  </div>
                  <div>
                    <span className="font-medium">Fecha de análisis:</span> {analysis.fechaAnalisis ? new Date(analysis.fechaAnalisis).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'No disponible'}
                  </div>

                  <div>
                    <span className="font-medium">Tipo de análisis:</span> 
                    <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Específico
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Estado:</span> 
                    <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Completado
                    </span>
                  </div>
                  <div className="col-span-2 mt-4">
                    <button
                      onClick={() => setShowForm(!showForm)}
                      className="px-4 py-2 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors text-sm"
                    >
                      {showForm ? 'Ocultar Formulario' : 'Realizar Análisis Específico'}
                    </button>
                  </div>
                                  </div>
                </div>
              </div>
            </div>
            )}


          </div>
        )}

        {/* Mostrar información cuando solo hay diagnóstico central */}
        {centralAnalysis && !hasExistingAnalysis && !showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1A3D7C] mb-4">📊 Diagnóstico Central Disponible</h2>
              <p className="text-gray-600 mb-6">
                Tienes un diagnóstico central con un puntaje de <strong>{centralAnalysis.metricasPorcentuales[metricKey] || 0}%</strong> en {getMetricTitle(metricKey)}.
              </p>
              <p className="text-gray-600 mb-6">
                Para obtener un análisis más detallado y recomendaciones específicas, puedes realizar un análisis específico de esta métrica.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-[#1A3D7C] text-white rounded-lg hover:bg-[#00AEEF] transition-colors"
              >
                Realizar Análisis Específico
              </button>
            </div>
          </div>
        )}

      {/* Mostrar el formulario correspondiente solo si no hay análisis o si se solicita actualización */}
      {(!centralAnalysis || showForm) && (
        <>
          {metricKey === 'saludFinanciera' && <FormularioGestionFinanciera onAnalysisComplete={setAnalysis} userId={userId} metricKey={metricKey} initialFormData={formData} hasExistingAnalysis={hasExistingAnalysis} />}
          {metricKey === 'madurezDigital' && <FormularioMadurezDigital onAnalysisComplete={setAnalysis} userId={userId} metricKey={metricKey} initialFormData={formData} hasExistingAnalysis={hasExistingAnalysis} />}
          {metricKey === 'eficienciaOperativa' && <FormularioEficienciaOperativa onAnalysisComplete={setAnalysis} userId={userId} metricKey={metricKey} initialFormData={formData} hasExistingAnalysis={hasExistingAnalysis} />}
          {metricKey === 'recursosHumanos' && <FormularioRecursosHumanos onAnalysisComplete={setAnalysis} userId={userId} metricKey={metricKey} initialFormData={formData} hasExistingAnalysis={hasExistingAnalysis} />}
          {metricKey === 'marketingVentas' && <FormularioMarketingVentas onAnalysisComplete={setAnalysis} userId={userId} metricKey={metricKey} initialFormData={formData} hasExistingAnalysis={hasExistingAnalysis} />}
          {metricKey === 'experienciaCliente' && <FormularioExperienciaCliente onAnalysisComplete={setAnalysis} userId={userId} metricKey={metricKey} initialFormData={formData} hasExistingAnalysis={hasExistingAnalysis} />}
          {metricKey === 'gestionRiesgos' && <FormularioGestionRiesgos onAnalysisComplete={setAnalysis} userId={userId} metricKey={metricKey} initialFormData={formData} hasExistingAnalysis={hasExistingAnalysis} />}
        </>
      )}
    </div>
  );
} 