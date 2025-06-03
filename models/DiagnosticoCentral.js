import mongoose from 'mongoose';

const diagnosticoCentralSchema = new mongoose.Schema({
  // Sección 1: Información Personal
  informacionPersonal: {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true
    },
    apellido: {
      type: String,
      required: [true, 'El apellido es requerido'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      trim: true
    },
    puesto: {
      type: String,
      required: [true, 'El puesto es requerido'],
      enum: ['COO', 'CEO', 'CTO', 'Otro'],
      trim: true
    }
  },

  // Sección 2: Información de la Empresa
  informacionEmpresa: {
    sector: {
      type: String,
      required: [true, 'El sector es requerido'],
      trim: true
    },
    nombreEmpresa: {
      type: String,
      required: [true, 'El nombre de la empresa es requerido'],
      trim: true
    },
    ubicacion: {
      type: String,
      required: [true, 'La ubicación es requerida'],
      trim: true
    },
    codigoPostal: {
      type: String,
      required: [true, 'El código postal es requerido'],
      trim: true
    },
    descripcionActividad: {
      type: String,
      required: [true, 'La descripción de la actividad es requerida'],
      trim: true
    },
    tieneEmpleados: {
      type: Boolean,
      required: [true, 'Debe especificar si tiene empleados']
    },
    numeroEmpleados: {
      type: Number,
      required: function() {
        return this.informacionEmpresa.tieneEmpleados;
      },
      min: [1, 'El número de empleados debe ser mayor a 0']
    },
    ventasAnuales: {
      type: Number,
      required: [true, 'Las ventas anuales son requeridas'],
      min: [0, 'Las ventas anuales no pueden ser negativas']
    },
    antiguedad: {
      type: Number,
      required: [true, 'La antigüedad es requerida'],
      min: [0, 'La antigüedad no puede ser negativa']
    }
  },

  // Sección 3: Proyecto y Objetivos
  proyectoObjetivos: {
    descripcionProyecto: {
      type: String,
      required: [true, 'La descripción del proyecto es requerida'],
      trim: true
    },
    objetivoConsultoria: {
      type: String,
      required: [true, 'El objetivo de la consultoría es requerido'],
      trim: true
    },
    importanciaAreas: {
      gestionFinanciera: {
        type: Number,
        required: [true, 'La importancia de la gestión financiera es requerida'],
        min: 1,
        max: 5
      },
      eficienciaOperativa: {
        type: Number,
        required: [true, 'La importancia de la eficiencia operativa es requerida'],
        min: 1,
        max: 5
      },
      talentoHumano: {
        type: Number,
        required: [true, 'La importancia del talento humano es requerida'],
        min: 1,
        max: 5
      },
      ventasMarketing: {
        type: Number,
        required: [true, 'La importancia de ventas y marketing es requerida'],
        min: 1,
        max: 5
      },
      innovacion: {
        type: Number,
        required: [true, 'La importancia de la innovación es requerida'],
        min: 1,
        max: 5
      },
      digitalizacion: {
        type: Number,
        required: [true, 'La importancia de la digitalización es requerida'],
        min: 1,
        max: 5
      },
      experienciaCliente: {
        type: Number,
        required: [true, 'La importancia de la experiencia del cliente es requerida'],
        min: 1,
        max: 5
      },
      gestionRiesgos: {
        type: Number,
        required: [true, 'La importancia de la gestión de riesgos es requerida'],
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
        required: [true, 'La evaluación de la estrategia digital es requerida'],
        min: 1,
        max: 5
      },
      tecnologiasProcesos: {
        type: Number,
        required: [true, 'La evaluación de tecnologías en procesos es requerida'],
        min: 1,
        max: 5
      },
      habilidadesDigitales: {
        type: Number,
        required: [true, 'La evaluación de habilidades digitales es requerida'],
        min: 1,
        max: 5
      },
      analisisDatos: {
        type: Number,
        required: [true, 'La evaluación del análisis de datos es requerida'],
        min: 1,
        max: 5
      },
      tendenciasTecnologicas: {
        type: Number,
        required: [true, 'La evaluación de tendencias tecnológicas es requerida'],
        min: 1,
        max: 5
      }
    },
    saludFinanciera: {
      flujoEfectivo: {
        type: Number,
        required: [true, 'La evaluación del flujo de efectivo es requerida'],
        min: 1,
        max: 5
      },
      margenesRentabilidad: {
        type: Number,
        required: [true, 'La evaluación de márgenes de rentabilidad es requerida'],
        min: 1,
        max: 5
      },
      gestionCostos: {
        type: Number,
        required: [true, 'La evaluación de gestión de costos es requerida'],
        min: 1,
        max: 5
      },
      accesoFinanciamiento: {
        type: Number,
        required: [true, 'La evaluación de acceso a financiamiento es requerida'],
        min: 1,
        max: 5
      },
      presupuesto: {
        type: Number,
        required: [true, 'La evaluación del presupuesto es requerida'],
        min: 1,
        max: 5
      }
    },
    eficienciaOperativa: {
      automatizacion: {
        type: Number,
        required: [true, 'La evaluación de automatización es requerida'],
        min: 1,
        max: 5
      },
      flujoOperaciones: {
        type: Number,
        required: [true, 'La evaluación del flujo de operaciones es requerida'],
        min: 1,
        max: 5
      },
      calidadProductos: {
        type: Number,
        required: [true, 'La evaluación de calidad de productos es requerida'],
        min: 1,
        max: 5
      },
      mejoraContinua: {
        type: Number,
        required: [true, 'La evaluación de mejora continua es requerida'],
        min: 1,
        max: 5
      },
      herramientasAutomatizacion: {
        type: Number,
        required: [true, 'La evaluación de herramientas de automatización es requerida'],
        min: 1,
        max: 5
      }
    },
    recursosHumanos: {
      rotacionPersonal: {
        type: Number,
        required: [true, 'La evaluación de rotación de personal es requerida'],
        min: 1,
        max: 5
      },
      formacionDesarrollo: {
        type: Number,
        required: [true, 'La evaluación de formación y desarrollo es requerida'],
        min: 1,
        max: 5
      },
      climaLaboral: {
        type: Number,
        required: [true, 'La evaluación del clima laboral es requerida'],
        min: 1,
        max: 5
      },
      alineacionObjetivos: {
        type: Number,
        required: [true, 'La evaluación de alineación de objetivos es requerida'],
        min: 1,
        max: 5
      },
      evaluacionDesempeno: {
        type: Number,
        required: [true, 'La evaluación del desempeño es requerida'],
        min: 1,
        max: 5
      }
    },
    marketingVentas: {
      estrategiaMarketing: {
        type: Number,
        required: [true, 'La evaluación de la estrategia de marketing es requerida'],
        min: 1,
        max: 5
      },
      conocimientoClientes: {
        type: Number,
        required: [true, 'La evaluación del conocimiento de clientes es requerida'],
        min: 1,
        max: 5
      },
      canalesVenta: {
        type: Number,
        required: [true, 'La evaluación de canales de venta es requerida'],
        min: 1,
        max: 5
      },
      diferenciacionMercado: {
        type: Number,
        required: [true, 'La evaluación de diferenciación en el mercado es requerida'],
        min: 1,
        max: 5
      },
      herramientasDigitales: {
        type: Number,
        required: [true, 'La evaluación de herramientas digitales es requerida'],
        min: 1,
        max: 5
      }
    },
    innovacionDesarrollo: {
      nuevosProductos: {
        type: Number,
        required: [true, 'La evaluación de nuevos productos es requerida'],
        min: 1,
        max: 5
      },
      culturaInnovacion: {
        type: Number,
        required: [true, 'La evaluación de la cultura de innovación es requerida'],
        min: 1,
        max: 5
      },
      investigacionDesarrollo: {
        type: Number,
        required: [true, 'La evaluación de investigación y desarrollo es requerida'],
        min: 1,
        max: 5
      },
      adaptacionMercado: {
        type: Number,
        required: [true, 'La evaluación de adaptación al mercado es requerida'],
        min: 1,
        max: 5
      },
      colaboracionTerceros: {
        type: Number,
        required: [true, 'La evaluación de colaboración con terceros es requerida'],
        min: 1,
        max: 5
      }
    },
    experienciaCliente: {
      feedbackClientes: {
        type: Number,
        required: [true, 'La evaluación del feedback de clientes es requerida'],
        min: 1,
        max: 5
      },
      satisfaccionServicio: {
        type: Number,
        required: [true, 'La evaluación de satisfacción del servicio es requerida'],
        min: 1,
        max: 5
      },
      personalizacion: {
        type: Number,
        required: [true, 'La evaluación de personalización es requerida'],
        min: 1,
        max: 5
      },
      retencionClientes: {
        type: Number,
        required: [true, 'La evaluación de retención de clientes es requerida'],
        min: 1,
        max: 5
      },
      herramientasCRM: {
        type: Number,
        required: [true, 'La evaluación de herramientas CRM es requerida'],
        min: 1,
        max: 5
      }
    },
    gestionRiesgos: {
      identificacionRiesgos: {
        type: Number,
        required: [true, 'La evaluación de identificación de riesgos es requerida'],
        min: 1,
        max: 5
      },
      cumplimientoNormativo: {
        type: Number,
        required: [true, 'La evaluación de cumplimiento normativo es requerida'],
        min: 1,
        max: 5
      },
      documentacion: {
        type: Number,
        required: [true, 'La evaluación de documentación es requerida'],
        min: 1,
        max: 5
      },
      auditorias: {
        type: Number,
        required: [true, 'La evaluación de auditorías es requerida'],
        min: 1,
        max: 5
      },
      capacitacionCumplimiento: {
        type: Number,
        required: [true, 'La evaluación de capacitación en cumplimiento es requerida'],
        min: 1,
        max: 5
      }
    }
  },

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar updatedAt
diagnosticoCentralSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const DiagnosticoCentral = mongoose.models.DiagnosticoCentral || mongoose.model('DiagnosticoCentral', diagnosticoCentralSchema);

export default DiagnosticoCentral; 