import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';
import { usePublicSiteSettings } from '@/hooks/useSiteSettings';
import { usePublicFooter } from '@/hooks/useFooter';
import { BrandLogo } from '@/components/ui/brand-logo';

// Funciones para construir URLs a partir de usuarios/números
const buildInstagramUrl = (username?: string | null) =>
  username ? `https://instagram.com/${username.replace('@', '')}` : null;

const buildFacebookUrl = (username?: string | null) =>
  username ? `https://facebook.com/${username}` : null;

export const Footer = () => {
  const { data: settings, isLoading: isLoadingSettings } = usePublicSiteSettings();
  const { data: footerSections = [] } = usePublicFooter();

  // Valores con fallback para cuando no hay settings cargados
  const siteName = settings?.siteName || 'Mi Tienda';
  const logoUrl = settings?.logoUrl;
  const siteDescription = settings?.footerText || 'Tu tienda online de confianza. Productos de calidad con envío a todo el país.';

  // Construir URLs a partir de usuarios/números
  const instagramUrl = buildInstagramUrl(settings?.instagramUrl);
  const facebookUrl = buildFacebookUrl(settings?.facebookUrl);

  // Determinar grid cols basado en cantidad de secciones + brand
  const totalColumns = 1 + footerSections.length; // Brand + Secciones dinámicas
  const gridClass = totalColumns <= 4
    ? `grid-cols-1 md:grid-cols-2 lg:grid-cols-${totalColumns}`
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  return (
    <footer className="bg-stone-50 text-stone-600 pt-20 pb-10 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- SECCIÓN SUPERIOR --- */}
        <div className={`grid ${gridClass} gap-12 mb-16`}>

          {/* 1. MARCA E IDENTIDAD (siempre presente) */}
          <div className="space-y-6">
            <BrandLogo
              logoUrl={logoUrl}
              siteName={siteName}
              isLoading={isLoadingSettings}
              size="lg"
              showIcon={true}
            />
            <p className="text-sm font-light leading-relaxed text-stone-500 pr-4">
              {siteDescription}
            </p>
            <div className="flex gap-4 pt-2">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-stone-200 rounded-full hover:bg-black hover:text-white transition-all duration-300"
                >
                  <Instagram size={18} />
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-stone-200 rounded-full hover:bg-black hover:text-white transition-all duration-300"
                >
                  <Facebook size={18} />
                </a>
              )}
            </div>
          </div>

          {/* 2. SECCIONES DINÁMICAS desde API */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-black font-medium tracking-widest text-sm uppercase mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4 text-sm font-light">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    {/* Si es URL externa, usar <a>. Si es interna, usar <Link> */}
                    {link.url.startsWith('http') ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black hover:translate-x-1 inline-block transition-transform"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.url}
                        className="hover:text-black hover:translate-x-1 inline-block transition-transform"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* --- BARRA INFERIOR --- */}
        <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-stone-400">
          <p>&copy; {new Date().getFullYear()} {siteName.toUpperCase()}. Todos los derechos reservados.</p>
          <p>
            Desarrollado por{' '}
            <a
              href="https://github.com/Halloweensito"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors underline underline-offset-2"
            >
              Osiris M. Corrales
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};