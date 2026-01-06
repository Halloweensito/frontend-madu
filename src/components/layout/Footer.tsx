import { Cat, Instagram, Facebook, Send } from 'lucide-react';

export const Footer = () => {
  return (
    // bg-stone-50 da un tono crema muy suave y elegante, mejor que el blanco puro
    <footer className="bg-stone-50 text-stone-600 pt-20 pb-10 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- SECCIÓN SUPERIOR --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* 1. MARCA E IDENTIDAD */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {/* El Gato - Logo */}
              <Cat strokeWidth={1.5} className="w-8 h-8 text-black" />
              {/* Tipografía con tracking amplio para elegancia */}
              <span className="text-2xl font-light tracking-[0.2em] text-black">
                PUSSYCAT
              </span>
            </div>
            <p className="text-sm font-light leading-relaxed text-stone-500 pr-4">
              Lencería de diseño pensada para empoderar tu sensualidad.
              Telas delicadas, cortes atrevidos y la elegancia que mereces.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2 border border-stone-200 rounded-full hover:bg-black hover:text-white transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 border border-stone-200 rounded-full hover:bg-black hover:text-white transition-all duration-300">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* 2. EXPLORAR */}
          <div>
            <h3 className="text-black font-medium tracking-widest text-sm uppercase mb-6">Colecciones</h3>
            <ul className="space-y-4 text-sm font-light">
              <li><a href="#" className="hover:text-black hover:translate-x-1 inline-block transition-transform">Lencería Fina</a></li>
              <li><a href="#" className="hover:text-black hover:translate-x-1 inline-block transition-transform">Sleepwear</a></li>
              <li><a href="#" className="hover:text-black hover:translate-x-1 inline-block transition-transform">Accesorios</a></li>
              <li><a href="#" className="hover:text-black hover:translate-x-1 inline-block transition-transform">Best Sellers</a></li>
            </ul>
          </div>

          {/* 3. ATENCIÓN AL CLIENTE */}
          <div>
            <h3 className="text-black font-medium tracking-widest text-sm uppercase mb-6">Ayuda</h3>
            <ul className="space-y-4 text-sm font-light">
              <li><a href="#" className="hover:text-black hover:underline decoration-stone-300 underline-offset-4 transition-all">Guía de Talles</a></li>
              <li><a href="#" className="hover:text-black hover:underline decoration-stone-300 underline-offset-4 transition-all">Envíos y Devoluciones</a></li>
              <li><a href="#" className="hover:text-black hover:underline decoration-stone-300 underline-offset-4 transition-all">Cuidado de las prendas</a></li>
              <li><a href="#" className="hover:text-black hover:underline decoration-stone-300 underline-offset-4 transition-all">Contacto</a></li>
            </ul>
          </div>

          {/* 4. NEWSLETTER (Diseño Minimalista) */}
          <div>
            <h3 className="text-black font-medium tracking-widest text-sm uppercase mb-6">Pussycat Club</h3>
            <p className="text-sm font-light text-stone-500 mb-6">
              Suscríbete para recibir novedades exclusivas y un 10% OFF en tu primera compra.
            </p>

            <form className="relative group">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full bg-transparent border-b border-stone-300 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder-stone-400"
              />
              <button
                type="button"
                className="absolute right-0 top-3 text-stone-400 hover:text-black transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </div>

        </div>

        {/* --- BARRA INFERIOR --- */}
        <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-stone-400">
          <p>&copy; {new Date().getFullYear()} PUSSYCAT. Todos los derechos reservados.</p>
          <p>
            Desarrollado por{' '}
            <a
              href="https://github.com/Halloweensito"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors underline underline-offset-2"
            >
              Osiris M. Corrales
            </a>
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-black transition-colors">Privacidad</a>
            <a href="#" className="hover:text-black transition-colors">Términos</a>
          </div>
        </div>

      </div>
    </footer>
  );
};