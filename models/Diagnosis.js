import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  informacionpersonal: {
    nombre: {
      type: String,
      required: true
    },
    apellido: {
      type: String,
      required: true
    },
    telefono: String
  },
  informacionempresa: {
    nombreEmpresaProyecto: {
      type: String,
      required: true
    },
    tipoEmpresa: String,
    giroActividad: String,
    tieneEmpleados: String,
    numeroEmpleados: Number,
    ventasAnualesEstimadas: Number,
    descripcionActividad: String
  },
  mayorObstaculo: String,
  objetivosAcciones: String,
  analysis: {
    summary: String,
    recommendations: [String],
    nextSteps: [String],
    metrics: {
      type: Map,
      of: Number
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  evaluacionareas: {
    type: Map,
    of: Object // Asumiendo que es un objeto flexible para las áreas
  },
  proyectoobjetivo: {
    descripcion: String,
    objetivo: String
  }
}, { collection: 'diagnosticocentrals' });

const Diagnosis = mongoose.models.Diagnosis || mongoose.model('Diagnosis', diagnosisSchema);

export default Diagnosis; 