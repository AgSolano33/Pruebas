"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Ocultar el Header cuando estés en el dashboard de un proyecto específico
  // La ruta será /dashboard/proyecto/[id]
  const isProyectoDashboard = pathname?.startsWith('/dashboard/proyecto/');
  
  // Si estás en el dashboard de un proyecto específico, no renderizar el Header
  if (isProyectoDashboard) {
    return null;
  }
  
  // En cualquier otro caso, renderizar el Header normalmente
  return <Header />;
}
