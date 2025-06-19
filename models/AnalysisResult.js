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
      descripcionModulo: {
        objetivo: String,
        alcance: String,
        componentes: [String]
      },
      conclusionBasadaPuntuacion: {
        nivel: String,
        fortalezas: [String],
        areasMejora: [String],
        impactoGeneral: String
      },
      interpretacionCompleta: {
        analisisDetallado: String,
        tendencias: [String],
        factoresClave: [String],
        impactoEstrategico: String
      },
      interpretacion: String,
      recomendaciones: [String]
    },
    saludFinanciera: {
      descripcionModulo: {
        objetivo: String,
        alcance: String,
        componentes: [String]
      },
      conclusionBasadaPuntuacion: {
        nivel: String,
        fortalezas: [String],
        areasMejora: [String],
        impactoGeneral: String
      },
      interpretacionCompleta: {
        analisisDetallado: String,
        tendencias: [String],
        factoresClave: [String],
        impactoEstrategico: String
      },
      interpretacion: String,
      recomendaciones: [String]
    },
    eficienciaOperativa: {
      descripcionModulo: {
        objetivo: String,
        alcance: String,
        componentes: [String]
      },
      conclusionBasadaPuntuacion: {
        nivel: String,
        fortalezas: [String],
        areasMejora: [String],
        impactoGeneral: String
      },
      interpretacionCompleta: {
        analisisDetallado: String,
        tendencias: [String],
        factoresClave: [String],
        impactoEstrategico: String
      },
      interpretacion: String,
      recomendaciones: [String]
    },
    recursosHumanos: {
      descripcionModulo: {
        objetivo: String,
        alcance: String,
        componentes: [String]
      },
      conclusionBasadaPuntuacion: {
        nivel: String,
        fortalezas: [String],
        areasMejora: [String],
        impactoGeneral: String
      },
      interpretacionCompleta: {
        analisisDetallado: String,
        tendencias: [String],
        factoresClave: [String],
        impactoEstrategico: String
      },
      interpretacion: String,
      recomendaciones: [String]
    },
    marketingVentas: {
      descripcionModulo: {
        objetivo: String,
        alcance: String,
        componentes: [String]
      },
      conclusionBasadaPuntuacion: {
        nivel: String,
        fortalezas: [String],
        areasMejora: [String],
        impactoGeneral: String
      },
      interpretacionCompleta: {
        analisisDetallado: String,
        tendencias: [String],
        factoresClave: [String],
        impactoEstrategico: String
      },
      interpretacion: String,
      recomendaciones: [String]
    },
    innovacionDesarrollo: {
      descripcionModulo: {
        objetivo: String,
        alcance: String,
        componentes: [String]
      },
      conclusionBasadaPuntuacion: {
        nivel: String,
        fortalezas: [String],
        areasMejora: [String],
        impactoGeneral: String
      },
      interpretacionCompleta: {
        analisisDetallado: String,
        tendencias: [String],
        factoresClave: [String],
        impactoEstrategico: String
      },
      interpretacion: String,
      recomendaciones: [String]
    },
    experienciaCliente: {
      descripcionModulo: {
        objetivo: String,
        alcance: String,
        componentes: [String]
      },
      conclusionBasadaPuntuacion: {
        nivel: String,
        fortalezas: [String],
        areasMejora: [String],
        impactoGeneral: String
      },
      interpretacionCompleta: {
        analisisDetallado: String,
        tendencias: [String],
        factoresClave: [String],
        impactoEstrategico: String
      },
      interpretacion: String,
      recomendaciones: [String]
    },
    gestionRiesgos: {
      descripcionModulo: {
        objetivo: String,
        alcance: String,
        componentes: [String]
      },
      conclusionBasadaPuntuacion: {
        nivel: String,
        fortalezas: [String],
        areasMejora: [String],
        impactoGeneral: String
      },
      interpretacionCompleta: {
        analisisDetallado: String,
        tendencias: [String],
        factoresClave: [String],
        impactoEstrategico: String
      },
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