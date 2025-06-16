import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prediagnostico: {
    nombre: String,
    apellido: String,
    genero: String,
    nivelEstudios: String,
    tipoEmpresa: String,
    nombreEmpresaProyecto: String,
    email: String,
    telefono: Number,
    giroActividad: String,
    descripcionActividad: String,
    tieneEmpleados: String,
    numeroEmpleados: Number,
    ventasAnualesEstimadas: Number,
    mayorObstaculo: String,
    gestionDificultades: String,
    buenResultadoMetrica: String,
    objetivosAcciones: String,
    tipoAyuda: String,
    disponibleInvertir: String
  },
  diagnostic: {
    resumenGeneral: String,
    objetivosEmpresa: String,
    principalesDesafios: String,
    solucionesPropuestas: String
  },
  analysis: {
    resumenGeneral: String,
    areasMejora: [String],
    recomendaciones: [String],
    email: String
  },
  porcentajes: {
    digitalMaturity: Number,
    financialHealth: Number,
    operationalEfficiency: Number,
    marketPosition: Number,
    overallScore: Number
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

// Middleware para actualizar updatedAt antes de cada guardado
diagnosisSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Diagnosis = mongoose.models.Diagnosis || mongoose.model('Diagnosis', diagnosisSchema);

export default Diagnosis; 