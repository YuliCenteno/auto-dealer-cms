import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function BlogCard({ article, index = 0 }) {
  const defaultImage = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
  const imageUrl = article.image || article.image_url || defaultImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
        <div className="relative overflow-hidden aspect-[16/10]">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
        <CardContent className="flex-1 p-6 flex flex-col">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="w-4 h-4" />
            <span>{article.date || 'Reciente'}</span>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-foreground leading-tight line-clamp-2">
            {article.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
            {article.excerpt}
          </p>
          <Button asChild variant="ghost" className="w-full justify-between group mt-auto transition-all duration-200">
            <Link to={`/blog/${article.id}`}>
              Leer más
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default BlogCard;