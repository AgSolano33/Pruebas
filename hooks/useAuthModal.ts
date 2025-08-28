// /hooks/useAuthModal.ts
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import config from "@/config";

export const useAuthModal = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const openModal = () => setShowAuthModal(true);
  const closeModal = () => setShowAuthModal(false);
  const handleRegisterSuccess = (email: string) => {
    setShowAuthModal(true);
    switchToLogin(email);
  };

  const handleGoogleSignIn = () => signIn("google", { callbackUrl: config.auth.callbackUrl });

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    router.push(config.auth.callbackUrl);
  };

  const switchToLogin = (email = "") => {
    setAuthMode("login");
    if (email) setRegisteredEmail(email);
  };

  const switchToRegister = () => {
    setAuthMode("register");
    setRegisteredEmail("");
  };

return {
  showAuthModal,
  authMode,
  registeredEmail,
  openModal,
  closeModal,
  handleGoogleSignIn,
  handleAuthSuccess,
  handleRegisterSuccess,  // <--- agregado
  switchToLogin,
  switchToRegister,
  session,
  status,
};

};
