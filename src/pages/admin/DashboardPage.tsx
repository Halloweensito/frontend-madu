import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Folder, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Panel de Administración</h2>
        <p className="text-muted-foreground">
          Gestiona tu tienda desde aquí
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {/* Productos */}
        <Card className="h-full hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <CardTitle>Productos</CardTitle>
            </div>
            <CardDescription>
              Administra tu catálogo de productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Link to="/admin/productos" className="w-full">
                <Button variant="outline" className="w-full">
                  Ver todos
                </Button>
              </Link>
              <Link to="/admin/productos/nuevo" className="w-full">
                <Button className="w-full">
                  Crear nuevo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Categorías */}
        <Card className="h-full hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-green-600" />
              <CardTitle>Categorías</CardTitle>
            </div>
            <CardDescription>
              Organiza tus productos por categorías
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Link to="/admin/categorias" className="w-full">
                <Button variant="outline" className="w-full">
                  Ver todas
                </Button>
              </Link>
              <Link to="/admin/categorias/nueva" className="w-full">
                <Button className="w-full">
                  Crear nueva
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Pedidos */}
        <Card className="h-full hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-orange-600" />
              <CardTitle>Pedidos</CardTitle>
            </div>
            <CardDescription>
              Gestiona los pedidos de tus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/pedidos" className="w-full">
              <Button variant="outline" className="w-full">
                Ver pedidos
              </Button>
            </Link>
          </CardContent>
        </Card>

      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-blue-900">Bienvenido al Panel de Administración</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <p className="text-sm">
            Desde aquí puedes gestionar todos los aspectos de tu tienda.
            Comienza creando productos y organizándolos en categorías.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
