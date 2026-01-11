import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// =====================================================
// COMPONENTES PÚBLICOS (cargados inmediatamente)
// =====================================================
import { Home } from "../pages/public/Home";
import { Shop } from "../pages/public/Shop.tsx";
import { Layout } from "../components/layout/Layout.tsx"
import { ProductDetail } from "../pages/public/ProductDetail";
import { CategoryPage } from "../pages/public/CategoryPage.tsx";
import { Search } from "../pages/public/Search.tsx";
import DynamicPage from "@/pages/public/DynamicPage.tsx";
import ContactPage from "@/pages/public/ContactPage.tsx";
import NotFoundPage from "@/pages/public/NotFoundPage.tsx";
import Login from "@/pages/auth/Login";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// =====================================================
// COMPONENTES ADMIN (lazy loaded - solo se cargan cuando se necesitan)
// Esto reduce el bundle inicial para usuarios públicos
// =====================================================
const DashboardLayout = lazy(() => import("../components/dashboard/DashboardLayout.tsx"));
const DashboardPage = lazy(() => import("@/pages/admin/DashboardPage.tsx"));
const ProductList = lazy(() => import("@/pages/admin/products/ProductList.tsx"));
const ProductCreate = lazy(() => import("@/pages/admin/products/ProductCreate.tsx"));
const HomeSettings = lazy(() => import("@/pages/admin/home/HomeSettings.tsx"));
const CategoryList = lazy(() => import("@/pages/admin/categories/CategoryList"));
const CategoryCreate = lazy(() => import("@/pages/admin/categories/CategoryCreate"));
const StoreSettings = lazy(() => import("@/pages/admin/settings/StoreSettings"));
const PageList = lazy(() => import("@/pages/admin/pages/PageList"));
const PageEditor = lazy(() => import("@/pages/admin/pages/PageEditor"));
const FooterManager = lazy(() => import("@/pages/admin/footer/FooterManager"));
const OrderList = lazy(() => import("@/pages/admin/orders/OrderList"));

// =====================================================
// LOADING FALLBACK
// =====================================================
const AdminLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-muted/40">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Cargando panel de administración...</p>
    </div>
  </div>
);

const PageLoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Shop />} />
        <Route path="/producto/:slug" element={<ProductDetail />} />
        <Route path="/search" element={<Search />} />

        {/* Categorías */}
        <Route path="/categoria/:slug" element={<CategoryPage />} />

        {/* Página de Contacto (hardcoded) */}
        <Route path="/contacto" element={<ContactPage />} />

        {/* Página 404 (explícita para evitar loop con DynamicPage) */}
        <Route path="/404" element={<NotFoundPage />} />

        {/* Páginas dinámicas (debe ir al final para no interferir con otras rutas) */}
        <Route path="/:slug" element={<DynamicPage />} />
      </Route>

      <Route path="/login" element={<Login />} />

      {/* RUTAS ADMIN (PROTEGIDAS + LAZY LOADED) */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <DashboardLayout />
            </Suspense>
          }
        >
          <Route index element={
            <Suspense fallback={<PageLoadingFallback />}>
              <DashboardPage />
            </Suspense>
          } />

          {/* Productos */}
          <Route path="productos" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <ProductList />
            </Suspense>
          } />
          <Route path="productos/nuevo" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <ProductCreate />
            </Suspense>
          } />
          <Route path="productos/editar/:id" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <ProductCreate />
            </Suspense>
          } />

          {/* Configuración del Home */}
          <Route path="home" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <HomeSettings />
            </Suspense>
          } />

          {/* Categorías */}
          <Route path="categorias" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <CategoryList />
            </Suspense>
          } />
          <Route path="categorias/nueva" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <CategoryCreate />
            </Suspense>
          } />
          <Route path="categorias/editar/:id" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <CategoryCreate />
            </Suspense>
          } />

          {/* Configuración del Sitio */}
          <Route path="configuracion" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <StoreSettings />
            </Suspense>
          } />

          {/* Páginas Dinámicas */}
          <Route path="paginas" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <PageList />
            </Suspense>
          } />
          <Route path="paginas/nueva" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <PageEditor />
            </Suspense>
          } />
          <Route path="paginas/:id" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <PageEditor />
            </Suspense>
          } />

          {/* Footer */}
          <Route path="footer" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <FooterManager />
            </Suspense>
          } />

          {/* Pedidos */}
          <Route path="pedidos" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <OrderList />
            </Suspense>
          } />

          <Route path="clientes" element={<div>Gestión de Clientes</div>} />
        </Route>
      </Route>

      {/* 404 NOT FOUND - Catch-all */}
      <Route element={<Layout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};