// pages/DynamicPage.tsx
// Renderizado público de páginas dinámicas con contenido sanitizado

import { useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { usePublicPage } from '@/hooks/usePageContent';
import { Skeleton } from '@/components/ui/skeleton';

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
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Skeleton className="h-12 w-3/4 mb-6" />
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-6 w-2/3" />
            </div>
        );
    }

    // Error state (404)
    if (error || !page) {
        return <Navigate to="/404" replace />;
    }

    // Sanitizar contenido HTML
    // Tiptap usa style para text-align y classes para otros formatos
    const sanitizedContent = DOMPurify.sanitize(page.content, {
        ADD_TAGS: ['iframe'], // Si quisieras permitir iframes (videos)
        ADD_ATTR: ['style', 'class', 'target'], // Permitir estilos (align) y clases
    });

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <article>
                <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
                <div
                    className="prose prose-lg max-w-none
            prose-headings:text-foreground
            prose-p:text-muted-foreground
            prose-strong:text-foreground
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-ul:text-muted-foreground
            prose-ol:text-muted-foreground
            prose-li:marker:text-primary"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
            </article>
        </div>
    );
}
