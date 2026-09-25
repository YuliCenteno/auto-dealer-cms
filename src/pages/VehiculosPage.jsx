import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search, Loader2, RotateCcw } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import VehicleCard from '@/components/VehicleCard.jsx';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton.jsx';

import { supabase } from '@/lib/supabase';
import { parsePriceNumber } from '@/lib/utils';

const normalizeText = (text) => {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

function VehiculosPage() {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de los Filtros
  const [condition, setCondition] = useState('todos'); // todos | nuevo | usado
  const [brand, setBrand] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [vehicleType, setVehicleType] = useState('all'); // auto | camioneta | suv | moto
  const [sortBy, setSortBy] = useState('recent');

  // Sincronizar los estados con los Query Params de la URL al cargar
  useEffect(() => {
    const cond = searchParams.get('cond');
    const br = searchParams.get('brand');
    const q = searchParams.get('q');

    if (cond) setCondition(cond);
    if (br) setBrand(br);
    if (q) setSearchTerm(q);
  }, [searchParams]);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .neq('status', 'borrador')
          .order('id', { ascending: false });

        if (error) {
          console.error('Error cargando vehículos:', error.message);
        } else {
          setVehicles(data || []);
        }
      } catch (err) {
        console.error('Error en la petición:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  const handleResetFilters = () => {
    setCondition('todos');
    setBrand('all');
    setSearchTerm('');
    setPriceRange([0, 100000000]);
    setVehicleType('all');
    setSortBy('recent');
  };

  // Lógica de filtrado
  const filteredVehicles = vehicles.filter((item) => {
    // Filtro por Condición (Nuevo / Usado)
    if (condition && condition !== 'todos' && item.condition) {
      if (normalizeText(item.condition) !== normalizeText(condition)) return false;
    }

    // Filtro por Marca
    if (brand && brand !== 'all') {
      const itemBrand = normalizeText(item.brand || '');
      if (!itemBrand.includes(normalizeText(brand))) return false;
    }

    // Filtro por Tipo de Vehículo
    if (vehicleType && vehicleType !== 'all') {
      const itemType = normalizeText(item.type || item.body_type || '');
      if (!itemType.includes(normalizeText(vehicleType))) return false;
    }

    // Búsqueda por palabra clave (Marca, Modelo o Título)
    if (searchTerm.trim() !== '') {
      const title = normalizeText(item.title || '');
      const itemBrand = normalizeText(item.brand || '');
      const model = normalizeText(item.model || '');
      const search = normalizeText(searchTerm);
      
      if (!title.includes(search) && !itemBrand.includes(search) && !model.includes(search)) {
        return false;
      }
    }

    // Rango de precio
    const numericPrice = parsePriceNumber(item.price);
    if (numericPrice > 0 && (numericPrice < priceRange[0] || numericPrice > priceRange[1])) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    const priceA = parsePriceNumber(a.price);
    const priceB = parsePriceNumber(b.price);

    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'year-desc') return (b.year || 0) - (a.year || 0);
    if (sortBy === 'km-asc') return (a.mileage || 0) - (b.mileage || 0);
    
    return b.id - a.id;
  }); 

  return (
    <>
      <Helmet>
        <title>Catálogo de Vehículos - Concesionaria</title>
        <meta name="description" content="Explorá nuestro catálogo completo de autos, camionetas y usados seleccionados." />
      </Helmet>

      <Header />
      <FloatingWhatsAppButton />

      <div className="pt-20">
        {/* Banner */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em', textWrap: 'balance' }}>
              Todos los Vehículos
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Encontrá tu próximo auto entre nuestra selección exclusiva de vehículos.
            </p>
          </div>
        </section>

        {/* Panel de Filtros */}
        <section className="py-12 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="space-y-6">
                
                {/* Condición: Todos / Nuevos / Usados */}
                <div className="flex justify-center">
                  <ToggleGroup
                    type="single"
                    value={condition}
                    onValueChange={(value) => value && setCondition(value)}
                    className="bg-muted rounded-lg p-1"
                  >
                    <ToggleGroupItem
                      value="todos"
                      className="px-6 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all duration-200"
                    >
                      Todos
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="nuevo"
                      className="px-6 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all duration-200"
                    >
                      0km
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="usado"
                      className="px-6 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-all duration-200"
                    >
                      Usados
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Filtros Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Marca */}
                  <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder="Marca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las marcas</SelectItem>
                      <SelectItem value="ford">Ford</SelectItem>
                      <SelectItem value="chevrolet">Chevrolet</SelectItem>
                      <SelectItem value="volkswagen">Volkswagen</SelectItem>
                      <SelectItem value="toyota">Toyota</SelectItem>
                      <SelectItem value="peugeot">Peugeot</SelectItem>
                      <SelectItem value="renault">Renault</SelectItem>
                      <SelectItem value="fiat">Fiat</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Búsqueda general */}
                  <Input
                    type="text"
                    placeholder="Buscar marca, modelo o versión"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-foreground"
                  />

                  {/* Tipo de carrocería */}
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder="Tipo de vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="sedan">Sedán</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="suv">SUV / Crossover</SelectItem>
                      <SelectItem value="pickup">Pick-up / Camioneta</SelectItem>
                      <SelectItem value="moto">Moto</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Botón de Reset */}
                  <Button 
                    variant="outline"
                    onClick={handleResetFilters} 
                    className="transition-all duration-200"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Limpiar Filtros
                  </Button>
                </div>

                {/* Slider Rango de Precio */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Rango de precio</span>
                    <span className="font-medium text-foreground">
                      ARS ${priceRange[0].toLocaleString('es-AR')} - ARS ${priceRange[1].toLocaleString('es-AR')}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 100000000]}
                    value={priceRange}
                    onValueChange={(val) => setPriceRange(val)}
                    min={0}
                    max={100000000}
                    step={100000}
                    minStepsBetweenThumbs={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grilla de Resultados */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <p className="text-muted-foreground">
                Mostrando {filteredVehicles.length} de {vehicles.length} vehículos
              </p>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] text-foreground">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Más recientes</SelectItem>
                  <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                  <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                  <SelectItem value="year-desc">Año: más nuevos primero</SelectItem>
                  <SelectItem value="km-asc">Menor kilometraje</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mr-2" />
                <span>Cargando vehículos...</span>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                No se encontraron vehículos que coincidan con los filtros seleccionados.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} item={vehicle} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default VehiculosPage;