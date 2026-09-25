import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < testimonial.rating
                    ? 'fill-accent text-accent'
                    : 'text-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6 italic">
            "{testimonial.comment}"
          </p>
          <div className="flex items-center gap-3">
            <img
              src={testimonial.photo}
              alt={testimonial.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <div className="font-semibold text-foreground">
                {testimonial.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {testimonial.role}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default TestimonialCard;