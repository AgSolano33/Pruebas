/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import config from "@/config";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

// A simple button to sign in with our providers (Google & Magic Links).
// It automatically redirects user to callbackUrl (config.auth.callbackUrl) after login, which is normally a private page for users to manage their accounts.
// If the user is already logged in, it will show their profile picture & redirect them to callbackUrl immediately.
const ButtonSignin = ({ text = "Get started", extraStyle }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"
  const [registeredEmail, setRegisteredEmail] = useState(""); // Para pre-llenar el login

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: config.auth.callbackUrl });
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    router.push(config.auth.callbackUrl);
  };

  const switchToLogin = (email = "") => {
    setAuthMode("login");
    if (email) {
      setRegisteredEmail(email);
    }
  };
  
  const switchToRegister = () => {
    setAuthMode("register");
    setRegisteredEmail(""); // Limpiar email al cambiar a registro
  };

  if (status === "authenticated") {
    return (
      <Link
        href={config.auth.callbackUrl}
        className={`btn ${extraStyle ? extraStyle : ""}`}
      >
        {session.user?.image ? (
          <img
            src={session.user?.image}
            alt={session.user?.name || "Account"}
            className="w-6 h-6 rounded-full shrink-0"
            referrerPolicy="no-referrer"
            width={24}
            height={24}
          />
        ) : (
          <span className="w-6 h-6 bg-base-300 flex justify-center items-center rounded-full shrink-0">
            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
          </span>
        )}
        {session.user?.name || session.user?.email || "Account"}
      </Link>
    );
  }

  return (
    <>
      <button
        className={`btn ${extraStyle ? extraStyle : ""}`}
        onClick={() => setShowAuthModal(true)}
      >
        {text}
      </button>

      {/* Modal de autenticación */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                ✕
              </button>
            </div>
            
            {/* Formulario de login/registro */}
            {authMode === "login" ? (
              <LoginForm 
                onSuccess={handleAuthSuccess}
                onCancel={() => setShowAuthModal(false)}
                prefillEmail={registeredEmail} // Pasar el email registrado al formulario de login
              />
            ) : (
              <RegisterForm 
                onSuccess={handleAuthSuccess}
                onCancel={() => setShowAuthModal(false)}
                onSwitchToLogin={switchToLogin}
              />
            )}
            
            <div className="divider">O</div>
            
            {/* Botón de Google */}
            <button
              onClick={handleGoogleSignIn}
              className="btn btn-outline w-full mb-4"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
            
            {/* Cambiar entre login y registro */}
            <div className="text-center">
              {authMode === "login" ? (
                <button
                  onClick={switchToRegister}
                  className="btn btn-link"
                >
                  ¿No tienes cuenta? Regístrate
                </button>
              ) : (
                <button
                  onClick={switchToLogin}
                  className="btn btn-link"
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonSignin;
