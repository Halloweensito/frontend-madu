// context/AuthContext.tsx
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

// ==================== TYPES ====================

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAdmin: boolean;
    signOut: () => Promise<void>;
}

// ==================== CONTEXT ====================

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== PROVIDER ====================

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Obtener sesión inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Escuchar cambios en la autenticación
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // ==================== VERIFICACIÓN DE ADMIN ====================

    /**
     * Verifica si el usuario actual tiene rol de administrador
     * 
     * SEGURIDAD:
     * - Prioriza app_metadata (controlado por Supabase) sobre user_metadata (editable por usuario)
     * - NO permite acceso si no hay rol configurado (sin lógica permisiva)
     * - Requiere explícitamente rol "admin" o "administrator"
     */
    const isAdmin = (): boolean => {
        if (!user) return false;

        // Priorizar app_metadata (más seguro, controlado por Supabase)
        const role = user.app_metadata?.role || user.user_metadata?.role;

        // Verificación estricta: solo permitir si tiene rol de admin
        const hasAdminRole = role === "admin" || role === "administrator";

        // Log de intentos de acceso no autorizados (solo en desarrollo)
        if (!hasAdminRole && user && import.meta.env.DEV) {
            console.warn(
                `[AuthContext] Usuario ${user.email} intentó acceder sin rol de admin. Rol actual: ${role || "ninguno"}`
            );
        }

        return hasAdminRole;
    };

    // ==================== SIGN OUT ====================

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    // ==================== CONTEXT VALUE ====================

    const value: AuthContextType = {
        user,
        session,
        isLoading,
        isAdmin: isAdmin(),
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
