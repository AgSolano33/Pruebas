import mongoose from 'mongoose';

const AnalysisResultSchema = new mongoose.Schema({
  diagnosisEmail: {
    type: String,
    required: true,
    unique: true,
    ref: 'Diagnosis' // Referencia al modelo Diagnosis existente por email
  },
  metrics: {
    type: Map, // Para almacenar las métricas como { "Potencial de Mercado": 85, ... }
    of: Number
  },
  summary: {
    type: String,
    required: true
  },
  recommendations: {
    type: [String]
  },
  nextSteps: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.AnalysisResult || mongoose.model('AnalysisResult', AnalysisResultSchema); 