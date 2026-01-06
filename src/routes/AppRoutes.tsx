import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/public/Home";
import { Shop } from "../pages/public/Shop.tsx";
import { Layout } from "../components/layout/Layout.tsx"
import { ProductDetail } from "../pages/public/ProductDetail";
import { CategoryPage } from "../pages/public/CategoryPage.tsx";
import { Search } from "../pages/public/Search.tsx";
import DashboardLayout from "../components/dashboard/DashboardLayout.tsx";
import DashboardPage from "@/pages/admin/DashboardPage.tsx";
import ProductList from "@/pages/admin/products/ProductList.tsx";
import ProductCreate from "@/pages/admin/products/ProductCreate.tsx";
import HomeSettings from "@/pages/admin/home/HomeSettings.tsx";
import CategoryList from "@/pages/admin/categories/CategoryList";
import CategoryCreate from "@/pages/admin/categories/CategoryCreate";
import Login from "@/pages/auth/Login";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Shop />} />
        <Route path="/producto/:slug" element={<ProductDetail />} />
        <Route path="/search" element={<Search />} />

        {/* 🔥 CORRECCIÓN: Usamos directa y únicamente el slug */}
        {/* Esto coincide con tu componente CategoryPage que usa useParams<{slug}> */}
        <Route path="/categoria/:slug" element={<CategoryPage />} />
      </Route>

      <Route path="/login" element={<Login />} />

      {/* RUTAS ADMIN (PROTEGIDAS) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />

          {/* Productos */}
          <Route path="productos" element={<ProductList />} />
          <Route path="productos/nuevo" element={<ProductCreate />} />
          <Route path="productos/editar/:id" element={<ProductCreate />} />

          {/* Configuración del Home */}
          <Route path="home" element={<HomeSettings />} />

          {/* Categorías */}
          <Route path="categorias" element={<CategoryList />} />
          <Route path="categorias/nueva" element={<CategoryCreate />} />
          <Route path="categorias/editar/:id" element={<CategoryCreate />} />

          <Route path="pedidos" element={<div>Gestión de Pedidos</div>} />
          <Route path="clientes" element={<div>Gestión de Clientes</div>} />
          <Route path="configuracion" element={<div>Configuración</div>} />
        </Route>
      </Route>

      {/* 404 NOT FOUND */}
      <Route
        path="*"
        element={
          <div className="h-min pt-32 text-center text-red-500">
            Página no encontrada
          </div>
        }
      />
    </Routes>
  );
};