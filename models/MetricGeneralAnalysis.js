import mongoose from 'mongoose';

const metricGeneralAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fechaAnalisis: {
    type: Date,
    default: Date.now
  },
  empresa: {
    nombre: String,
    sector: String,
    ubicacion: String
  },
  analisisGeneral: {
    resumenEjecutivo: String,
    puntuacionGeneral: Number,
    patronesIdentificados: [String],
    prioridadesEstrategicas: [String]
  },
  conclusionesPorArea: {
    eficienciaOperativa: {
      interpretacion: String,
      conclusionGeneral: String,
      fortalezas: [String],
      areasMejora: [String]
    },
    experienciaCliente: {
      interpretacion: String,
      conclusionGeneral: String,
      fortalezas: [String],
      areasMejora: [String]
    },
    innovacionDesarrollo: {
      interpretacion: String,
      conclusionGeneral: String,
      fortalezas: [String],
      areasMejora: [String]
    },
    madurezDigital: {
      interpretacion: String,
      conclusionGeneral: String,
      fortalezas: [String],
      areasMejora: [String]
    },
    marketingVentas: {
      interpretacion: String,
      conclusionGeneral: String,
      fortalezas: [String],
      areasMejora: [String]
    },
    recursosHumanos: {
      interpretacion: String,
      conclusionGeneral: String,
      fortalezas: [String],
      areasMejora: [String]
    },
    saludFinanciera: {
      interpretacion: String,
      conclusionGeneral: String,
      fortalezas: [String],
      areasMejora: [String]
    }
  },
  proyectosIntegrales: [{
    nombreProyecto: String,
    descripcionProyecto: String,
    metricasAbarcadas: [String],
    estimacionMejora: Number,
    areasInvolucradas: [String],
    expertosRequeridos: [String],
    serviciosNecesarios: [String],
    impactoEstrategico: String,
    prioridad: String,
    proyectoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProyectoPublicado'
    }
  }],
  expertosRecomendados: [{
    perfilExperto: String,
    especialidades: [String],
    metricasQueResuelve: [String],
    valorAgregado: String,
    tipoServicio: String
  }],
  serviciosIntegrales: [{
    nombreServicio: String,
    descripcionServicio: String,
    metricasQueAborda: [String],
    beneficiosEsperados: [String],
    duracionEstimada: String,
    inversionEstimada: String
  }],
  recomendacionesEstrategicas: [String],
  metricasAnalizadas: [{
    metricKey: String,
    metricTitle: String,
    valorPorcentual: Number,
    fechaAnalisis: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
});

// Middleware para actualizar updatedAt
metricGeneralAnalysisSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const MetricGeneralAnalysis = mongoose.models.MetricGeneralAnalysis || mongoose.model('MetricGeneralAnalysis', metricGeneralAnalysisSchema);

export default MetricGeneralAnalysis; 