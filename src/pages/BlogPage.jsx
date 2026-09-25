import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import BlogCard from '@/components/BlogCard.jsx';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton.jsx';

function BlogPage() {
  const articles = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341',
      title: 'Guía completa para comprar tu primer auto usado',
      excerpt: 'Puntos clave a revisar antes de la compra: desde la inspección mecánica y kilometraje hasta la documentación y el informe de dominio.',
      date: '15 de mayo, 2026'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
      title: 'Tendencias del mercado automotor 2026',
      excerpt: 'Análisis sobre la demanda de vehículos, tecnologías híbridas y los modelos usados con mejor valor de reventa en Argentina.',
      date: '8 de mayo, 2026'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9',
      title: 'Cómo preparar tu auto para cotizarlo al mejor precio',
      excerpt: 'Consejos prácticos de detallado, mantenimiento preventivo y documentación previa para maximizar el valor de tu vehículo en una permuta o venta.',
      date: '2 de mayo, 2026'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027',
      title: 'Créditos prendarios: ¿Cómo financiar tu próximo vehículo?',
      excerpt: 'Todo lo que tenés que saber sobre las opciones de financiación: tasas fijas, plazos en meses y requisitos para acceder a tu 0km o usado.',
      date: '28 de abril, 2026'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
      title: '¿0km o Usado Selección? Cuál elegir según tu presupuesto',
      excerpt: 'Comparativa detallada analizando costos de patentamiento, seguro, depreciación y mantenimiento inicial de cada alternativa.',
      date: '22 de abril, 2026'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b',
      title: 'Mantenimiento preventivo: cuidá el motor y la transmisión',
      excerpt: 'Los chequeos esenciales que debes realizar periódicamente para prolongar la vida útil de tu auto y evitar costosas reparaciones.',
      date: '15 de abril, 2026'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935',
      title: 'Trámites y transferencia automotor: paso a paso',
      excerpt: 'Guía clara sobre la verificación policial, formulario 08, CUIT y los costos involucrados en la transferencia del vehículo.',
      date: '9 de abril, 2026'
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
      title: 'Consignación vs. Venta Directa: ¿Qué te conviene más?',
      excerpt: 'Ventajas de dejar tu auto en consignación en un showroom frente a la venta particular o la toma inmediata en parte de pago.',
      date: '3 de abril, 2026'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Blog Automotor - Novedades, Guías y Consejos</title>
        <meta 
          name="description" 
          content="Leé las últimas novedades del mercado automotor, guías de compra, consejos de mantenimiento y claves para financiar tu próximo vehículo." 
        />
      </Helmet>

      <Header />
      <FloatingWhatsAppButton />

      <div className="pt-20">
        {/* Banner principal */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}
            >
              Blog Automotor
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-primary-foreground/90"
            >
              Consejos, guías técnicas y novedades del mercado
            </motion.p>
          </div>
        </section>

        {/* Grilla de artículos */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {articles.map((article, index) => (
                <BlogCard key={article.id} article={article} index={index} />
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default BlogPage;