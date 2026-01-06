import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStoreFrontSections } from '@/hooks/useHome';
import { useActiveCategories } from '@/hooks/useCatalog';
import { SectionRenderer } from '@/components/home/SectionRenderer';
import { HeroSection as StaticHeroSection } from '@/components/commerce/HeroSection';
import { CategoryCard } from '@/components/commerce/CategoryCard';

export const Home = () => {
  // Fetch dinámico de secciones configuradas
  const {
    data: sections,
    isLoading: isLoadingSections,
    error: sectionsError
  } = useStoreFrontSections();

  // Fallback: categorías activas (para cuando no hay secciones configuradas)
  const {
    data: categories,
    isLoading: isLoadingCategories,
  } = useActiveCategories();

  const isLoading = isLoadingSections || isLoadingCategories;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-stone-400" size={40} />
      </div>
    );
  }

  // Si hay secciones configuradas, renderizarlas dinámicamente
  const hasSections = sections && sections.length > 0;

  if (hasSections) {
    return (
      <>
        {sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </>
    );
  }

  // ========================================
  // FALLBACK: Comportamiento original si no hay secciones configuradas
  // ========================================

  if (sectionsError) {
    console.warn('Error loading home sections, using fallback:', sectionsError);
  }

  // Determinar si hay número impar de categorías
  const isOdd = categories && categories.length % 2 !== 0;

  return (
    <>
      {/* Hero estático de fallback */}
      <StaticHeroSection />

      {/* Grid de categorías de fallback */}
      <section className="py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {categories?.map((cat, index) => {
            const isLastAndOdd = isOdd && index === categories.length - 1;
            return (
              <div
                key={cat.id}
                className={isLastAndOdd ? "md:col-span-2" : ""}
              >
                <CategoryCard category={cat} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-16 border-stone-100">
        <div className="text-center">
          <Link
            to="/productos"
            className="inline-block border-b border-stone-800 pb-1 text-sm tracking-widest uppercase hover:text-stone-500 hover:border-stone-500 transition-colors"
          >
            Ver todo el catálogo
          </Link>
        </div>
      </section>
    </>
  );
};