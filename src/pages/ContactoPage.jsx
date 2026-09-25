import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ContactForm from '@/components/ContactForm.jsx';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton.jsx';

function ContactoPage() {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Showroom Principal',
      content: 'Montevideo 100, Córdoba, Argentina'
    },
    {
      icon: Phone,
      title: 'Ventas y Atención',
      content: '+54 9 351 1234567'
    },
    {
      icon: Mail,
      title: 'Email de Contacto',
      content: 'contacto@concesionaria.com.ar'
    },
    {
      icon: Clock,
      title: 'Horario de Atención',
      content: 'Lunes a Viernes: 9:00 - 19:00\nSábados: 9:00 - 13:30'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contacto - Concesionaria Automotriz</title>
        <meta 
          name="description" 
          content="Contactate con nuestro equipo. Consultá por stock de vehículos, agendá un test drive o solicitá asesoramiento sobre financiación y permutas." 
        />
      </Helmet>

      <Header />
      <FloatingWhatsAppButton />

      <div className="pt-20">
        {/* Encabezado */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}
            >
              Contactanos
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-primary-foreground/90"
            >
              Estamos para asesorarte en la compra, venta o permuta de tu próximo vehículo
            </motion.p>
          </div>
        </section>

        {/* Información, Mapa y Formulario */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Información y Ubicación */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-8" style={{ textWrap: 'balance' }}>
                  Información de contacto
                </h2>

                <div className="space-y-6 mb-12">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {info.title}
                          </h3>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {info.content}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mapa */}
                <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] border border-border">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.736602114999!2d-64.18980692248765!3d-31.421382388642787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a2842a8a5f25%3A0x75ea4652b88959d5!2sMontevideo%20100%2C%20X5000AWC%20C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1789939701085!5m2!1ses!2sar"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Ubicación de la Concesionaria en Córdoba"
                  />
                </div>
              </motion.div>

              {/* Formulario */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card rounded-2xl shadow-xl p-8 border border-border"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Envianos tu consulta
                </h2>
                <ContactForm />
              </motion.div>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default ContactoPage;