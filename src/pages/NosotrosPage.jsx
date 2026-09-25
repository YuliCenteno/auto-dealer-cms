import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Award, Users, TrendingUp } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton.jsx';

function NosotrosPage() {
  const team = [
    {
      name: 'Martín Álvarez',
      role: 'Director General',
      photo: 'https://images.unsplash.com/photo-1575383596664-30f4489f9786',
      bio: 'Más de 20 años de trayectoria en el sector automotor y comercio de vehículos.'
    },
    {
      name: 'Carolina Méndez',
      role: 'Gerente Comercial',
      photo: 'https://images.unsplash.com/photo-1693035730007-fbc2c14c6814',
      bio: 'Especialista en atención al cliente, gestión de permutas y unidades selección.'
    },
    {
      name: 'Roberto Fernández',
      role: 'Especialista en Peritaje',
      photo: 'https://images.unsplash.com/photo-1644212408-c711b7c19b92',
      bio: 'Encargado de la inspección mecánica y valuación técnica de unidades usadas.'
    },
    {
      name: 'Valeria Torres',
      role: 'Asesora de Financiación',
      photo: 'https://images.unsplash.com/photo-1635521071003-d9a00f967e0b',
      bio: 'Gestión integral de créditos prendarios, trámites dominiales y documentación.'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Compromiso',
      description: 'Acompañamos a cada cliente a encontrar el vehículo ideal que se adapte a sus necesidades y presupuesto.'
    },
    {
      icon: Award,
      title: 'Garantía y Transparencia',
      description: 'Revisamos minuciosamente cada unidad para garantizar su óptimo funcionamiento y documentación al día.'
    },
    {
      icon: Users,
      title: 'Confianza',
      description: 'Fomentamos relaciones duraderas brindando asesoramiento honesto y claro en todo el proceso.'
    },
    {
      icon: TrendingUp,
      title: 'Innovación',
      description: 'Implementamos herramientas digitales para facilitar la cotización, reserva y gestión de tu vehículo.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Nosotros - Concesionaria Automotriz</title>
        <meta name="description" content="Conocé nuestra historia, el equipo de profesionales y los valores que nos convierten en tu mejor opción para comprar o vender tu vehículo." />
      </Helmet>

      <Header />
      <FloatingWhatsAppButton />

      <div className="pt-20">
        <section className="bg-primary text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}
            >
              Sobre nosotros
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-primary-foreground/90"
            >
              Más de 15 años impulsando tus sueños sobre ruedas
            </motion.p>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" style={{ textWrap: 'balance' }}>
                  Nuestra historia
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Nuestra concesionaria nació en 2011 con la meta de transformar la experiencia de comprar, vender o cambiar un auto. Desde nuestros comienzos, buscamos destacarnos por la seguridad y la claridad en cada operación, asegurando que cada vehículo entregado cumpla con los estándares más exigentes.
                  </p>
                  <p>
                    A lo largo de estos 15 años, hemos entregado más de 2.500 unidades y acompañado a miles de familias a subirse a su próximo vehículo. Cada cliente satisfecho nos impulsa a mantener nuestro estándar de servicio y posventa.
                  </p>
                  <p>
                    Hoy somos un referente en la comercialización de vehículos 0km y seleccionados usados, caracterizándonos por el peritaje exhaustivo, la transparencia técnica y opciones de financiación a medida.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1563720223185-11003d516935"
                  alt="Showroom de la concesionaria"
                  className="rounded-2xl shadow-xl w-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ textWrap: 'balance' }}>
                Nuestros valores
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Los pilares fundamentales sobre los que construimos la confianza con cada conductor
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card rounded-2xl p-6 shadow-sm border border-border"
                  >
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ textWrap: 'balance' }}>
                Nuestro equipo
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Especialistas listos para asesorarte en la elección de tu vehículo
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="mb-4 relative inline-block">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-48 h-48 rounded-2xl object-cover mx-auto shadow-lg"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default NosotrosPage;