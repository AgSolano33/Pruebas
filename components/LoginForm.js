"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginForm({ onSuccess, onCancel, prefillEmail = "", userType = null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Pre-llenar email si se proporciona
  useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [prefillEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email o contraseña incorrectos");
      } else {
        toast.success("¡Inicio de sesión exitoso!");
        if (onSuccess) {
          onSuccess();
        } else {
          // Si hay userType, actualizar el usuario
          if (userType) {
            try {
              await fetch("/api/update-user-type", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userType }),
              });
            } catch (error) {
              console.error("Error updating user type:", error);
            }
          }
          router.push("/dashboard");
        }
      }
    } catch (error) {
      toast.error("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full"
          placeholder="tu@email.com"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Tu contraseña"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full"
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Iniciando sesión...
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </button>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost w-full"
        >
          Cancelar
        </button>
      )}
    </form>
  );
} 