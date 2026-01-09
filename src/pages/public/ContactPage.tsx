// pages/ContactPage.tsx
// Página de contacto con información de la tienda

import { useEffect } from 'react';
import { Mail, Phone, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { usePublicSiteSettings } from '@/hooks/useSiteSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
    const { data: settings, isLoading } = usePublicSiteSettings();

    // Actualizar título
    useEffect(() => {
        document.title = 'Contacto';
    }, []);

    // Construir URLs
    const instagramUrl = settings?.instagramUrl
        ? `https://instagram.com/${settings.instagramUrl.replace('@', '')}`
        : null;
    const facebookUrl = settings?.facebookUrl
        ? `https://facebook.com/${settings.facebookUrl}`
        : null;
    const whatsappUrl = settings?.whatsappUrl
        ? `https://wa.me/${settings.whatsappUrl.replace(/\D/g, '')}`
        : null;

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 min-h-screen">
                <Skeleton className="h-12 w-1/2 mb-8" />
                <div className="grid md:grid-cols-2 gap-8">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Contacto</h1>
                    <p className="text-muted-foreground text-lg">
                        ¿Tenés alguna pregunta? Estamos aquí para ayudarte.
                    </p>
                </div>

                {/* Información de contacto */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Datos de contacto */}
                    <Card className="p-8 space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Información de Contacto</h2>

                        {settings?.email && (
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Email</p>
                                    <a
                                        href={`mailto:${settings.email}`}
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {settings.email}
                                    </a>
                                </div>
                            </div>
                        )}

                        {settings?.phone && (
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Teléfono</p>
                                    <a
                                        href={`tel:${settings.phone}`}
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {settings.phone}
                                    </a>
                                </div>
                            </div>
                        )}

                        {whatsappUrl && (
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <MessageCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium">WhatsApp</p>
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-green-600 transition-colors"
                                    >
                                        Enviar mensaje
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Si no hay información de contacto configurada */}
                        {!settings?.email && !settings?.phone && !whatsappUrl && (
                            <p className="text-muted-foreground italic">
                                Información de contacto no disponible.
                            </p>
                        )}
                    </Card>

                    {/* Redes sociales */}
                    <Card className="p-8">
                        <h2 className="text-xl font-semibold mb-6">Síguenos</h2>
                        <div className="space-y-4">
                            {instagramUrl && (
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-3"
                                    asChild
                                >
                                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                                        <Instagram className="h-5 w-5" />
                                        Instagram
                                    </a>
                                </Button>
                            )}

                            {facebookUrl && (
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-3"
                                    asChild
                                >
                                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                                        <Facebook className="h-5 w-5" />
                                        Facebook
                                    </a>
                                </Button>
                            )}

                            {whatsappUrl && (
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-3 bg-green-50 border-green-200 hover:bg-green-100"
                                    asChild
                                >
                                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="h-5 w-5 text-green-600" />
                                        WhatsApp
                                    </a>
                                </Button>
                            )}

                            {/* Si no hay redes configuradas */}
                            {!instagramUrl && !facebookUrl && !whatsappUrl && (
                                <p className="text-muted-foreground italic">
                                    Redes sociales no configuradas.
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
