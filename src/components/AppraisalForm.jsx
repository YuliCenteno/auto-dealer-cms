import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

function AppraisalForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const submissions = JSON.parse(localStorage.getItem('appraisalSubmissions') || '[]');
    submissions.push({
      ...data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('appraisalSubmissions', JSON.stringify(submissions));
    
    toast.success('Solicitud enviada correctamente. Nos contactaremos pronto con la cotización de tu vehículo.');
    reset();
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Datos Personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Juan Pérez"
            className="text-foreground"
            {...register('nombre', { required: 'El nombre es requerido' })}
          />
          {errors.nombre && (
            <p className="text-sm text-destructive">{errors.nombre.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono / WhatsApp</Label>
          <Input
            id="telefono"
            type="tel"
            placeholder="+54 9 11 1234-5678"
            className="text-foreground"
            {...register('telefono', { required: 'El teléfono es requerido' })}
          />
          {errors.telefono && (
            <p className="text-sm text-destructive">{errors.telefono.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="juan@ejemplo.com"
          className="text-foreground"
          {...register('email', { 
            required: 'El email es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          })}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Datos del Vehículo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="marcaModelo">Marca y Modelo</Label>
          <Input
            id="marcaModelo"
            type="text"
            placeholder="Ej: Volkswagen Gol Trend 1.6"
            className="text-foreground"
            {...register('marcaModelo', { required: 'La marca y modelo son requeridos' })}
          />
          {errors.marcaModelo && (
            <p className="text-sm text-destructive">{errors.marcaModelo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="anio">Año</Label>
          <Input
            id="anio"
            type="number"
            placeholder="Ej: 2018"
            className="text-foreground"
            {...register('anio', { required: 'El año es requerido' })}
          />
          {errors.anio && (
            <p className="text-sm text-destructive">{errors.anio.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="kilometros">Kilometraje</Label>
          <Input
            id="kilometros"
            type="number"
            placeholder="Ej: 85000"
            className="text-foreground"
            {...register('kilometros', { required: 'El kilometraje es requerido' })}
          />
          {errors.kilometros && (
            <p className="text-sm text-destructive">{errors.kilometros.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmision">Transmisión</Label>
          <Select onValueChange={(value) => setValue('transmision', value)}>
            <SelectTrigger id="transmision" className="text-foreground">
              <SelectValue placeholder="Seleccionar transmisión" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="automatica">Automática</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mensaje">Estado general y detalles adicionales</Label>
        <Textarea
          id="mensaje"
          placeholder="Comentanos sobre el estado del auto, si tiene service al día, detalles de pintura o equipamiento..."
          rows={4}
          className="text-foreground resize-none"
          {...register('mensaje')}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full transition-all duration-200 active:scale-[0.98]"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enviando...' : 'Cotizar Mi Auto'}
      </Button>
    </form>
  );
}

export default AppraisalForm;