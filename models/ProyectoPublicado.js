import mongoose from "mongoose";

const proyectoPublicadoSchema = new mongoose.Schema(
  {
    // Información del usuario que publica
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
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
    
    // Análisis de ChatGPT
    analisisOpenAI: {
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
      razones: {
        type: [String],
        default: [],
      },
    },
    
    // Estado del proyecto
    estado: {
      type: String,
      enum: ["publicado", "en_espera", "en_proceso", "completado", "cancelado", "aprobacion"],
      default: "publicado",
    },
    
    // Campo para manejar activo/inactivo
    activo: {
      type: Boolean,
      default: true,
    },
    
    // Información adicional
    descripcion: {
      type: String,
      trim: true,
    },
    presupuesto: {
      type: String,
      trim: true,
    },
    plazo: {
      type: String,
      trim: true,
    },
    
    // Fechas
    fechaPublicacion: {
      type: Date,
      default: Date.now,
    },
    fechaActualizacion: {
      type: Date,
      default: Date.now,
    },
    
    // Estadísticas
    expertosInteresados: {
      type: Number,
      default: 0,
    },
    matchesGenerados: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para actualizar fechaActualizacion
proyectoPublicadoSchema.pre("save", function (next) {
  this.fechaActualizacion = new Date();
  next();
});

// Índices para mejorar el rendimiento de las consultas
proyectoPublicadoSchema.index({ userId: 1 });
proyectoPublicadoSchema.index({ nombreEmpresa: 1 });
proyectoPublicadoSchema.index({ industria: 1 });
proyectoPublicadoSchema.index({ estado: 1 });
proyectoPublicadoSchema.index({ fechaPublicacion: -1 });

const ProyectoPublicado = mongoose.models.ProyectoPublicado || mongoose.model("ProyectoPublicado", proyectoPublicadoSchema);

export default ProyectoPublicado; 