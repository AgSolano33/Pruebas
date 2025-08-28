import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import config from "@/config";
import ConditionalHeader from "@/components/ConditionalHeader";
import HelpButton from "@/components/HelpButton";

export default async function LayoutPrivate({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(config.auth.loginUrl);
  }

  // Tomamos el nombre y rol del usuario desde la sesión
  const user = {
    name: session.user?.name || "Usuario",
    role: session.user?.role || "No especificado",
  };

  return (
    <>
      <ConditionalHeader />
      {children}
      <HelpButton user={user} />
    </>
  );
}
