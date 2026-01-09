import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Menu,
  LogOut,
  Folder,
  Home,
  Settings,
  FileText,
  PanelBottom,
  ShoppingBag,
  ChevronDown,
  Palette,
  Store,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isNavGroup(entry: NavEntry): entry is NavGroup {
  return 'items' in entry;
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, isLoading } = useAuth();

  // Estados para grupos expandidos
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    catalogo: location.pathname.includes('/productos') || location.pathname.includes('/categorias'),
    diseno: location.pathname.includes('/home') || location.pathname.includes('/paginas') || location.pathname.includes('/footer') || location.pathname.includes('/menu'),
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const navEntries: NavEntry[] = [
    // Dashboard principal (opcional, puedes quitarlo si no lo necesitas)
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },

    // 1. Pedidos
    { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },

    // 2. Catálogo (grupo)
    {
      label: "Catálogo",
      icon: Store,
      items: [
        { href: "/admin/productos", label: "Productos", icon: Package },
        { href: "/admin/categorias", label: "Categorías", icon: Folder },
      ],
    },

    // 3. Diseño (grupo)
    {
      label: "Diseño",
      icon: Palette,
      items: [
        { href: "/admin/home", label: "Editar Inicio", icon: Home },
        { href: "/admin/paginas", label: "Páginas", icon: FileText },
        { href: "/admin/footer", label: "Navegación", icon: PanelBottom },
      ],
    },

    // 4. Configuración
    { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  ];

  // Componente para renderizar un item de navegación
  const NavItemComponent = ({ item, nested = false }: { item: NavItem; nested?: boolean }) => (
    <NavLink
      to={item.href}
      end={item.href === "/admin"}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
          nested && "pl-9",
          isActive ? "bg-muted text-primary" : "text-muted-foreground"
        )
      }
    >
      <item.icon className="h-4 w-4" />
      {item.label}
    </NavLink>
  );

  // Componente para renderizar un grupo
  const NavGroupComponent = ({ group, groupKey }: { group: NavGroup; groupKey: string }) => {
    const isExpanded = expandedGroups[groupKey];
    const hasActiveChild = group.items.some(item => location.pathname.startsWith(item.href));

    return (
      <Collapsible open={isExpanded} onOpenChange={() => toggleGroup(groupKey)}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all hover:text-primary",
              hasActiveChild ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <group.icon className="h-4 w-4" />
              {group.label}
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pt-1">
          {group.items.map((item) => (
            <NavItemComponent key={item.href} item={item} nested />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  // Componente del Sidebar
  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-15 lg:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span className="">Mi E-commerce</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
          {navEntries.map((entry) => {
            if (isNavGroup(entry)) {
              const groupKey = entry.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              return <NavGroupComponent key={groupKey} group={entry} groupKey={groupKey} />;
            }
            return <NavItemComponent key={entry.href} item={entry} />;
          })}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

      {/* SIDEBAR DESKTOP */}
      <div className="hidden border-r bg-muted/40 md:block">
        <SidebarContent />
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="flex flex-col">

        {/* HEADER SUPERIOR */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-15 lg:px-6">

          {/* MENU HAMBURGUESA (SOLO MOBILE) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          {/* PARTE DERECHA DEL HEADER (USUARIO) */}
          <div className="w-full flex-1">
            {/* Aquí podrías poner un buscador global */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || "AD"}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.email || "Mi Cuenta"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Soporte</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={handleSignOut}
                disabled={isLoading}
              >
                <LogOut className="mr-2 h-4 w-4" /> Salir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* AQUÍ SE RENDERIZAN LAS PÁGINAS HIJAS */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}