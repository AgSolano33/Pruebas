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
      private: true,
    },
    password: {
      type: String,
      private: true, // No se incluye en las respuestas JSON
      required: false, // No requerido porque usuarios de Google no tienen contraseña
    },
    userType: {
      type: [String],
      validate: {
        validator: function(v) {
          return v.every(type => ["provider", "client"].includes(type));
        },
        message: 'userType debe contener solo "provider" y/o "client"'
      },
      default: ["client", "provider"], // Por defecto, todos los usuarios tienen ambos tipos
      required: false,
    },
    image: {
      type: String,
    },
    // Used in the Stripe webhook to identify the user in Stripe and later create Customer Portal or prefill user credit card details
    customerId: {
      type: String,
      validate(value) {
        return value.includes("cus_");
      },
    },
    // Used in the Stripe webhook. should match a plan in config.js file.
    priceId: {
      type: String,
      validate(value) {
        return value.includes("price_");
      },
    },
    // Used to determine if the user has access to the product—it's turn on/off by the Stripe webhook
    hasAccess: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
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
