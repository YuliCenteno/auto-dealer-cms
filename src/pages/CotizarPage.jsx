import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AppraisalForm from '@/components/AppraisalForm.jsx'; // O reemplazar por tu componente de formulario (e.g. VehicleQuoteForm)
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton.jsx';

function CotizarPage() {
  const benefits = [
    'Cotización profesional sin cargo',
    'Informe detallado con el valor comercial real',
    'Análisis comparativo de vehículos similares',
    'Asesoramiento personalizado para venta o permuta',
    'Respuesta y propuesta en menos de 24 horas',
    'Sin compromiso de venta o consignación'
  ];

  return (
    <>
      <Helmet>
        <title>Cotizá tu Vehículo Gratis - Valuación Profesional</title>
        <meta 
          name="description" 
          content="Solicitá una cotización profesional y gratuita para tu vehículo. Conocé su valor real de mercado con nuestro equipo de expertos." 
        />
      </Helmet>

      <Header />
      <FloatingWhatsAppButton />

      <div className="pt-20">
        {/* Sección Hero / Encabezado */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}
            >
              Cotización de Vehículos
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-primary-foreground/90"
            >
              Conocé el valor comercial real de tu auto o moto con la ayuda de nuestros especialistas
            </motion.p>
          </div>
        </section>

        {/* Sección Principal con Beneficios y Formulario */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Columna Izquierda: Información y Pasos */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" style={{ textWrap: 'balance' }}>
                  ¿Por qué cotizar tu vehículo con nosotros?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Una cotización profesional te permite conocer la valuación precisa de tu vehículo en el mercado actual, algo clave para venderlo al precio adecuado, tomarlo en parte de pago o colocarlo en consignación. Evaluamos marca, modelo, año, kilometraje y estado general para darte la mejor propuesta.
                </p>

                <div className="space-y-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-lg">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-muted rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    ¿Cómo funciona el proceso?
                  </h3>
                  <ol className="space-y-3 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="font-semibold text-primary">1.</span>
                      <span>Completás el formulario con los datos clave de tu vehículo</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-primary">2.</span>
                      <span>Analizamos la información y nos contactamos con vos</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-primary">3.</span>
                      <span>Coordinamos una inspección presencial o revisión de fotos e historial</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-primary">4.</span>
                      <span>Recibís la oferta final de compra, consignación o valor de permuta</span>
                    </li>
                  </ol>
                </div>
              </motion.div>

              {/* Columna Derecha: Formulario */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card rounded-2xl shadow-xl p-8 border border-border"
              >
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Solicitá la cotización de tu vehículo
                </h3>
                <AppraisalForm />
              </motion.div>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default CotizarPage;