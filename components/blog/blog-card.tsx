"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  slug: string;
  image?: string;
  readTime?: string;
  index?: number;
}

export function BlogCard({
  title,
  description,
  date,
  author,
  tags,
  slug,
  image,
  readTime = "5 min",
  index = 0,
}: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={`/blog/${slug}`} className="block h-full">
        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1">
          {/* Image */}
          {image && (
            <div className="relative h-48 w-full overflow-hidden bg-muted">
              <div
                className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
            </div>
          )}

          <CardHeader className="space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs font-medium"
                >
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm line-clamp-3">
              {description}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={date}>{formatDate(date)}</time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{readTime} de lecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>{author}</span>
              </div>
            </div>

            {/* Read more */}
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <span>Lire l'article</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
