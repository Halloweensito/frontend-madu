// components/cart/CheckoutForm.tsx
// Formulario para capturar datos del cliente antes de crear el pedido

import { useState } from 'react';
import { User, Phone, FileText, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CheckoutFormProps {
    onSubmit: (data: { customerName: string; customerPhone: string; customerNote: string }) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function CheckoutForm({ onSubmit, onCancel, isSubmitting }: CheckoutFormProps) {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerNote, setCustomerNote] = useState('');
    const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación simple
        const newErrors: typeof errors = {};

        if (!customerName.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!customerPhone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        } else if (!/^[\d\s\-+()]{8,}$/.test(customerPhone.trim())) {
            newErrors.phone = 'Ingresa un teléfono válido';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onSubmit({
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            customerNote: customerNote.trim()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center pb-2">
                <h3 className="font-medium text-stone-900">Datos para tu pedido</h3>
                <p className="text-xs text-stone-500 mt-1">
                    Te contactaremos por WhatsApp para coordinar
                </p>
            </div>

            {/* Nombre */}
            <div className="space-y-1.5">
                <Label htmlFor="customerName" className="text-sm">
                    Nombre *
                </Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <Input
                        id="customerName"
                        type="text"
                        placeholder="Tu nombre"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="pl-10"
                        disabled={isSubmitting}
                    />
                </div>
                {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                )}
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
                <Label htmlFor="customerPhone" className="text-sm">
                    Teléfono / WhatsApp *
                </Label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <Input
                        id="customerPhone"
                        type="tel"
                        placeholder="+54 11 1234-5678"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="pl-10"
                        disabled={isSubmitting}
                    />
                </div>
                {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone}</p>
                )}
            </div>

            {/* Nota (opcional) */}
            <div className="space-y-1.5">
                <Label htmlFor="customerNote" className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-stone-400" />
                    Nota (opcional)
                </Label>
                <Textarea
                    id="customerNote"
                    placeholder="Instrucciones especiales, dirección, etc..."
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    rows={2}
                    className="resize-none text-sm"
                    disabled={isSubmitting}
                />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="flex-1"
                >
                    Volver
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-black hover:bg-stone-800"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creando...
                        </>
                    ) : (
                        <>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Confirmar
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
