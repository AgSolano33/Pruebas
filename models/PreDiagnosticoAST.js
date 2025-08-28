import mongoose from "mongoose";
// Si ya tienes un plugin toJSON, descomenta y ajusta la ruta:
// import toJSON from "./plugins/toJSON";

const { Schema } = mongoose;

const prediagnosticoAstSchema = new Schema(
  {
    userId: { type: String, index: true, required: true },
    threadId: { type: String, default: null },
    runId: { type: String, default: null },
    resultado: { type: Schema.Types.Mixed, required: true }, // ← JSON arbitrario
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Si usas tu plugin, descomenta:
// prediagnosticoAstSchema.plugin(toJSON);

// Hot-reload safe
export default mongoose.models.PrediagnosticoAST
  || mongoose.model("PrediagnosticoAST", prediagnosticoAstSchema, "preDiagnosticoAST");