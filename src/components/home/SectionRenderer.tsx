// components/home/SectionRenderer.tsx
// Renders the appropriate component based on section type

import { Link } from 'react-router-dom';
import type { HomeSectionResponse } from '@/types/homeSection';
import { SectionType } from '@/types/homeSection';
import { CategoryCard } from '@/components/commerce/CategoryCard';
import { ProductCard } from '@/components/commerce/ProductCard';
import { HeroSection } from '@/components/commerce/HeroSection';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from '@/components/ui/carousel';

interface SectionRendererProps {
    section: HomeSectionResponse;
}

/**
 * Renderiza una sección del Home según su tipo
 */
export function SectionRenderer({ section }: SectionRendererProps) {
    switch (section.type) {
        case SectionType.HERO:
            return (
                <HeroSection
                    title={section.title}
                    subtitle={section.subtitle}
                    imageUrl={section.imageUrl}
                    linkUrl={section.linkUrl}
                />
            );
        case SectionType.CATEGORIES:
            return <CategoriesSection section={section} />;
        case SectionType.FEATURED_PRODUCTS:
            return <FeaturedProductsSection section={section} />;
        case SectionType.BANNER:
            return <AnnouncementBar section={section} />;
        case SectionType.TEXT_BLOCK:
            return <TextBlockSection section={section} />;
        default:
            return null;
    }
}

// ==========================================
// ANNOUNCEMENT BAR (Barra de Aviso)
// ==========================================

function AnnouncementBar({ section }: { section: HomeSectionResponse }) {
    if (!section.title) return null;

    return (
        <div className="bg-stone-900 text-white text-center py-2 px-4">
            <p className="text-xs md:text-sm tracking-wide">
                {section.title}
            </p>
        </div>
    );
}

// ==========================================
// CATEGORIES SECTION
// ==========================================

function CategoriesSection({ section }: { section: HomeSectionResponse }) {
    const categories = section.items
        ?.filter(item => item.category)
        .map(item => item.category!);

    if (!categories || categories.length === 0) {
        return null;
    }

    const isOdd = categories.length % 2 !== 0;

    return (
        <section className="py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categories.map((cat, index) => {
                    const isLastAndOdd = isOdd && index === categories.length - 1;
                    return (
                        <div
                            key={cat.id}
                            className={isLastAndOdd ? "md:col-span-2" : ""}
                        >
                            <CategoryCard category={cat as any} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

// ==========================================
// FEATURED PRODUCTS SECTION
// ==========================================

function FeaturedProductsSection({ section }: { section: HomeSectionResponse }) {
    const products = section.items
        ?.filter(item => item.product)
        .map(item => item.product!);

    if (!products || products.length === 0) {
        return (
            <section className="py-12">
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase mb-4">
                        {section.title || 'Productos Destacados'}
                    </h2>
                    <p className="text-stone-500">Próximamente...</p>
                </div>
            </section>
        );
    }

    const isCarousel = products.length > 4;

    return (
        <section className="py-12">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase">
                    {section.title || 'Productos Destacados'}
                </h2>
                {section.subtitle && (
                    <p className="text-stone-500 mt-2">{section.subtitle}</p>
                )}
            </div>

            {isCarousel ? (
                /* CARROUSEL (> 4 productos) */
                <div className="px-12">
                    <Carousel
                        opts={{
                            align: 'start',
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {products.map((product) => (
                                <CarouselItem
                                    key={product.id}
                                    className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
                                >
                                    <ProductCard product={product} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-10" />
                        <CarouselNext className="-right-10" />
                    </Carousel>
                </div>
            ) : (
                /* GRID (<= 4 productos) - Centrado */
                <div className="max-w-7xl mx-auto px-4">
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 justify-center ${products.length < 4 ? 'md:flex md:justify-center' : ''
                        }`}>
                        {products.map((product) => (
                            <div key={product.id} className={products.length < 4 ? 'w-full max-w-[280px] md:max-w-[300px]' : ''}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

// ==========================================
// TEXT BLOCK SECTION
// ==========================================

function TextBlockSection({ section }: { section: HomeSectionResponse }) {
    return (
        <section className="py-16 border-stone-100">
            <div className="text-center max-w-2xl mx-auto px-4">
                {section.title && (
                    <h2 className="text-2xl md:text-3xl font-light tracking-widest uppercase mb-4">
                        {section.title}
                    </h2>
                )}
                {section.subtitle && (
                    <p className="text-lg text-stone-600 mb-6">{section.subtitle}</p>
                )}
                {section.linkUrl && (
                    <Link
                        to={section.linkUrl}
                        className="inline-block border-b border-stone-800 pb-1 text-sm tracking-widest uppercase hover:text-stone-500 hover:border-stone-500 transition-colors"
                    >
                        Ver todo el catálogo
                    </Link>
                )}
            </div>
        </section>
    );
}
