import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

roleSchema.plugin(toJSON);

// Evitar OverwriteModelError
const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

export default Role;
