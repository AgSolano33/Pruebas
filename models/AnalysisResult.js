import mongoose from 'mongoose';

const analysisResultSchema = new mongoose.Schema({
  empresa: {
    nombre: String,
    sector: String,
    ubicacion: String
  },
  fechaAnalisis: {
    type: Date,
    default: Date.now
  },
  resumenEmpresa: {
    descripcion: String,
    fortalezas: [String],
    debilidades: [String],
    oportunidades: [String]
  },
  analisisObjetivos: {
    situacionActual: String,
    viabilidad: String,
    recomendaciones: [String]
  },
  metricasPorcentuales: {
    madurezDigital: Number,
    saludFinanciera: Number,
    eficienciaOperativa: Number,
    recursosHumanos: Number,
    marketingVentas: Number,
    innovacionDesarrollo: Number,
    experienciaCliente: Number,
    gestionRiesgos: Number
  },
  analisisMetricas: {
    madurezDigital: {
      interpretacion: String,
      recomendaciones: [String]
    },
    saludFinanciera: {
      interpretacion: String,
      recomendaciones: [String]
    },
    eficienciaOperativa: {
      interpretacion: String,
      recomendaciones: [String]
    },
    recursosHumanos: {
      interpretacion: String,
      recomendaciones: [String]
    },
    marketingVentas: {
      interpretacion: String,
      recomendaciones: [String]
    },
    innovacionDesarrollo: {
      interpretacion: String,
      recomendaciones: [String]
    },
    experienciaCliente: {
      interpretacion: String,
      recomendaciones: [String]
    },
    gestionRiesgos: {
      interpretacion: String,
      recomendaciones: [String]
    }
  },
  proximosPasos: {
    inmediatos: [String],
    cortoPlazo: [String],
    medianoPlazo: [String]
  }
});

const AnalysisResult = mongoose.models.AnalysisResult || mongoose.model('AnalysisResult', analysisResultSchema);

export default AnalysisResult; 