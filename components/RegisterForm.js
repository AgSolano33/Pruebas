"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function RegisterForm({ onSuccess, onCancel, onSwitchToLogin, userType: preSelectedUserType = null }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          // No enviar userType específico, se asignarán ambos por defecto
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("¡Usuario registrado exitosamente! Ahora puedes acceder tanto a la sección de Cliente como de Proveedor.");
        
        // Limpiar el formulario
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        // Si hay onSuccess callback, usarlo (para el modal del header)
        if (onSuccess) {
          onSuccess(email); // Pasar el email al callback
        } else {
          // Cambiar a modo login y pasar el email para pre-llenar
          if (onSwitchToLogin) {
            onSwitchToLogin(email); // Pasar el email al login
          }
        }
      } else {
        toast.error(data.error || "Error al registrar usuario");
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar formulario de registro
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
          <span>🔍💼</span>
          Cliente y Proveedor
        </div>
        <h3 className="text-lg font-semibold">Completa tu registro</h3>
        <p className="text-sm text-gray-600 mt-1">
          Tendrás acceso a ambas secciones: Cliente y Proveedor
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Tu nombre completo"
            required
          />
        </div>

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
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Repite tu contraseña"
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
              Registrando...
            </>
          ) : (
            "Registrarse"
          )}
        </button>

        {onSwitchToLogin && (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="btn btn-link w-full"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        )}

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
    </div>
  );
} 