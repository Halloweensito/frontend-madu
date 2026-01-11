// services/footerService.ts
// Servicio para Footer Sections y Links

import { http } from './http';
import type {
    FooterSectionPublic,
    FooterSectionAdmin,
    FooterSectionRequest,
    FooterLinkAdmin,
    FooterLinkRequest,
} from '@/types/footerSection';

// ==================== PÚBLICO ====================

const getPublicFooter = (): Promise<FooterSectionPublic[]> =>
    http<FooterSectionPublic[]>('/public/footer', {
        cache: 'no-store', // Evitar cache del navegador - el backend tiene cache propio
    });

// ==================== ADMIN - SECCIONES ====================

const getAdminSections = (): Promise<FooterSectionAdmin[]> =>
    http<FooterSectionAdmin[]>('/admin/footer-sections');

const createSection = (data: FooterSectionRequest): Promise<FooterSectionAdmin> =>
    http<FooterSectionAdmin>('/admin/footer-sections', {
        method: 'POST',
        body: JSON.stringify(data),
    });

const updateSection = (id: number, data: FooterSectionRequest): Promise<FooterSectionAdmin> =>
    http<FooterSectionAdmin>(`/admin/footer-sections/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

const deleteSection = (id: number): Promise<void> =>
    http<void>(`/admin/footer-sections/${id}`, {
        method: 'DELETE',
    });

const reorderSections = (orderedIds: number[]): Promise<void> =>
    http<void>('/admin/footer-sections/reorder', {
        method: 'PUT',
        body: JSON.stringify(orderedIds),
    });

// ==================== ADMIN - LINKS ====================

const getAdminLinks = (): Promise<FooterLinkAdmin[]> =>
    http<FooterLinkAdmin[]>('/admin/footer-links');

const createLink = (data: FooterLinkRequest): Promise<FooterLinkAdmin> =>
    http<FooterLinkAdmin>('/admin/footer-links', {
        method: 'POST',
        body: JSON.stringify(data),
    });

const updateLink = (id: number, data: FooterLinkRequest): Promise<FooterLinkAdmin> =>
    http<FooterLinkAdmin>(`/admin/footer-links/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

const deleteLink = (id: number): Promise<void> =>
    http<void>(`/admin/footer-links/${id}`, {
        method: 'DELETE',
    });

const reorderLinks = (sectionId: number, orderedIds: number[]): Promise<void> =>
    http<void>(`/admin/footer-links/reorder/${sectionId}`, {
        method: 'PUT',
        body: JSON.stringify(orderedIds),
    });

// ==================== EXPORT ====================

export const footerService = {
    // Público
    getPublicFooter,
    // Admin Secciones
    getAdminSections,
    createSection,
    updateSection,
    deleteSection,
    reorderSections,
    // Admin Links
    getAdminLinks,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
};
