import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="mb-8" aria-label="Breadcrumb">
      <ol 
        className="flex items-center text-sm flex-wrap" // Quitamos gap-2 para manejarlo manualmente
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        {/* 1. INICIO (Elemento fijo) */}
        <li 
          className="flex items-center"
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem"
        >
          <Link
            to="/"
            className="flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors"
            itemProp="item"
          >
            <Home size={16} strokeWidth={1.5} aria-hidden="true" />
            <span itemProp="name">Inicio</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {/* 2. ELEMENTOS DINÁMICOS */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const position = index + 2;

          return (
            <li 
              key={`${item.label}-${index}`}
              className="flex items-center min-w-0" // min-w-0 ayuda al truncate
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {/* SEPARADOR (Dentro del LI, oculto a screen readers) */}
              <ChevronRight 
                size={16} 
                className="text-stone-400 mx-2 shrink-0" 
                strokeWidth={1.5}
                aria-hidden="true"
              />

              {isLast || !item.href ? (
                // CASO: Texto (Página actual)
                <span 
                  className="text-stone-900 font-light truncate capitalize"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                // CASO: Link
                <Link
                  to={item.href}
                  className="text-stone-500 hover:text-stone-900 transition-colors truncate capitalize"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              
              <meta itemProp="position" content={String(position)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};