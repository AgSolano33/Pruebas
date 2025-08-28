import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const infoEmpresaSchema = new mongoose.Schema(
  {
    name: { type: String },
    sector: { type: String },
    id_users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    ubicacion: { type: String },
    CP: { type: String },
    numEmpleados: { type: String },
    actividad: { type: String }, 
    descripcionActividad: { type: String },
    ventasAnuales: { type: String },
    antiguedad: { type: String },
    tipoNegocio: {type: String}
  },
  {
    timestamps: true, // createdAt y updatedAt automáticos
    toJSON: { virtuals: true },
  }
);

// plugin para convertir mongoose a JSON
infoEmpresaSchema.plugin(toJSON);

// eliminar modelo previo si existe
if (mongoose.models.infoEmpresa) {
  delete mongoose.models.infoEmpresa;
}

export default mongoose.model("infoEmpresa", infoEmpresaSchema, "infoEmpresa");
