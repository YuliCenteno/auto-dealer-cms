import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowUpRight, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

function ServiceCard({ service, index = 0 }) {
  const Icon = service.icon || Wrench;
  const linkTo = service.link || '/servicios';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50">
        <CardContent className="p-8 flex flex-col h-full">
          <div className="mb-6 inline-flex p-4 rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground self-start">
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-foreground">
            {service.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
            {service.description}
          </p>
          <Link 
            to={linkTo} 
            className="flex items-center text-primary font-medium group-hover:gap-2 transition-all duration-300 mt-auto"
          >
            <span>Más información</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ServiceCard;