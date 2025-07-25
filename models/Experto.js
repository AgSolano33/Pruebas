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
    email: {
      type: String,
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    ubicacion: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
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
          return Array.isArray(v) && v.length > 0 && v.length <= 5;
        },
        message: 'Debes seleccionar al menos 1 industria y máximo 5'
      },
      enum: [
        "Aerospace",
        "Automotive",
        "Semiconductors",
        "Circuit Boards Assembly",
        "Medical Devices",
        "Industrial Automation",
        "Logistics, freight and transport",
        "Agriculture industry",
        "Food & Beverages",
        "Health Services",
        "Pharmacy",
        "Beauty and personal care",
        "Mining & Extraction",
        "Metallurgy",
        "Metal mechanic",
        "E-commerce",
        "Digital marketing & branding",
        "ClimateTech & Sustainability",
        "Construction & Infrastructure",
        "Entrepreneurship & Innovation",
        "Retail",
        "Politics & Public Policy",
        "Education & STEM",
        "Safety, Security & Defense",
        "TI",
        "Software and Tech Development",
        "Artificial Intelligence and Big Data",
        "Process automation",
        "Tourism and hospitality",
        "Cultural Heritage Preservation",
        "Creative Industry & arts",
        "Livestock & fishing",
        "Oil and gas",
        "Toys and Entertainment",
        "Textile",
        "Plastics and Polymers",
        "Banking and Financial Services",
        "Insurance and Reinsurance",
        "Non-Profit Organizations (NGOs)",
        "Biotechnology and Life Sciences"
      ],
    },
    categorias: {
      type: [String],
      default: [],
    },
    gradoExperiencia: {
      type: String,
      required: true,
      enum: ["junior", "mid-level", "senior", "expert"],
    },
    experienciaAnos: {
      type: String,
      trim: true,
    },
    habilidades: {
      type: [String],
      default: [],
    },
    especialidades: {
      type: [String],
      default: [],
    },
    experienciaProfesional: {
      type: String,
      trim: true,
    },
    proyectosDestacados: {
      type: String,
      trim: true,
    },
    serviciosPropuestos: {
      type: String,
      trim: true,
    },
    tarifas: {
      type: String,
      trim: true,
    },
    certificaciones: {
      type: [String],
      default: [],
    },
    educacion: {
      type: String,
      trim: true,
    },
    disponibilidad: {
      type: String,
      enum: ["full-time", "part-time", "freelance"],
      default: "part-time",
    },
    horariosDisponibles: {
      type: String,
      trim: true,
    },
    tiposProyectos: {
      type: [String],
      default: [],
    },
    tamanosProyectos: {
      type: [String],
      default: [],
    },
    modalidadTrabajo: {
      type: [String],
      default: [],
    },
    // Nuevos campos para servicios con categorización IA
    servicios: [{
      nombre: {
        type: String,
        required: true,
        trim: true,
      },
      descripcion: {
        type: String,
        required: true,
        trim: true,
      },
      precio: {
        type: Number,
        required: true,
      },
      moneda: {
        type: String,
        enum: ["USD", "EUR", "MXN", "COP", "ARS", "CLP", "PEN", "BRL"],
        default: "USD",
      },
      tipoPrecio: {
        type: String,
        enum: ["por_hora", "por_proyecto", "por_mes"],
        required: true,
      },
      tiempoEstimado: {
        type: String,
        trim: true,
      },
      industriasServicio: {
        type: [String],
        default: [],
      },
      categoriasServicio: {
        type: [String],
        default: [],
      },
      objetivosCliente: {
        type: [String],
        default: [],
      },
      // Campos categorizados por IA
      categorizacionIA: {
        industriasRecomendadas: {
          type: [String],
          default: [],
        },
        serviciosRelacionados: {
          type: [String],
          default: [],
        },
        objetivosCompatibles: {
          type: [String],
          default: [],
        },
        nivelExperienciaRequerido: {
          type: String,
          enum: ["junior", "mid-level", "senior", "expert"],
        },
        palabrasClave: {
          type: [String],
          default: [],
        },
        scoreConfianza: {
          type: Number,
          min: 0,
          max: 1,
          default: 0,
        },
      },
      estado: {
        type: String,
        enum: ["activo", "inactivo", "pendiente_revision"],
        default: "activo",
      },
      fechaCreacion: {
        type: Date,
        default: Date.now,
      },
      fechaActualizacion: {
        type: Date,
        default: Date.now,
      },
    }],
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
expertoSchema.index({ "servicios.estado": 1 });
expertoSchema.index({ "servicios.categorizacionIA.industriasRecomendadas": 1 });

const Experto = mongoose.models.Experto || mongoose.model("Experto", expertoSchema);

export default Experto; 