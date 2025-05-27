import mongoose from "mongoose";

const diagnosticoEmpresarialSchema = new mongoose.Schema(
  {
    nombreEmpresa: {
      type: String,
      required: true,
    },
    tipoEmpresa: {
      type: String,
      enum: ["empresa", "emprendedor"],
      required: true,
    },
    nombreContacto: {
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
    numeroEmpleados: {
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
  },
  {
    timestamps: true,
  }
);

const DiagnosticoEmpresarial =
  mongoose.models.DiagnosticoEmpresarial ||
  mongoose.model("DiagnosticoEmpresarial", diagnosticoEmpresarialSchema);

export default DiagnosticoEmpresarial; 