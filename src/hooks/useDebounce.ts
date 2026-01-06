// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Hook para debouncing de valores
 * Útil para evitar llamadas excesivas a la API mientras el usuario escribe
 * 
 * @param value - Valor a debounce
 * @param delay - Delay en milisegundos (por defecto 300ms)
 * @returns Valor debounced
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Establecer un timeout para actualizar el valor debounced
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Limpiar el timeout si el valor cambia antes de que se cumpla el delay
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
