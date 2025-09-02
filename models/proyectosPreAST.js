// /models/proyectoPreAST.js
import mongoose from "mongoose";

const proyectoPreASTSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    prediagnosticoId: { type: String, required: true, index: true },
    nombreProyecto: { type: String, required: true },
    resumenProyecto: { type: String, required: true },
    descripcionProyecto: { type: String, required: true },
  },
  { timestamps: true }
);

// 1 registro único por combinación (userId, prediagnosticoId, nombreProyecto)
proyectoPreASTSchema.index(
  { userId: 1, prediagnosticoId: 1, nombreProyecto: 1 },
  { unique: true }
);

export default mongoose.models.proyectoPreAST ||
  mongoose.model("proyectoPreAST", proyectoPreASTSchema, "proyectoPreAST");
