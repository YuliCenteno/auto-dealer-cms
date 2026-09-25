import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Vehículos', path: '/vehiculos' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Cotizá tu Usado', path: '/cotizar' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contacto', path: '/contacto' }
  ];

  const whatsappUrl = 'https://wa.me/5491112345678?text=Hola,%20quisiera%20recibir%20informaci%C3%B3n%20sobre%20sus%20veh%C3%ADculos%20disponibles.';

  const handleWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };
  
  // Determinar si debemos usar el estilo transparente u oscuro (solo en Home sin hacer scroll)
  const isTransparent = isHome && !isScrolled;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-2'
          : 'bg-white/95 backdrop-blur-md shadow-md py-0 border-b border-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span
              className={`text-2xl font-bold transition-colors duration-200 ${
                isTransparent ? 'text-white' : 'text-primary'
              }`}
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Motors
            </span>
          </Link>

          {/* Menú Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-all duration-200 relative ${
                    isTransparent
                      ? isActive
                        ? 'text-white font-bold'
                        : 'text-white/90 hover:text-white'
                      : isActive
                      ? 'text-primary font-semibold'
                      : 'text-foreground/80 hover:text-primary'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                        isTransparent ? 'bg-white' : 'bg-primary'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Botón WhatsApp Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              onClick={handleWhatsApp}
              className="bg-[#25D366] text-white hover:bg-[#20BA5A] transition-all duration-200 active:scale-[0.98]"
            >
              <svg 
                className="w-4 h-4 mr-2 fill-current" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.238-6.163-3.486-8.411"/>
              </svg>
              WhatsApp
            </Button>
          </div>

          {/* Menú Mobile */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={isTransparent ? 'text-white hover:bg-white/10' : ''}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'text-primary'
                        : 'text-foreground/80 hover:text-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button
                  asChild
                  className="mt-4 transition-all duration-200 active:scale-[0.98]"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contactar por WhatsApp
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </motion.header>
  );
}

export default Header;