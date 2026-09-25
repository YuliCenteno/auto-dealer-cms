import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

function VehicleSearchFilter() {
  const navigate = useNavigate();
  const [condition, setCondition] = useState('todos');
  const [brand, setBrand] = useState('all');
  const [bodyType, setBodyType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (condition && condition !== 'todos') params.append('condition', condition);
    if (brand && brand !== 'all') params.append('brand', brand);
    if (bodyType && bodyType !== 'all') params.append('body', bodyType);
    if (searchQuery.trim()) params.append('q', searchQuery.trim());

    navigate(`/vehiculos?${params.toString()}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 md:p-4 max-w-4xl mx-auto border border-white/20 text-left">
      {/* Condición del vehículo (Pestañas Usado / 0km) */}
      <div className="flex gap-2 mb-3 px-1">
        <button
          type="button"
          onClick={() => setCondition('todos')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            condition === 'todos'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted/60 text-muted-foreground hover:bg-muted'
          }`}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => setCondition('usado')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            condition === 'usado'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted/60 text-muted-foreground hover:bg-muted'
          }`}
        >
          Usados
        </button>
        <button
          type="button"
          onClick={() => setCondition('0km')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            condition === '0km'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted/60 text-muted-foreground hover:bg-muted'
          }`}
        >
          0km
        </button>
      </div>

      {/* Formulario rápido de búsqueda */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
        {/* Selector de Marca */}
        <div className="md:col-span-3">
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger className="w-full bg-background border-muted h-11 text-foreground">
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              <SelectItem value="volkswagen">Volkswagen</SelectItem>
              <SelectItem value="ford">Ford</SelectItem>
              <SelectItem value="chevrolet">Chevrolet</SelectItem>
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="peugeot">Peugeot</SelectItem>
              <SelectItem value="fiat">Fiat</SelectItem>
              <SelectItem value="renault">Renault</SelectItem>
              <SelectItem value="honda">Honda</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selector de Tipo de Carrocería */}
        <div className="md:col-span-3">
          <Select value={bodyType} onValueChange={setBodyType}>
            <SelectTrigger className="w-full bg-background border-muted h-11 text-foreground">
              <SelectValue placeholder="Carrocería" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las carrocerías</SelectItem>
              <SelectItem value="sedan">Sedán</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="pickup">Pick-Up</SelectItem>
              <SelectItem value="coupe">Coupé</SelectItem>
              <SelectItem value="utilitario">Utilitario</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Búsqueda por modelo o palabra clave */}
        <div className="md:col-span-4">
          <Input
            type="text"
            placeholder="Buscar por modelo, año..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border-muted h-11 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Botón Buscar */}
        <div className="md:col-span-2">
          <Button type="submit" className="w-full h-11 font-medium shadow-md">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default VehicleSearchFilter;