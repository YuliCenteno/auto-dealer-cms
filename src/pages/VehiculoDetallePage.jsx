import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { parsePriceNumber } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  Cog, 
  ArrowLeft, 
  Share2, 
  Loader2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Maximize2,
  X
} from 'lucide-react';
import { toast } from 'sonner';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function VehiculoDetallePage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error al cargar el vehículo:', error);
      } else {
        setVehicle(data);
      }
      setLoading(false);
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <div className="text-center py-20 my-auto">
          <h2 className="text-2xl font-bold mb-4">Vehículo no encontrado</h2>
          <Button asChild>
            <Link to="/vehiculos">Volver al catálogo</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const galleryImages = (vehicle.images && vehicle.images.length > 0) 
    ? vehicle.images 
    : [vehicle.image || vehicle.image_url || '/placeholder.jpg'];

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const numericPrice = parsePriceNumber(vehicle.price);
  const formattedPrice = numericPrice.toLocaleString('es-AR');
  const currencyCode = vehicle.currency || 'USD';

  const whatsappMessage = encodeURIComponent(
    `Hola, me interesa el vehículo "${vehicle.title || `${vehicle.brand}${vehicle.model}`}" (Ref ID: ${vehicle.id}, Precio: ${currencyCode} $${formattedPrice}). Quisiera recibir más información.`
  );
  const whatsappUrl = `https://wa.me/5491112345678?text=${whatsappMessage}`;

  const hasCoords = vehicle?.latitude && vehicle?.longitude;

  const externalMapUrl = hasCoords
    ? `https://www.google.com/maps?q=${vehicle.latitude},${vehicle.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vehicle?.location || '')}`;

  const handleShare = async () => {
    const currentUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: vehicle?.title || `${vehicle?.brand} ${vehicle?.model}`,
          text: `Mira este vehículo: ${vehicle?.title || `${vehicle?.brand}${vehicle?.model}`}`,
          url: currentUrl,
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        toast.success('¡Enlace copiado al portapapeles!');
        return;
      } catch (err) {
        console.error('Error al usar navigator.clipboard:', err);
      }
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('¡Enlace copiado al portapapeles!');
    } catch (err) {
      console.error('Error en fallback de copia:', err);
      toast.error('No se pudo copiar el enlace.');
    }
  };

  const featuresList = Array.isArray(vehicle.features) 
    ? vehicle.features 
    : Array.isArray(vehicle.equipment) 
    ? vehicle.equipment 
    : [];

  const vehicleTitle = vehicle.title || `${vehicle.brand || ''} ${vehicle.model || ''}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Link 
          to="/vehiculos" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la búsqueda
        </Link>

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {vehicle.condition && <Badge variant="secondary" className="capitalize">{vehicle.condition}</Badge>}
              {(vehicle.body_type || vehicle.category) && (
                <Badge className="capitalize">{vehicle.body_type || vehicle.category}</Badge>
              )}
              {vehicle.featured && <Badge className="bg-amber-500 text-white">Destacado</Badge>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{vehicleTitle}</h1>
            {vehicle.location && (
              <p className="flex items-center text-muted-foreground mt-2">
                <MapPin className="w-4 h-4 mr-1 text-primary" />
                {vehicle.location}
              </p>
            )}
          </div>

          <div className="text-left md:text-right">
            <span className="text-sm text-muted-foreground block">Precio</span>
            <span className="text-3xl font-extrabold text-primary">
              {currencyCode} ${formattedPrice}
            </span>
          </div>
        </div>

        {/* CARRUSEL PRINCIPAL */}
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative group w-full h-[350px] sm:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-border bg-slate-100 dark:bg-slate-900 mb-4 select-none cursor-pointer"
        >
          <img 
            src={galleryImages[currentImageIndex]} 
            alt={`${vehicleTitle} - Foto ${currentImageIndex + 1}`} 
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />

          {/* BOTÓN PANTALLA COMPLETA */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/70 hover:bg-black text-white text-xs sm:text-sm font-medium px-3 py-2 rounded-xl backdrop-blur-md transition-all duration-200 shadow-md border border-white/10"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Ver pantalla completa</span>
          </button>

          {/* Flechas de Navegación */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                aria-label="Imagen anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2.5 sm:p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNextImage}
                aria-label="Imagen siguiente"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2.5 sm:p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 right-4 z-20 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md font-medium">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            </>
          )}
        </div>

        {/* Miniaturas Sincronizadas */}
        {galleryImages.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-thin">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`relative flex-shrink-0 w-24 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                  currentImageIndex === idx ? 'border-primary ring-2 ring-primary/30 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Detalles e Información */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Ficha Técnica Principal */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-card p-6 rounded-2xl border border-border text-center shadow-sm">
              <div className="flex flex-col items-center border-r border-border last:border-r-0">
                <Calendar className="w-6 h-6 text-primary mb-1" />
                <span className="text-sm text-muted-foreground">Año</span>
                <span className="font-semibold text-lg">{vehicle.year || 'N/A'}</span>
              </div>
              <div className="flex flex-col items-center sm:border-r border-border">
                <Gauge className="w-6 h-6 text-primary mb-1" />
                <span className="text-sm text-muted-foreground">Kilometraje</span>
                <span className="font-semibold text-lg">
                  {vehicle.kilometers != null ? `${vehicle.kilometers.toLocaleString('es-AR')} km` : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col items-center border-r border-border last:border-r-0">
                <Fuel className="w-6 h-6 text-primary mb-1" />
                <span className="text-sm text-muted-foreground">Combustible</span>
                <span className="font-semibold text-lg capitalize">{vehicle.fuel_type || vehicle.fuel || 'N/A'}</span>
              </div>
              <div className="flex flex-col items-center">
                <Cog className="w-6 h-6 text-primary mb-1" />
                <span className="text-sm text-muted-foreground">Transmisión</span>
                <span className="font-semibold text-lg capitalize">{vehicle.transmission || 'N/A'}</span>
              </div>
            </div>

            {/* Equipamiento y Características */}
            {featuresList.length > 0 && (
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="text-xl font-bold mb-4">Equipamiento y Características</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {featuresList.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/60"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-sm font-medium text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Descripción */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-4">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {vehicle.description || 'Sin descripción disponible.'}
              </p>
            </div>

            {/* Mapa Interactivo */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl font-bold">Ubicación de inspección</h3>
                {vehicle.location && (
                  <Button asChild variant="outline" size="sm">
                    <a href={externalMapUrl} target="_blank" rel="noopener noreferrer">
                      Abrir en Google Maps
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
              </div>

              {hasCoords ? (
                <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-inner border bg-muted relative z-0">
                  <MapContainer
                    center={[vehicle.latitude, vehicle.longitude]}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[vehicle.latitude, vehicle.longitude]} />
                  </MapContainer>
                </div>
              ) : (
                <div className="p-4 bg-muted/50 rounded-xl text-center">
                  <p className="text-sm text-muted-foreground">
                    Ubicación: <span className="font-semibold text-foreground">{vehicle.location || 'No especificada'}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Panel Lateral de Contacto */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-md sticky top-28 space-y-6">
              <h3 className="text-xl font-bold">¿Te interesa este vehículo?</h3>
              <p className="text-sm text-muted-foreground">
                Contactate con nuestro equipo para agendar una prueba de manejo o solicitar más información.
              </p>

              <Button
                asChild
                size="lg"
                className="w-full bg-[#25D366] text-white font-semibold hover:bg-[#20BA5A] transition-all duration-200 active:scale-[0.98]"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <svg 
                    className="w-5 h-5 mr-2 fill-current" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.238-6.163-3.486-8.411"/>
                  </svg>
                  Consultar por WhatsApp
                </a>
              </Button>

              <Button variant="outline" className="w-full" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL PANTALLA COMPLETA (LIGHTBOX) */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 backdrop-blur-md"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="w-full max-w-7xl flex items-center justify-between text-white p-2 z-50">
            <span className="text-sm font-medium opacity-80">
              Foto {currentImageIndex + 1} de {galleryImages.length}
            </span>
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="relative max-w-7xl max-h-[80vh] w-full h-full flex items-center justify-center my-auto">
            <img 
              src={galleryImages[currentImageIndex]} 
              alt="Vista pantalla completa" 
              className="max-h-full max-w-full object-contain select-none shadow-2xl rounded-lg"
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-3 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white p-3 rounded-full transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto py-2 px-4 max-w-full z-50">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    currentImageIndex === idx ? 'border-white opacity-100 scale-105' : 'border-transparent opacity-40 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default VehiculoDetallePage;