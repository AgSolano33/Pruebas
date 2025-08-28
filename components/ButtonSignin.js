import { useAuthModal } from "@/hooks/useAuthModal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const ButtonSignin = ({ text = "Get started", extraStyle }) => {
  const {
    showAuthModal,
    authMode,
    registeredEmail,
    openModal,
    closeModal,
    handleGoogleSignIn,
    handleAuthSuccess,
    switchToLogin,
    switchToRegister,
    session,
    status,
  } = useAuthModal();

  if (status === "authenticated") {
    return (
      <span className={`btn ${extraStyle || ""}`}>
        {session.user?.name || session.user?.email || "Account"}
      </span>
    );
  }

  return (
    <>
      <button className={`btn ${extraStyle || ""}`} onClick={openModal}>
        {text}
      </button>

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
                prefillEmail={registeredEmail}
              />
            ) : (
              <RegisterForm
                onSuccess={handleAuthSuccess}
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
    </>
  );
};

export default ButtonSignin;
