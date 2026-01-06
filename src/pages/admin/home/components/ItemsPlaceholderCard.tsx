// pages/admin/home/components/ItemsPlaceholderCard.tsx
// Placeholder component for items section (HERO, CATEGORIES, FEATURED_PRODUCTS)

import { Image as ImageIcon } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { SectionType } from '@/types/homeSection';

interface ItemsPlaceholderCardProps {
    sectionType: string;
}

export function ItemsPlaceholderCard({ sectionType }: ItemsPlaceholderCardProps) {
    const getTitle = () => {
        switch (sectionType) {
            case SectionType.HERO:
                return 'Slides del Hero';
            case SectionType.CATEGORIES:
                return 'Categorías a Mostrar';
            case SectionType.FEATURED_PRODUCTS:
                return 'Productos a Destacar';
            default:
                return 'Items';
        }
    };

    const getItemType = () => {
        switch (sectionType) {
            case SectionType.HERO:
                return 'slides';
            case SectionType.CATEGORIES:
                return 'categorías';
            case SectionType.FEATURED_PRODUCTS:
                return 'productos';
            default:
                return 'items';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{getTitle()}</CardTitle>
                <CardDescription>
                    Próximamente: Selector de items para esta sección
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border-2 border-dashed border-stone-200 rounded-lg p-8 text-center">
                    <ImageIcon className="h-10 w-10 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500">
                        El selector de {getItemType()} estará disponible próximamente.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
