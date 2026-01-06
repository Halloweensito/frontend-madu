import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

// Importamos el Hook de React Query (Maneja caché y loading)
import { useActiveCategoryTree } from '@/hooks/useCatalog';
import type { CategoryTree } from '@/types/types';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const BRAND_NAME = 'Pussycat';

// Tipado estricto para el menú estático
const MENU_STATIC: { type: 'link'; name: string; href: string }[] = [
  { type: 'link', name: 'Inicio', href: '/' },
  { type: 'link', name: 'Contacto', href: '/contact' },
];

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  // ✅ REEMPLAZO: Usamos el hook en lugar de useEffect/useState manual
  const { data: categories = [], isLoading } = useActiveCategoryTree();



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
                  className="text-xs font-bold text-black py-2 block pl-2 underline decoration-stone-300 underline-offset-4 mb-2"
                >
                  Ver todo {node.name}
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

      <SheetContent side="left" className="w-87.5 p-0 overflow-y-auto bg-stone-50">

        {/* HEADER */}
        <SheetHeader className="p-8 border-b border-stone-200 text-left flex flex-row items-center justify-between">
          <SheetTitle className="font-light text-2xl tracking-[0.25em] uppercase text-black">
            {BRAND_NAME}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Menú de navegación principal para explorar categorías y colecciones.
          </SheetDescription>
          <SheetClose asChild>
            <button className="text-stone-400 hover:text-black transition-colors p-1">
              <X size={24} strokeWidth={1.5} />
            </button>
          </SheetClose>
        </SheetHeader>

        {/* NAVEGACIÓN */}
        <nav className="p-6 space-y-2">

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

      </SheetContent>
    </Sheet>
  );
};
