// pages/admin/footer/components/DragOverlayPreview.tsx
// Preview component shown during drag operation

import { GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { FooterSectionAdmin, FooterLinkAdmin } from '@/types/footerSection';

interface SectionPreviewProps {
    section: FooterSectionAdmin;
    linksCount: number;
}

export function SectionDragPreview({ section, linksCount }: SectionPreviewProps) {
    return (
        <Card className="p-4 shadow-xl border-2 border-primary/50 bg-background cursor-grabbing">
            <div className="flex items-center gap-3">
                <GripVertical className="h-5 w-5 text-primary" />
                <span className="font-medium">{section.title}</span>
                {!section.active && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">Inactivo</span>
                )}
                <span className="text-xs text-muted-foreground">({linksCount} links)</span>
            </div>
        </Card>
    );
}

interface LinkPreviewProps {
    link: FooterLinkAdmin;
}

export function LinkDragPreview({ link }: LinkPreviewProps) {
    return (
        <div className="flex items-center gap-3 bg-background p-3 rounded-md border-2 border-primary/50 shadow-xl cursor-grabbing">
            <GripVertical className="h-4 w-4 text-primary" />
            <div>
                <p className="font-medium text-sm">{link.label}</p>
                <p className="text-xs text-muted-foreground">
                    {link.pageTitle ? `Página: ${link.pageTitle}` : link.url}
                </p>
            </div>
            {!link.active && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded">Inactivo</span>
            )}
        </div>
    );
}
