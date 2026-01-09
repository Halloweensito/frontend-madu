// hooks/useFavicon.ts
// Hook para actualizar el favicon dinámicamente

import { useEffect } from 'react';

/**
 * Hook que actualiza el favicon del documento cuando cambia la URL.
 * Usa el favicon por defecto si no se proporciona URL.
 */
export function useFavicon(faviconUrl?: string | null) {
    useEffect(() => {
        if (!faviconUrl) return;

        // Buscar el link del favicon existente o crear uno
        let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");

        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }

        // Actualizar href
        link.href = faviconUrl;
        link.type = 'image/x-icon';

        // Cleanup: no restauramos el original porque queremos que persista
    }, [faviconUrl]);
}
