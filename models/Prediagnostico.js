import mongoose from "mongoose";

const preDiagnosticoSchema = new mongoose.Schema(
  {
    // Usuario que responde el prediagnóstico
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Preguntas del prediagnóstico
    preguntaObstaculo: {
      type: String,
      trim: true,
      default: "",
    },
    preguntaIntentos: {
      type: String,
      trim: true,
      default: "",
    },
    preguntaSeñales: {
      type: String,
      trim: true,
      default: "",
    },
    preguntasKpis: {
      type: String,
      trim: true,
      default: "",
    },
    preguntaTipoAyuda: {
      type: String,
      trim: true,
      default: "",
    },
    preguntaInversion: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, 
  }
);

// Middleware para actualizar fechaActualizacion
preDiagnosticoSchema.pre("save", function (next) {
  this.fechaActualizacion = new Date();
  next();
});

// Índices
preDiagnosticoSchema.index({ userId: 1 });

const PreDiagnostico = mongoose.models.PreDiagnostico || mongoose.model("PreDiagnostico", preDiagnosticoSchema, "preDiagnostico");

export default PreDiagnostico;


