"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ButtonSignin from "./ButtonSignin";
import ButtonAccount from "./ButtonAccount";
import logo from "@/app/icon.png";
import config from "@/config";
import { useSession, signIn } from "next-auth/react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const links = [
  {
    href: "/#pricing",
    label: "Pricing",
  },
  {
    href: "/#testimonials",
    label: "Reviews",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
  {
    href: "/#busco-soluciones",
    label: "Busco Soluciones",
  },
  {
    href: "/#brindo-soluciones",
    label: "Brindo Soluciones",
  },
];

// A header with a logo on the left, links in the center (like Pricing, etc...), and a CTA (like Get Started or Login) on the right.
// The header is responsive, and on mobile, the links are hidden behind a burger button.
const Header = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [activeUserType, setActiveUserType] = useState("client");

  // setIsOpen(false) when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  const isDashboard = pathname?.startsWith('/dashboard');
  const isLandingPage = pathname === '/';

  const handleBuscoSoluciones = () => {
    router.push("/busco-soluciones");
  };

  const handleBrindoSoluciones = () => {
    router.push("/brindo-soluciones");
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (selectedUserType === "client") {
      router.push("/dashboard");
    } else if (selectedUserType === "provider") {
      router.push("/expertos");
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleSignIn = () => {
    const callbackUrl = selectedUserType === "provider" 
      ? "/expertos" 
      : config.auth.callbackUrl;
    
    if (selectedUserType) {
      signIn("google", { callbackUrl: `${callbackUrl}?userType=${selectedUserType}` });
    } else {
      signIn("google", { callbackUrl: config.auth.callbackUrl });
    }
  };

  const switchToLogin = (email = "") => {
    setAuthMode("login");
  };
  
  const switchToRegister = () => {
    setAuthMode("register");
    // Mantener el userType seleccionado cuando se cambia a registro
  };

  // Función para manejar clic en enlace Cliente/Proveedor
  const handleNavLinkClick = (userType) => {
    // Si el usuario tiene ambos tipos, cambiar el tipo activo
    if (session?.user?.userType && Array.isArray(session.user.userType) && 
        session.user.userType.includes("client") && session.user.userType.includes("provider")) {
      setActiveUserType(userType);
      localStorage.setItem("activeUserType", userType);
    }
    // La navegación se maneja automáticamente por el Link
  };

  // Cargar el tipo activo desde localStorage al montar el componente
  useEffect(() => {
    if (session?.user?.userType) {
      const savedType = localStorage.getItem("activeUserType");
      if (savedType && ["client", "provider"].includes(savedType)) {
        setActiveUserType(savedType);
      }
    }
  }, [session]);

  return (
    <header className="bg-base-200">
      <nav
        className="container flex items-center justify-between px-8 py-4 mx-auto"
        aria-label="Global"
      >
        {/* Back arrow and logo */}
        <div className="flex items-center gap-4">
          {isDashboard && (
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </Link>
          )}
          <Link
            className="flex items-center gap-2 shrink-0"
            href={isDashboard ? "/dashboard" : "/"}
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              placeholder="blur"
              priority={true}
              width={300}
              height={300}
              className="w-[200px] md:w-[300px]"
            />
            <span className="font-extrabold text-lg hidden md:block">{config.appName}</span>
          </Link>
        </div>

        {/* Burger button to open menu on mobile */}
        <div className="flex lg:hidden ml-4">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-base-content"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Your links on large screens */}
        {!isDashboard && (
          <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center lg:ml-24">
            {links.slice(0, 3).map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className="link link-hover text-base-content/80 hover:text-base-content"
                title={link.label}
              >
                {link.label}
              </Link>
            ))}
            {!session && (
              <>
                <button
                  onClick={handleBuscoSoluciones}
                  className="link link-hover text-base-content/80 hover:text-base-content"
                  title="Busco Soluciones"
                >
                  Busco Soluciones
                </button>
                <button
                  onClick={handleBrindoSoluciones}
                  className="link link-hover text-base-content/80 hover:text-base-content"
                  title="Brindo Soluciones"
                >
                  Brindo Soluciones
                </button>
              </>
            )}
            {session && (
              <>
                                    {/* Mostrar enlace Cliente solo si el usuario tiene tipo client */}
                    {session.user?.userType && 
                      (Array.isArray(session.user.userType) 
                        ? session.user.userType.includes("client") 
                        : session.user.userType === "client") && (
                      <Link 
                        href="/dashboard" 
                        className="link link-hover text-base-content/80 hover:text-base-content ml-8"
                        onClick={() => handleNavLinkClick("client")}
                      >
                        Cliente
                      </Link>
                    )}
                    {/* Mostrar enlace Proveedor solo si el usuario tiene tipo provider */}
                    {session.user?.userType && 
                      (Array.isArray(session.user.userType) 
                        ? session.user.userType.includes("provider") 
                        : session.user.userType === "provider") && (
                      <Link 
                        href="/dashboard" 
                        className="link link-hover text-base-content/80 hover:text-base-content"
                        onClick={() => handleNavLinkClick("provider")}
                      >
                        Proveedor
                      </Link>
                    )}
                    
                <Link 
                  href="/adminPanel" 
                  className="link link-hover text-base-content/80 hover:text-base-content"
                >
                  Admin
                </Link>
              </>
            )}
          </div>
        )}

        {/* CTA on large screens */}
        <div className="hidden lg:flex lg:justify-end lg:flex-1 lg:ml-8">
          {session ? <ButtonAccount /> : <ButtonSignin extraStyle="btn-primary" />}
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
        <div
          className={`fixed inset-y-0 right-0 z-10 w-full px-8 py-4 overflow-y-auto bg-base-200 sm:max-w-sm sm:ring-1 sm:ring-neutral/10 transform origin-right transition ease-in-out duration-300`}
        >
          {/* Your logo/name on small screens */}
          <div className="flex items-center justify-between">
            <Link
              className="flex items-center gap-2 shrink-0"
              href={isDashboard ? "/dashboard" : "/"}
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                placeholder="blur"
                priority={true}
                width={200}
                height={200}
                className="w-[150px]"
              />
              <span className="font-extrabold text-lg">{config.appName}</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Your links on small screens */}
          {!isDashboard && (
            <div className="flow-root mt-6">
              <div className="py-4">
                <div className="flex flex-col gap-y-4 items-start">
                  {links.slice(0, 3).map((link) => (
                    <Link
                      href={link.href}
                      key={link.href}
                      className="link link-hover text-base-content/80 hover:text-base-content"
                      title={link.label}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {!session && (
                    <>
                      <button
                        onClick={() => {
                          handleBuscoSoluciones();
                          setIsOpen(false);
                        }}
                        className="link link-hover text-base-content/80 hover:text-base-content text-left"
                        title="Busco Soluciones"
                      >
                        Busco Soluciones
                      </button>
                      <button
                        onClick={() => {
                          handleBrindoSoluciones();
                          setIsOpen(false);
                        }}
                        className="link link-hover text-base-content/80 hover:text-base-content text-left"
                        title="Brindo Soluciones"
                      >
                        Brindo Soluciones
                      </button>
                    </>
                  )}
                  {session && (
                    <>
                                    {/* Mostrar enlace Cliente solo si el usuario tiene tipo client */}
              {session.user?.userType && 
                (Array.isArray(session.user.userType) 
                  ? session.user.userType.includes("client") 
                  : session.user.userType === "client") && (
                <Link 
                  href="/dashboard" 
                  className="link link-hover text-base-content/80 hover:text-base-content"
                  onClick={() => {
                    handleNavLinkClick("client");
                    setIsOpen(false);
                  }}
                >
                  Cliente
                </Link>
              )}
              {/* Mostrar enlace Proveedor solo si el usuario tiene tipo provider */}
              {session.user?.userType && 
                (Array.isArray(session.user.userType) 
                  ? session.user.userType.includes("provider") 
                  : session.user.userType === "provider") && (
                <Link 
                  href="/dashboard" 
                  className="link link-hover text-base-content/80 hover:text-base-content"
                  onClick={() => {
                    handleNavLinkClick("provider");
                    setIsOpen(false);
                  }}
                >
                  Proveedor
                </Link>
              )}
              
                      <Link 
                        href="/adminPanel" 
                        className="link link-hover text-base-content/80 hover:text-base-content"
                      >
                        Admin
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="divider"></div>
            </div>
          )}
          {/* Your CTA on small screens */}
          <div className="flex flex-col">
            {session ? <ButtonAccount /> : <ButtonSignin extraStyle="btn-primary" />}
          </div>
          {session && (
            <Link 
              href="/adminPanel" 
              className="block mt-4 text-base-content/80 hover:text-base-content"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          )}
        </div>
      </div>

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
                userType={selectedUserType}
              />
            ) : (
              <RegisterForm 
                onSuccess={handleAuthSuccess}
                onCancel={() => setShowAuthModal(false)}
                onSwitchToLogin={switchToLogin}
                userType={selectedUserType}
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
    </header>
  );
};

export default Header;
