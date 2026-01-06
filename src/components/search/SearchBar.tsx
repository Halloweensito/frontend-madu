// components/search/SearchBar.tsx
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export function SearchBar({
    value,
    onChange,
    onSubmit,
    placeholder = "Buscar productos...",
    autoFocus = false,
}: SearchBarProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.();
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />

                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className="pl-10 pr-10 h-12 text-base border-stone-300 focus:border-stone-400"
                />

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                        aria-label="Limpiar búsqueda"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
        </form>
    );
}
