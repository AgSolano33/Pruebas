import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// USER SCHEMA
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    studies: {
      type: String,
    },
    password: {
      type: String,
      private: true, // No se incluye en las respuestas JSON
      required: false, // Opcional para usuarios de Google
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role", // Relación con colección Roles
      },
    ],
    image: {
      type: String,
    },
    hasAccess: {
      type: Boolean,
      default: false,
    },
    verified: {
  type: Boolean,
  default: false
},
verificationToken: {
  type: String
}

  },
  {
    timestamps: true, // Esto ya agrega createdAt y updatedAt
    toJSON: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

// Clear any existing model to force recompilation with new schema
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model("User", userSchema);
