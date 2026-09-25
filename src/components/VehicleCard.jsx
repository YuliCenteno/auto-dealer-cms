import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Gauge, Fuel, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { parsePriceNumber } from '@/lib/utils';

// Configuración de colores para los estados
const STATUS_CONFIG = {
  disponible: { label: 'Disponible', className: 'bg-emerald-600 text-white' },
  reservado: { label: 'Reservado', className: 'bg-amber-500 text-white' },
  reservada: { label: 'Reservado', className: 'bg-amber-500 text-white' },
  vendido: { label: 'Vendido', className: 'bg-red-600 text-white' },
  vendida: { label: 'Vendido', className: 'bg-red-600 text-white' },
  borrador: { label: 'Borrador', className: 'bg-gray-600 text-white' },
};

function VehicleCard({ vehicle, property, item: itemProp, index = 0 }) {
  // 1. Prioriza 'vehicle', luego 'property', o 'item' (soporta cualquier forma en que lo pases)
  const item = vehicle || property || itemProp || {};

  // 2. Si no hay datos en 'item', no renderizar nada o evitar fallos
  if (!item || Object.keys(item).length === 0) {
    return null;
  }

  // 3. Fallback de imagen (soporta array de imágenes de Supabase o string de imagen única)
  const defaultImage = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80';
  
  const cardImage = 
    (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null) || 
    item.image_url || 
    item.image || 
    defaultImage;

  // Manejo de precio
  const priceValue = item.price_cash !== undefined && item.price_cash !== null ? item.price_cash : item.price;
  const numericPrice = parsePriceNumber(priceValue || 0);
  const formattedPrice = numericPrice.toLocaleString('es-AR');
  const currencyCode = item.currency || 'USD';

  const statusKey = item.status ? item.status.toLowerCase() : 'disponible';
  const currentStatus = STATUS_CONFIG[statusKey] || STATUS_CONFIG.disponible;

  // Formato para kilometraje
  const formattedKm = item.kilometers !== undefined && item.kilometers !== null
    ? Number(item.kilometers).toLocaleString('es-AR') 
    : item.km !== undefined && item.km !== null
      ? Number(item.km).toLocaleString('es-AR') 
      : null;

  const titleText = item.title || `${item.brand || ''} ${item.model || ''}`.trim() || 'Vehículo sin título';

  const whatsappMessage = encodeURIComponent(
    `Hola, me gustaría consultar por el vehículo: ${titleText} (Precio: ${currencyCode} $${formattedPrice})`
  );

  const whatsappUrl = `https://wa.me/5491112345678?text=${whatsappMessage}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={cardImage}
            alt={titleText}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />

          {/* ETIQUETA DE ESTADO */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold shadow-md backdrop-blur-sm ${currentStatus.className}`}>
              {currentStatus.label}
            </span>
          </div>

          {/* DESTACADO */}
          {item.featured && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-amber-500 text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-md backdrop-blur-sm">
                Destacado
              </span>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-6">
          {/* MARCA Y TRANSMISIÓN / COMBUSTIBLE */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {item.brand && (
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded capitalize">
                {item.brand}
              </span>
            )}
            {item.transmission && (
              <span className="inline-block bg-secondary text-secondary-foreground text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                {item.transmission}
              </span>
            )}
            {item.fuel && (
              <span className="inline-block bg-muted text-muted-foreground text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                {item.fuel}
              </span>
            )}
          </div>

          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-foreground leading-tight line-clamp-2">
              {titleText}
            </h3>
          </div>

          {/* ESPECIFICACIONES TÉCNICAS */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            {item.year && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium text-foreground">{item.year}</span>
              </div>
            )}
            {formattedKm !== null && (
              <div className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium text-foreground">{formattedKm} km</span>
              </div>
            )}
            {item.transmission && (
              <div className="flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-primary shrink-0" />
                <span>{item.transmission}</span>
              </div>
            )}
            {item.fuel && (
              <div className="flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-primary shrink-0" />
                <span>{item.fuel}</span>
              </div>
            )}
          </div>

          {/* PRECIO */}
          <div className="mt-auto">
            <span className="text-xs text-muted-foreground block font-medium mb-0.5">Precio Contado</span>
            <div className="text-2xl font-black text-primary">
              {currencyCode === 'USD' ? 'u$s ' : '$'}
              {formattedPrice}
            </div>
            {item.advance_payment && (
              <span className="text-xs text-emerald-600 font-semibold block mt-1">
                O anticipo desde {currencyCode === 'USD' ? 'u$s ' : '$'}{Number(item.advance_payment).toLocaleString('es-AR')}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex gap-3 mt-auto">
          <Button asChild variant="outline" className="w-full">
            <Link to={`/vehiculos/${item.id}`}>
              Ver Ficha
            </Link>
          </Button> 
          <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Consultar
            </a>
          </Button>
        </CardFooter>
      </Card> 
    </motion.div>
  );
}

export default VehicleCard; 