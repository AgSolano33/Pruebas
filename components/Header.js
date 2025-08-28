"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import { useAuthModal } from "@/hooks/useAuthModal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ButtonSignin from "./ButtonSignin";
import ButtonAccount from "./ButtonAccount";
import logo from "@/app/icon.png";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    showAuthModal,
    authMode,
    registeredEmail,
    openModal,
    closeModal,
    handleGoogleSignIn,
    handleAuthSuccess,
    handleRegisterSuccess,
    switchToLogin,
    switchToRegister,
  } = useAuthModal();

  return (
    <header className="bg-base-200">
      <nav className="container flex items-center justify-between px-8 py-4 mx-auto">
        <Link href="/">
          <Image src={logo} alt="Logo" width={200} height={200} />
        </Link>

        <div>
          {session ? (
            <ButtonAccount />
          ) : (
            <ButtonSignin onClick={openModal} extraStyle="btn-primary" />
          )}
        </div>
      </nav>

      {/* Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
              </h2>
              <button onClick={closeModal} className="btn btn-ghost btn-sm btn-circle">
                ✕
              </button>
            </div>

            {authMode === "login" ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onCancel={closeModal}
                defaultEmail={registeredEmail}
              />
            ) : (
              <RegisterForm
                onSuccess={handleRegisterSuccess}
                onCancel={closeModal}
                onSwitchToLogin={switchToLogin}
              />
            )}

            <div className="divider">O</div>

            <button onClick={handleGoogleSignIn} className="btn btn-outline w-full mb-4">
              Continuar con Google
            </button>

            <div className="text-center">
              {authMode === "login" ? (
                <button onClick={switchToRegister} className="btn btn-link">
                  ¿No tienes cuenta? Regístrate
                </button>
              ) : (
                <button onClick={() => switchToLogin()} className="btn btn-link">
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
