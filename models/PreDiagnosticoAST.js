// models/PrediagnosticoAST.js
import mongoose from "mongoose";

const PrediagnosticoASTSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    respuesta: { type: Object, required: true }, // aquí guardas el JSON completo del asistente
  },
  { timestamps: true }
);

export default mongoose.models.PrediagnosticoAST ||
  mongoose.model("PrediagnosticoAST", PrediagnosticoASTSchema);
