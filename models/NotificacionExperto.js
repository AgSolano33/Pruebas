import mongoose from "mongoose";

const notificacionExpertoSchema = new mongoose.Schema(
  {
    // Experto que recibe la notificación
    expertoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experto",
      required: true,
    },
    
    // Proyecto que generó la notificación
    proyectoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProyectoPublicado",
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
    industria: {
      type: String,
      required: true,
      trim: true,
    },
    descripcionProyecto: {
      type: String,
      required: true,
      trim: true,
    },
    categoriasServicioBuscado: {
      type: [String],
      required: true,
    },
    
    // Información del match
    puntuacionMatch: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    industriaMejor: {
      type: String,
      required: true,
      trim: true,
    },
    razonesMatch: {
      type: [String],
      default: [],
    },
    analisisMatch: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Estado de la notificación
    estado: {
      type: String,
      enum: ["pendiente", "vista", "aceptada", "rechazada"],
      default: "pendiente",
    },
    
    // Fechas
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
    fechaVista: {
      type: Date,
    },
    fechaRespuesta: {
      type: Date,
    },
    
    // Respuesta del experto (opcional)
    respuestaExperto: {
      mensaje: {
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
      disponibilidad: {
        type: String,
        enum: ["disponible", "parcialmente_disponible", "no_disponible"],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Índices para mejorar el rendimiento
notificacionExpertoSchema.index({ expertoId: 1, estado: 1 });
notificacionExpertoSchema.index({ proyectoId: 1 });
notificacionExpertoSchema.index({ fechaCreacion: -1 });
notificacionExpertoSchema.index({ puntuacionMatch: -1 });

// Middleware para actualizar fechaVista cuando se marca como vista
notificacionExpertoSchema.pre("save", function (next) {
  if (this.isModified("estado") && this.estado === "vista" && !this.fechaVista) {
    this.fechaVista = new Date();
  }
  if (this.isModified("estado") && (this.estado === "aceptada" || this.estado === "rechazada") && !this.fechaRespuesta) {
    this.fechaRespuesta = new Date();
  }
  next();
});

const NotificacionExperto = mongoose.models.NotificacionExperto || mongoose.model("NotificacionExperto", notificacionExpertoSchema);

export default NotificacionExperto; 