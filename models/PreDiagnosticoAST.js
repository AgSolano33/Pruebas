// models/PrediagnosticoAST.js
import mongoose from "mongoose";

const PrediagnosticoASTSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true},
    prediagnosticoId: { type: String, required: true, index: true }, // ← hazlo requerido
    resultado: { type: Object, required: true },
  },
  { timestamps: true }
);

// 1 AST por (userId, prediagnosticoId)
PrediagnosticoASTSchema.index(
  { userId: 1, prediagnosticoId: 1 },
  { unique: true }
);

export default mongoose.models.PrediagnosticoAST ||
  mongoose.model("PrediagnosticoAST", PrediagnosticoASTSchema);
