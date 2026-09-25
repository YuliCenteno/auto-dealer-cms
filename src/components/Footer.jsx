import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <span className="text-2xl font-bold mb-4 block" style={{ fontFamily: 'Playfair Display, serif' }}>
              Motors
            </span>
            <p className="text-primary-foreground/80 leading-relaxed">
              Tu concesionaria de confianza. Más de 15 años brindando las mejores opciones en vehículos usados y 0km seleccionados.
            </p>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Menú</span>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200">
                Inicio
              </Link>
              <Link to="/vehiculos" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200">
                Vehículos
              </Link>
              <Link to="/cotizar" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200">
                Cotizá tu Usado
              </Link>
              <Link to="/nosotros" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200">
                Nosotros
              </Link>
              <Link to="/contacto" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200">
                Contacto
              </Link>
            </nav>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Contacto</span>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2 text-primary-foreground/80">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Buenos Aires, Argentina</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+54 9 11 1234-5678</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>contacto@motors.com.ar</span>
              </div>
            </div>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Síguenos</span>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <p className="text-primary-foreground/80 text-sm">
              © {currentYear} Motors. Todos los derechos reservados.
            </p>
            <p className="text-primary-foreground/80 text-sm">
              Desarrollado por{' '}
              <a
                href="https://github.com/Yulicenteno"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary-foreground transition-colors duration-200"
              >
                ZCS Systems
              </a>
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/privacidad" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200">
              Política de Privacidad
            </Link>
            <Link to="/terminos" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;