// hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

/**
 * Hook para acceder al contexto de autenticación
 * 
 * IMPORTANTE: Este hook debe usarse dentro de un componente
 * que esté envuelto por el AuthProvider
 * 
 * @throws Error si se usa fuera del AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth debe ser usado dentro de un AuthProvider. " +
      "Asegúrate de envolver tu aplicación con <AuthProvider>."
    );
  }

  return context;
}

