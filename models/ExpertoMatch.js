import mongoose from "mongoose";

const expertoMatchSchema = new mongoose.Schema(
  {
    // Información del proyecto
    nombreEmpresa: {
      type: String,
      required: true,
      trim: true,
    },
    nombreProyecto: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Información del análisis del proyecto
    industria: {
      type: String,
      required: true,
      trim: true,
    },
    categoriasServicioBuscado: {
      type: [String],
      required: true,
    },
    objetivoEmpresa: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Información del experto (sin nombre)
    expertoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experto",
      required: true,
    },
    semblanza: {
      type: String,
      required: true,
      trim: true,
    },
    industriasExperto: {
      type: [String],
      required: true,
    },
    categoriasExperto: {
      type: String,
      required: true,
      trim: true,
    },
    gradoExperiencia: {
      type: String,
      required: true,
      enum: ["junior", "mid-level", "senior", "expert"],
    },
    experienciaProfesional: {
      type: String,
      required: true,
      trim: true,
    },
    serviciosPropuestos: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Información del match
    match: {
      type: String,
      required: true,
      trim: true,
    },
    industriaMejor: {
      type: String,
      required: true,
      trim: true,
    },
    puntuacionMatch: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    
    // Estado del match
    estado: {
      type: String,
      enum: ["pendiente", "aceptado", "rechazado", "contactado"],
      default: "pendiente",
    },
    
    // Fechas
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
    fechaActualizacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para actualizar fechaActualizacion
expertoMatchSchema.pre("save", function (next) {
  this.fechaActualizacion = new Date();
  next();
});

// Índices para mejorar el rendimiento de las consultas
expertoMatchSchema.index({ expertoId: 1 });
expertoMatchSchema.index({ nombreEmpresa: 1 });
expertoMatchSchema.index({ industria: 1 });
expertoMatchSchema.index({ estado: 1 });
expertoMatchSchema.index({ puntuacionMatch: -1 });
expertoMatchSchema.index({ fechaCreacion: -1 });

const ExpertoMatch = mongoose.models.ExpertoMatch || mongoose.model("ExpertoMatch", expertoMatchSchema);

export default ExpertoMatch; 