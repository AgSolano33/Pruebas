import mongoose from "mongoose";

const proyectoPreASTSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    prediagnosticoId: { type: String, required: true, index: true },
    nombreProyecto: { type: String, required: true },
    resumenProyecto: { type: String, required: true },
    descripcionProyecto: { type: String, required: true },
    estado: {
      type: String,
      enum: ["publicado", "en_espera", "en_proceso", "completado", "cancelado", "aprobacion"],
      default: "en_espera",
      index: true,
    },
  },
  { timestamps: true }
);

// Evita duplicados por usuario + prediagnóstico + nombre
proyectoPreASTSchema.index(
  { userId: 1, prediagnosticoId: 1, nombreProyecto: 1 },
  { unique: true }
);

export default mongoose.models.proyectoPreAST ||
  mongoose.model("proyectoPreAST", proyectoPreASTSchema, "proyectoPreAST");
