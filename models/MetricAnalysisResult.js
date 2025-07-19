import mongoose from 'mongoose';

const metricAnalysisResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metricKey: {
    type: String,
    required: true
  },
  metricTitle: {
    type: String,
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
  descripcionModulo: {
    objetivo: String,
    alcance: String,
    componentes: [String]
  },
  conclusion: {
    nivel: String,
    fortalezas: [String],
    areasMejora: [String],
    impactoGeneral: String
  },
  interpretacion: String,
  recomendaciones: [String],
  valorPorcentual: Number,
  proyectoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProyectoPublicado',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const MetricAnalysisResult = mongoose.models.MetricAnalysisResult || mongoose.model('MetricAnalysisResult', metricAnalysisResultSchema);

export default MetricAnalysisResult; 