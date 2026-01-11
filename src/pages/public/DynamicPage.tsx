// pages/DynamicPage.tsx
// Renderizado público de páginas dinámicas con contenido sanitizado

import { useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { usePublicPage } from '@/hooks/usePageContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumb } from '@/components/commerce/Breadcrumb';

export default function DynamicPage() {
    const { slug } = useParams<{ slug: string }>();

    const { data: page, isLoading, error } = usePublicPage(slug!);

    // Actualizar título del documento
    useEffect(() => {
        if (page) {
            document.title = page.title;
        }
    }, [page]);

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full bg-stone-50 min-h-screen py-8">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <Skeleton className="h-5 w-40 mb-8" />
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-6 w-2/3" />
                </div>
            </div>
        );
    }

    // Error state (404)
    if (error || !page) {
        return <Navigate to="/404" replace />;
    }

    // Sanitizar contenido HTML
    const sanitizedContent = DOMPurify.sanitize(page.content, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['style', 'class', 'target'],
    });

    const breadcrumbItems = [
        { label: page.title }
    ];

    return (
        <div className="w-full bg-stone-50 min-h-screen py-8">
            <article className="mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb items={breadcrumbItems} />

                <div
                    className="prose prose-lg max-w-none text-left
                        prose-headings:font-light prose-headings:text-stone-900 prose-headings:tracking-tight
                        prose-p:text-stone-600 prose-p:font-light prose-p:leading-relaxed
                        prose-strong:text-stone-900 prose-strong:font-medium
                        prose-a:text-stone-900 prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-stone-600
                        prose-ul:text-stone-600 prose-ul:font-light
                        prose-ol:text-stone-600 prose-ol:font-light
                        prose-li:marker:text-stone-400"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
            </article>
        </div>
    );
}

