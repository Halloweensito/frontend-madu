import React from 'react';
import { X, Loader2, User, LogOut, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { User as SupabaseUser } from '@supabase/supabase-js';

import {
  Sheet, SheetContent, SheetHeader, SheetClose,
  SheetDescription, SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useActiveCategoryTree } from '@/hooks/useCatalog';
import { usePublicSiteSettings } from '@/hooks/useSiteSettings';
import { BrandLogo } from '@/components/ui/brand-logo';
import type { CategoryTree } from '@/types/types';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user?: SupabaseUser | null;
  onSignOut?: () => Promise<void>;
  isAdmin?: boolean;
}

// Tipado estricto para el menú estático
const MENU_STATIC: { type: 'link'; name: string; href: string }[] = [
  { type: 'link', name: 'Inicio', href: '/' },
  { type: 'link', name: 'Contacto', href: '/contacto' },
];

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose, user, onSignOut, isAdmin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: categories = [], isLoading } = useActiveCategoryTree();
  const { data: settings, isLoading: isLoadingSettings } = usePublicSiteSettings();

  const siteName = settings?.siteName || 'Pussycat';
  const logoUrl = settings?.logoUrl;

  // Handler para cerrar sidebar y navegar
  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  // Handler para sign out
  const handleSignOut = async () => {
    if (onSignOut) {
      await onSignOut();
    }
    onClose();
  };



  // 🔄 FUNCIÓN RECURSIVA OPTIMIZADA
  const renderNode = (node: CategoryTree, level = 0): React.ReactNode => {
    const key = node.id.toString();

    // CASO BASE: Nodo hoja (Link final)
    if (!node.children || node.children.length === 0) {
      return (
        <SheetClose asChild key={key}>
          <Link
            to={`/categoria/${node.slug}`}
            className="text-sm text-stone-500 hover:text-black transition-colors py-2 block pl-2 border-l border-transparent hover:border-stone-300"
          >
            {node.name}
          </Link>
        </SheetClose>
      );
    }

    // CASO RECURSIVO: Si tiene hijos, es un Acordeón
    return (
      <Accordion key={key} type="single" collapsible>
        <AccordionItem value={key} className="border-none">
          <AccordionTrigger
            className={`py-2 ${level === 0
              ? 'uppercase tracking-widest text-stone-600 font-medium text-xs'
              : 'text-sm text-stone-600 pl-2'
              } hover:text-black hover:no-underline justify-between`}
          >
            {node.name}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-1 pl-4 border-l border-stone-200 ml-1 py-1">

              {/* --- MEJORA UX: Link para navegar a la categoría padre --- */}
              <SheetClose asChild>
                <Link
                  to={`/categoria/${node.slug}`}
                  className="text-xs font-medium text-stone-800 py-2 block pl-2 uppercase tracking-[0.15em] border-b border-stone-400 inline-block pb-1 mb-2 hover:text-black hover:border-stone-600 transition-colors"
                >
                  Ver Colección
                </Link>
              </SheetClose>
              {/* ------------------------------------------------------- */}

              {node.children.map((child) => renderNode(child, level + 1))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>

      <SheetContent side="left" className="w-87.5 p-0 overflow-y-auto bg-stone-50 flex flex-col">

        {/* HEADER */}
        <SheetHeader className="p-8 border-b border-stone-200 text-left flex flex-row items-center justify-between">
          <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
          <BrandLogo
            logoUrl={logoUrl}
            siteName={siteName}
            isLoading={isLoadingSettings}
            size="sm"
          />
          <SheetDescription className="sr-only">
            Menú de navegación principal para explorar categorías y colecciones.
          </SheetDescription>
          <SheetClose asChild>
            <button className="text-stone-400 hover:text-black transition-colors p-1">
              <X size={24} strokeWidth={1.5} />
            </button>
          </SheetClose>
        </SheetHeader>

        {/* NAVEGACIÓN - Crece para llenar el espacio */}
        <nav className="p-6 space-y-2 flex-1">

          {/* 1. Links Estáticos */}
          {MENU_STATIC.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                to={item.href}
                className={`block py-3 border-b border-stone-200 text-stone-600 hover:text-black transition-colors font-light text-sm uppercase tracking-[0.2em] ${location.pathname === item.href ? 'font-medium text-black' : ''
                  }`}
              >
                {item.name}
              </Link>
            </SheetClose>
          ))}

          {/* 2. Colecciones (Árbol Dinámico) */}
          <Accordion type="single" collapsible className="border-b border-stone-200">
            <AccordionItem value="collections" className="border-none">
              <AccordionTrigger className="py-3 font-light text-sm uppercase tracking-[0.2em] text-stone-600 hover:text-black hover:no-underline data-[state=open]:text-black">
                Colecciones
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-4">

                  {/* Estado de Carga vs Datos */}
                  {isLoading ? (
                    <div className="flex items-center gap-2 py-4 text-stone-400 text-xs">
                      <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((cat) => renderNode(cat))
                  ) : (
                    <div className="text-xs text-stone-400 italic py-2">No hay categorías disponibles</div>
                  )}

                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </nav>

        {/* SECCIÓN USUARIO - Solo móvil, al final del sidebar */}
        <div className="sm:hidden px-6 py-4 border-t border-stone-200 bg-white/50 mt-auto">
          {user ? (
            // Usuario logueado
            <div className="space-y-2">
              {/* Info del usuario */}
              <div className="flex items-center gap-3 py-3 border-b border-stone-200">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-stone-800">Mi Cuenta</span>
                  <span className="text-xs text-stone-500 truncate max-w-[180px]">{user.email}</span>
                </div>
              </div>

              {/* Panel de Admin (si es admin) */}
              {isAdmin && (
                <button
                  onClick={() => handleNavigate('/admin')}
                  className="flex items-center gap-3 py-3 w-full text-stone-600 hover:text-black transition-colors"
                >
                  <Settings strokeWidth={1.5} size={20} />
                  <span className="font-light text-sm uppercase tracking-[0.2em]">Panel de Admin</span>
                </button>
              )}

              {/* Cerrar Sesión */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 py-3 w-full text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut strokeWidth={1.5} size={20} />
                <span className="font-light text-sm uppercase tracking-[0.2em]">Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            // Usuario no logueado
            <SheetClose asChild>
              <Link
                to="/login"
                className="flex items-center gap-3 py-3 text-stone-600 hover:text-black transition-colors"
              >
                <User strokeWidth={1.5} size={20} />
                <span className="font-light text-sm uppercase tracking-[0.2em]">Iniciar Sesión</span>
              </Link>
            </SheetClose>
          )}
        </div>

      </SheetContent>
    </Sheet>
  );
};
