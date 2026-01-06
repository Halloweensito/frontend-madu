import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { TextAlignJustify, Search, User, LogOut, Settings } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { SidebarMenu } from './SidebarMenu.tsx'; // Asegúrate que la ruta sea correcta
import { Cart } from '@/components/cart/Cart';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false); // ✨ Nuevo estado para scroll
    
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut, isAdmin } = useAuth();

    const isProductPage = location.pathname.startsWith('/producto/');

    // ✨ EFECTO DE SCROLL: Detectar cuando el usuario baja
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    // 🎨 CLASES DINÁMICAS:
    // 1. Si es Product Page y NO hay scroll: Transparente (para que se vea la foto de fondo)
    // 2. Si hay scroll o es otra página: Fondo sólido/blur (para leer el texto)
    const getNavbarBackground = () => {
        if (isProductPage && !isScrolled) {
            return 'bg-transparent border-transparent';
        }
        return 'bg-white/80 backdrop-blur-md border-stone-200 shadow-sm';
    };

    return (
        <>
            <nav className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 border-b ${getNavbarBackground()}`}>
                <div className='mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20 text-stone-800'>

                    {/* IZQUIERDA: Menú Hamburguesa */}
                    <div className='flex-1 flex justify-start'>
                        <button
                            type="button"
                            className='focus:outline-none cursor-pointer hover:bg-black/5 rounded-full p-2 transition-colors'
                            onClick={toggleMenu}
                            aria-label="Abrir menú"
                        >
                            <TextAlignJustify strokeWidth={1.5} size={24} />
                        </button>
                    </div>

                    {/* CENTRO: Logo */}
                    <Link
                        to="/"
                        className='font-light text-2xl tracking-[0.25em] uppercase cursor-pointer text-black select-none hover:opacity-70 transition-opacity'
                    >
                        Pussycat
                    </Link>

                    {/* DERECHA: Acciones */}
                    <div className='flex-1 flex justify-end items-center gap-2 sm:gap-6 text-stone-600'>
                        
                        {/* Search Icon - Oculto en móvil (asumiendo que está en el Sidebar) */}
                        <Link
                            to="/search"
                            className="hidden sm:block p-2 hover:bg-black/5 rounded-full transition-colors"
                            aria-label="Buscar"
                        >
                            <Search strokeWidth={1.5} size={22} />
                        </Link>

                        {/* User / Login Logic */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="focus:outline-none rounded-full ring-offset-2 hover:ring-2 ring-stone-200 transition-all">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user.user_metadata?.avatar_url} />
                                            <AvatarFallback className="bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200">
                                                {/* ✨ Safe check para email */}
                                                {user.email?.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-2">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">Mi Cuenta</p>
                                            <p className="text-xs leading-none text-muted-foreground truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    {isAdmin && (
                                        <>
                                            <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                                                <Settings className="mr-2 h-4 w-4" />
                                                Panel de Admin
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}

                                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Cerrar Sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden sm:block p-2 hover:bg-black/5 rounded-full transition-colors"
                                aria-label="Iniciar sesión"
                            >
                                <User strokeWidth={1.5} size={22} />
                            </Link>
                        )}

                        {/* Carrito */}
                        <Cart />
                    </div>
                </div>
            </nav>

            <SidebarMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};