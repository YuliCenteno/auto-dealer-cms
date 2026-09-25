import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Car, RefreshCw, BadgeDollarSign, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import VehicleCard from '@/components/VehicleCard.jsx';
import ServiceCard from '@/components/ServiceCard.jsx';
import BlogCard from '@/components/BlogCard.jsx';
import VehicleSearchFilter from '@/components/VehicleSearchFilter.jsx';
import AnimatedCounter from '@/components/AnimatedCounter.jsx';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton.jsx';

import { supabase } from '@/lib/supabase';

function HomePage() {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  useEffect(() => {
    async function fetchFeaturedVehicles() {
      try {
        setLoadingVehicles(true);
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('id', { ascending: false });

        if (error) {
          console.error('Error al cargar vehículos destacados:', error.message);
        } else if (data) {
          const featured = data.filter((item) => item.featured === true);
          if (featured.length > 0) {
            setFeaturedVehicles(featured.slice(0, 6));
          } else {
            setFeaturedVehicles(data.slice(0, 6));
          }
        }
      } catch (err) {
        console.error('Error en la petición:', err);
      } finally {
        setLoadingVehicles(false);
      }
    }

    fetchFeaturedVehicles();
  }, []);

  const services = [
    {
      icon: Car,
      title: 'Venta de Usados y Seleccionados',
      description: 'Contamos con un stock variado de vehículos inspeccionados y listos para transferir con documentación al día.'
    },
    {
      icon: RefreshCw,
      title: 'Tomamos tu Usado (Permuta)',
      description: 'Tasamos tu auto en el acto para que lo entregues como parte de pago y te lleves tu próximo vehículo sin vueltas.'
    },
    {
      icon: BadgeDollarSign,
      title: 'Financiación a Medida',
      description: 'Planes de financiación en cuotas fijas o en pesos adaptados a tu presupuesto, solo con DNI y entrega inmediata.'
    },
    {
      icon: ShieldCheck,
      title: 'Gestoría y Gestiones',
      description: 'Nos encargamos de toda la tramitación de transferencia para que te lleves el vehículo 100% a tu nombre y sin sorpresas.'
    }
  ];

  const blogArticles = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      title: 'Qué revisar antes de comprar un auto usado',
      excerpt: 'Guía práctica para inspeccionar el estado del motor, chapa, pintura y verificar el historial de mantenimiento.',
      date: '15 de mayo, 2026'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
      title: 'Documentación clave para transferir un vehículo',
      excerpt: 'Conocé los formularios e informes de dominio indispensables para concretar una compra segura.',
      date: '8 de mayo, 2026'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      title: 'Cómo cotizar tu auto usado al mejor precio',
      excerpt: 'Consejos para preparar tu vehículo antes de entregarlo en permuta o venderlo de forma particular.',
      date: '2 de mayo, 2026'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      title: 'Ventajas de financiar tu próximo auto',
      excerpt: 'Analizamos las opciones de cuotas fijas y cómo aprovechar tu capital al cambiar de modelo.',
      date: '28 de abril, 2026'
    }
  ];

  const faqs = [
    {
      question: '¿Qué documentación necesito para comprar un vehículo?',
      answer: 'Solo necesitás tu DNI. Nos encargamos de realizar la verificación policial, informe de dominio, libre deuda de multas y la transferencia correspondiente.'
    },
    {
      question: '¿Aceptan autos o motos en parte de pago (permuta)?',
      answer: 'Sí, tomamos vehículos usados de todas las marcas. Realizamos una inspección física y documentación en nuestra agencia para darte una cotización justa en el momento.'
    },
    {
      question: '¿Cómo funcionan los planes de financiación?',
      answer: 'Podés financiar hasta el 50% del valor del auto con un anticipo inicial. Trabajamos con cuotas fijas y los mínimos requisitos del mercado.'
    },
    {
      question: '¿Los autos cuentan con garantía o revisión?',
      answer: 'Todos nuestros vehículos son peritados técnicamente antes de ser publicados, garantizando su correcto funcionamiento y la legitimidad de su documentación.'
    },
    {
      question: '¿Puedo reservar un vehículo desde la web?',
      answer: 'Sí, podés contactarnos directamente a nuestro WhatsApp para pedir más fotos, videos o coordinar una seña para congelar el precio y reservar el auto.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Motors - Encontrá tu próximo auto usado o 0km</title>
        <meta name="description" content="Venta de vehículos usados y seleccionados. Cotizaciones en el acto, financiación y permutas al mejor precio del mercado." />
      </Helmet>

      <Header />
      <FloatingWhatsAppButton />

      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
            alt="Hero Concesionaria"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Encontrá el auto ideal para tu próximo viaje
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Vehículos seleccionados, llave en mano y la mejor financiación para que salgas manejando hoy.
          </p>

          <div className="mt-8">
            <VehicleSearchFilter />
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif', textWrap: 'balance' }}>
              Vehículos destacados
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Selección de las mejores unidades disponibles en stock
            </p>
          </motion.div>

          {loadingVehicles ? (
            <div className="flex justify-center items-center py-16 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Cargando vehículos destacados...</span>
            </div>
          ) : featuredVehicles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hay vehículos disponibles por el momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="transition-all duration-200 active:scale-[0.98]">
              <Link to="/vehiculos">
                Ver todo el catálogo de autos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: 'Playfair Display, serif', textWrap: 'balance' }}>
                Trayectoria y respaldo en cada operación
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Nos especializamos en la comercialización de vehículos usados seleccionados y 0km. Brindamos una experiencia transparente, ágil y segura para que cambies tu auto con total confianza.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ya sea que busques entregar tu usado en parte de pago, acceder a un plan de cuotas o conseguir una unidad en particular, nuestro equipo te acompaña desde el primer contacto hasta la entrega de la llave.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter end={650} suffix="+" />
                </div>
                <div className="text-muted-foreground">Vehículos entregados</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter end={1400} suffix="+" />
                </div>
                <div className="text-muted-foreground">Clientes satisfechos</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter end={10} />
                </div>
                <div className="text-muted-foreground">Años en el rubro</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter end={320} suffix="+" />
                </div>
                <div className="text-muted-foreground">Permutas realizadas</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif', textWrap: 'balance' }}>
              Nuestros servicios
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Soluciones integrales para la compra, venta y financiación de tu auto
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif', textWrap: 'balance' }}>
              Novedades del sector automotor
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Guías, consejos e información útil para el cuidado y compra de vehículos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogArticles.map((article, index) => (
              <BlogCard key={article.id} article={article} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="transition-all duration-200 active:scale-[0.98]">
              <Link to="/blog">
                Ver todos los artículos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif', textWrap: 'balance' }}>
              Preguntas frecuentes
            </h2>
            <p className="text-lg text-muted-foreground">
              Respuestas a las dudas más comunes antes de comprar o vender tu auto
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-xl px-6 border-0 shadow-sm">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;