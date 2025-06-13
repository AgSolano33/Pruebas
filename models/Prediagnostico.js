import mongoose from "mongoose";

const prediagnosticoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    genero: {
      type: String,
      required: true,
    },
    nivelEstudios: {
      type: String,
      required: true,
    },
    tipoEmpresa: {
      type: String,
      required: true,
    },
    nombreEmpresaProyecto: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    telefono: {
      type: Number,
      required: true,
    },
    giroActividad: {
      type: String,
      required: true,
    },
    descripcionActividad: {
      type: String,
      required: true,
    },
    tieneEmpleados: {
      type: String,
      required: true,
      enum: ["si", "no"],
    },
    numeroEmpleados: {
      type: Number,
      required: function () {
        return this.tieneEmpleados === "si";
      },
    },
    ventasAnualesEstimadas: {
      type: Number,
      required: true,
    },
    mayorObstaculo: {
      type: String,
      required: true,
    },
    gestionDificultades: {
      type: String,
      required: true,
    },
    buenResultadoMetrica: {
      type: String,
      required: true,
    },
    objetivosAcciones: {
      type: String,
      required: true,
    },
    tipoAyuda: {
      type: String,
      required: true,
    },
    disponibleInvertir: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Prediagnostico = mongoose.models.Prediagnostico || mongoose.model("Prediagnostico", prediagnosticoSchema);

export default Prediagnostico; 