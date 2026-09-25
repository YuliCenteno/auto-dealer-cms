import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push({
      ...data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    toast.success('Mensaje enviado correctamente. Te responderemos pronto.');
    reset();
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Tu nombre"
            className="text-foreground"
            {...register('nombre', { required: 'El nombre es requerido' })}
          />
          {errors.nombre && (
            <p className="text-sm text-destructive">{errors.nombre.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
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

      <div className="space-y-2">
        <Label htmlFor="asunto">Asunto</Label>
        <Input
          id="asunto"
          type="text"
          placeholder="¿En qué podemos ayudarte?"
          className="text-foreground"
          {...register('asunto', { required: 'El asunto es requerido' })}
        />
        {errors.asunto && (
          <p className="text-sm text-destructive">{errors.asunto.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mensaje">Mensaje</Label>
        <Textarea
          id="mensaje"
          placeholder="Escribe tu mensaje aquí..."
          rows={5}
          className="text-foreground resize-none"
          {...register('mensaje', { required: 'El mensaje es requerido' })}
        />
        {errors.mensaje && (
          <p className="text-sm text-destructive">{errors.mensaje.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full transition-all duration-200 active:scale-[0.98]"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
      </Button>
    </form>
  );
}

export default ContactForm;