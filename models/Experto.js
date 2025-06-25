import mongoose from "mongoose";

const expertoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    semblanza: {
      type: String,
      required: true,
      trim: true,
    },
    industrias: {
      type: [String],
      required: true,
      validate: {
        validator: function(v) {
          return v.length > 0 && v.length <= 3;
        },
        message: 'Debes seleccionar al menos 1 industria y máximo 3'
      },
      enum: [
        "Industrial Automation",
        "Agriculture industry",
        "Software and Tech Development",
        "Biotechnology and Life Sciences",
        "Food & Beverages",
        "ClimateTech & Sustainability",
        "Creative Industry & arts",
        "Beauty and personal care",
        "E-commerce",
        "Health Services"
      ],
    },
    categorias: {
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
    estado: {
      type: String,
      enum: ["pendiente", "aprobado", "rechazado"],
      default: "pendiente",
    },
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
expertoSchema.pre("save", function (next) {
  this.fechaActualizacion = new Date();
  next();
});

// Índices para mejorar el rendimiento de las consultas
expertoSchema.index({ userId: 1 });
expertoSchema.index({ industrias: 1 });
expertoSchema.index({ estado: 1 });
expertoSchema.index({ fechaCreacion: -1 });

const Experto = mongoose.models.Experto || mongoose.model("Experto", expertoSchema);

export default Experto; 