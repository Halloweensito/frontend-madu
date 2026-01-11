// components/cart/CheckoutForm.tsx
// Formulario para capturar datos del cliente antes de crear el pedido

import { useState } from 'react';
import {
    User,
    Phone,
    FileText,
    Loader2,
    MessageCircle,
    MapPin,
    Truck,
    Store,
    Banknote,
    Building2,
    CreditCard,
    Smartphone,
    Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { ShippingMethod, PaymentMethod, SHIPPING_METHOD_LABELS, PAYMENT_METHOD_LABELS } from '@/types/order';
import { cn } from '@/lib/utils';

export interface CheckoutFormData {
    customerName: string;
    customerPhone: string;
    customerNote: string;
    shippingMethod: ShippingMethod;
    shippingAddress: string;
    shippingNote: string;
    shippingReferences: string;
    paymentMethod: PaymentMethod;
}

interface CheckoutFormProps {
    onSubmit: (data: CheckoutFormData) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

// Opciones de pago con iconos Lucide
const PAYMENT_OPTIONS: { value: PaymentMethod; icon: React.ReactNode }[] = [
    { value: 'CASH', icon: <Banknote className="h-4 w-4" strokeWidth={1.5} /> },
    { value: 'BANK_TRANSFER', icon: <Building2 className="h-4 w-4" strokeWidth={1.5} /> },
    { value: 'CREDIT_CARD', icon: <CreditCard className="h-4 w-4" strokeWidth={1.5} /> },
    { value: 'DEBIT_CARD', icon: <Wallet className="h-4 w-4" strokeWidth={1.5} /> },
    { value: 'MERCADOPAGO', icon: <Smartphone className="h-4 w-4" strokeWidth={1.5} /> },
];

export function CheckoutForm({ onSubmit, onCancel, isSubmitting }: CheckoutFormProps) {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerNote, setCustomerNote] = useState('');
    const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('PICKUP');
    const [shippingAddress, setShippingAddress] = useState('');
    const [shippingNote, setShippingNote] = useState('');
    const [shippingReferences, setShippingReferences] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
    const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if (!customerName.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!customerPhone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        } else if (!/^[\d\s\-+()]{8,}$/.test(customerPhone.trim())) {
            newErrors.phone = 'Ingresa un teléfono válido';
        }

        if (shippingMethod === 'DELIVERY' && !shippingAddress.trim()) {
            newErrors.address = 'La dirección es requerida para envío';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onSubmit({
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            customerNote: customerNote.trim(),
            shippingMethod,
            shippingAddress: shippingAddress.trim(),
            shippingNote: shippingNote.trim(),
            shippingReferences: shippingReferences.trim(),
            paymentMethod
        });
    };

    const isDelivery = shippingMethod === 'DELIVERY';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Datos básicos - Siempre visibles */}
            <div className="space-y-3">
                {/* Nombre */}
                <div className="space-y-1">
                    <Label htmlFor="customerName" className="text-sm tracking-wide">
                        Nombre *
                    </Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" strokeWidth={1.5} />
                        <Input
                            id="customerName"
                            type="text"
                            placeholder="Tu nombre"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="pl-10 font-light"
                            disabled={isSubmitting}
                        />
                    </div>
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Teléfono */}
                <div className="space-y-1">
                    <Label htmlFor="customerPhone" className="text-sm tracking-wide">
                        Teléfono / WhatsApp *
                    </Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" strokeWidth={1.5} />
                        <Input
                            id="customerPhone"
                            type="tel"
                            placeholder="+54 11 1234-5678"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="pl-10 font-light"
                            disabled={isSubmitting}
                        />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
            </div>

            {/* Acordeones para envío y pago */}
            <Accordion type="single" collapsible defaultValue="shipping" className="w-full space-y-2">
                {/* Método de entrega */}
                <AccordionItem value="shipping" className="border border-stone-200 rounded-lg overflow-hidden">
                    <AccordionTrigger className="hover:no-underline px-4 py-3 hover:bg-stone-50">
                        <div className="flex items-center gap-3">
                            <Truck className="h-4 w-4 text-stone-600" strokeWidth={1.5} />
                            <span className="text-sm tracking-wide">Entrega</span>
                            <span className="text-stone-400 text-sm font-light">
                                — {SHIPPING_METHOD_LABELS[shippingMethod]}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 border-t border-stone-100">
                        <div className="space-y-3">
                            {/* Botones de método de envío */}
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShippingMethod('PICKUP')}
                                    disabled={isSubmitting}
                                    className={cn(
                                        "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all text-sm font-light tracking-wide",
                                        shippingMethod === 'PICKUP'
                                            ? "border-stone-900 bg-stone-900 text-white"
                                            : "border-stone-200 hover:border-stone-300"
                                    )}
                                >
                                    <Store className="h-4 w-4" strokeWidth={1.5} />
                                    Retiro
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShippingMethod('DELIVERY')}
                                    disabled={isSubmitting}
                                    className={cn(
                                        "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all text-sm font-light tracking-wide",
                                        shippingMethod === 'DELIVERY'
                                            ? "border-stone-900 bg-stone-900 text-white"
                                            : "border-stone-200 hover:border-stone-300"
                                    )}
                                >
                                    <Truck className="h-4 w-4" strokeWidth={1.5} />
                                    Envío
                                </button>
                            </div>

                            {/* Campos de dirección (solo si es DELIVERY) */}
                            {isDelivery && (
                                <div className="space-y-2 pt-3 border-t border-stone-100">
                                    <div className="space-y-1">
                                        <Label htmlFor="shippingAddress" className="text-xs tracking-wide">
                                            Dirección *
                                        </Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" strokeWidth={1.5} />
                                            <Input
                                                id="shippingAddress"
                                                type="text"
                                                placeholder="Calle, número, ciudad"
                                                value={shippingAddress}
                                                onChange={(e) => setShippingAddress(e.target.value)}
                                                className="pl-10 text-sm font-light"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="shippingReferences" className="text-xs tracking-wide">
                                            Referencias
                                        </Label>
                                        <Input
                                            id="shippingReferences"
                                            type="text"
                                            placeholder="Entre calles, edificio, piso..."
                                            value={shippingReferences}
                                            onChange={(e) => setShippingReferences(e.target.value)}
                                            className="text-sm font-light"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="shippingNote" className="text-xs tracking-wide">
                                            Nota de envío
                                        </Label>
                                        <Input
                                            id="shippingNote"
                                            type="text"
                                            placeholder="Horarios, indicaciones..."
                                            value={shippingNote}
                                            onChange={(e) => setShippingNote(e.target.value)}
                                            className="text-sm font-light"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Método de pago */}
                <AccordionItem value="payment" className="border border-stone-200 rounded-lg overflow-hidden">
                    <AccordionTrigger className="hover:no-underline px-4 py-3 hover:bg-stone-50">
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-4 w-4 text-stone-600" strokeWidth={1.5} />
                            <span className="text-sm tracking-wide">Pago</span>
                            <span className="text-stone-400 text-sm font-light">
                                — {PAYMENT_METHOD_LABELS[paymentMethod]}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 border-t border-stone-100">
                        <div className="space-y-1.5">
                            {PAYMENT_OPTIONS.map(({ value, icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setPaymentMethod(value)}
                                    disabled={isSubmitting}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-sm font-light text-left tracking-wide",
                                        paymentMethod === value
                                            ? "border-stone-900 bg-stone-900 text-white"
                                            : "border-stone-200 hover:border-stone-300"
                                    )}
                                >
                                    <span className={paymentMethod === value ? "text-white" : "text-stone-500"}>
                                        {icon}
                                    </span>
                                    <span>{PAYMENT_METHOD_LABELS[value]}</span>
                                </button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Nota adicional */}
            <div className="space-y-1">
                <Label htmlFor="customerNote" className="text-sm tracking-wide flex items-center gap-2">
                    <FileText className="h-4 w-4 text-stone-400" strokeWidth={1.5} />
                    Nota adicional (opcional)
                </Label>
                <Textarea
                    id="customerNote"
                    placeholder="Instrucciones especiales..."
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    rows={2}
                    className="resize-none text-sm font-light"
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
                    className="flex-1 font-light tracking-wide"
                >
                    Volver
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-stone-900 hover:bg-stone-800 font-light tracking-wide"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creando...
                        </>
                    ) : (
                        <>
                            <MessageCircle className="mr-2 h-4 w-4" strokeWidth={1.5} />
                            Confirmar
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
