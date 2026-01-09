// components/cart/CartValidationErrors.tsx
// Componente de presentación para mostrar errores de validación

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CartValidationErrorsProps {
    errors: string[];
}

export function CartValidationErrors({ errors }: CartValidationErrorsProps) {
    if (errors.length === 0) return null;

    return (
        <div className="px-6 py-2 bg-red-50/50">
            <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="ml-2">Atención</AlertTitle>
                <AlertDescription className="ml-2 mt-2">
                    <ul className="list-disc pl-4 space-y-1 text-xs">
                        {errors.map((msg, i) => (
                            <li key={i}>{msg}</li>
                        ))}
                    </ul>
                </AlertDescription>
            </Alert>
        </div>
    );
}
