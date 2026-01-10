import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  linkUrl?: string;
  ctaText?: string;
}

// Valores por defecto (fallback)
const defaults = {
  title: 'Estilo Urbano',
  subtitle: 'Nueva Colección 2025',
  imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
  linkUrl: '/productos',
  ctaText: 'Explorar',
};

export const HeroSection = ({
  title = defaults.title,
  subtitle = defaults.subtitle,
  imageUrl = defaults.imageUrl,
  linkUrl = defaults.linkUrl,
  ctaText = defaults.ctaText,
}: HeroSectionProps) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* IMAGEN DE FONDO */}
      <div className="absolute inset-0">
        <img
          src={imageUrl || defaults.imageUrl}
          alt={title}
          fetchPriority="high"
          loading="eager"
          className="w-full h-full object-cover animate-fade-in"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto mt-16 animate-slide-up">

        {subtitle && (
          <p className="text-xs md:text-sm font-medium tracking-[0.3em] uppercase mb-4 opacity-90 drop-shadow-sm">
            {subtitle}
          </p>
        )}

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-[0.2em] uppercase mb-8 drop-shadow-lg">
          {title}
        </h1>

        {/* ENLACE DE NAVEGACIÓN (SEO FRIENDLY) */}
        <Link
          to={linkUrl}
          className="group inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full text-xs md:text-sm font-medium uppercase tracking-[0.2em] hover:bg-stone-100 hover:scale-105 transition-all duration-500 ease-out shadow-xl"
        >
          {ctaText}
          <ArrowRight size={16} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-300" />
        </Link>

      </div>
    </section>
  );
};