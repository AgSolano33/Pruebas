import mongoose from 'mongoose';

const diagnosticoCentralSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  // Sección 1: Información Personal
  informacionPersonal: {
    nombre: {
      type: String,
      required: true
    },
    apellido: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    telefono: {
      type: String,
      required: true
    },
    puesto: {
      type: String,
      required: true,
      enum: ['COO', 'CEO', 'CTO', 'supervisor', 'Otro']
    }
  },

  // Sección 2: Información de la Empresa
  informacionEmpresa: {
    sector: {
      type: String,
      required: true
    },
    nombreEmpresa: {
      type: String,
      required: true
    },
    ubicacion: {
      type: String,
      required: true
    },
    codigoPostal: {
      type: String,
      required: true
    },
    ciudad: {
      type: String,
      required: true
    },
    descripcionActividad: {
      type: String,
      required: true
    },
    tieneEmpleados: {
      type: Boolean,
      default: false
    },
    numeroEmpleados: {
      type: Number,
      required: function() {
        return this.tieneEmpleados;
      }
    },
    ventasAnuales: {
      type: Number,
      required: true
    },
    antiguedad: {
      type: Number,
      required: true
    }
  },

  // Sección 3: Proyecto y Objetivos
  proyectoObjetivos: {
    descripcionProyecto: {
      type: String,
      required: true
    },
    objetivoConsultoria: {
      type: String,
      required: true
    },
    importanciaAreas: {
      gestionFinanciera: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      eficienciaOperativa: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      talentoHumano: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      ventasMarketing: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      innovacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      digitalizacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      experienciaCliente: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      gestionRiesgos: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    }
  },

  // Sección 4: Evaluación de Áreas
  evaluacionAreas: {
    madurezDigital: {
      estrategiaDigital: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      tecnologiasProcesos: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      habilidadesDigitales: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      analisisDatos: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      tendenciasTecnologicas: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    },
    saludFinanciera: {
      flujoEfectivo: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      margenesRentabilidad: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      gestionCostos: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      accesoFinanciamiento: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      presupuesto: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    },
    eficienciaOperativa: {
      automatizacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      flujoOperaciones: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      calidadProductos: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      mejoraContinua: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      herramientasAutomatizacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    },
    recursosHumanos: {
      rotacionPersonal: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      formacionDesarrollo: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      climaLaboral: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      alineacionObjetivos: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      evaluacionDesempeno: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    },
    marketingVentas: {
      estrategiaMarketing: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      conocimientoClientes: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      canalesVenta: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      diferenciacionMercado: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      herramientasDigitales: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    },
    innovacionDesarrollo: {
      nuevosProductos: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      culturaInnovacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      investigacionDesarrollo: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      adaptacionMercado: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      colaboracionTerceros: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    },
    experienciaCliente: {
      feedbackClientes: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      satisfaccionServicio: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      personalizacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      retencionClientes: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      herramientasCRM: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    },
    gestionRiesgos: {
      identificacionRiesgos: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      cumplimientoNormativo: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      documentacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      auditorias: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      capacitacionCumplimiento: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    }
  },

  // Metadata
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['completado', 'en_proceso', 'pendiente'],
    default: 'completado'
  }
}, {
  timestamps: true
});

// Middleware para actualizar updatedAt
diagnosticoCentralSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const DiagnosticoCentral = mongoose.models.DiagnosticoCentral || mongoose.model('DiagnosticoCentral', diagnosticoCentralSchema);

export default DiagnosticoCentral; 