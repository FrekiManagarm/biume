"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Building2, Heart, Shield, Users } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Passion pour la santé animale",
    description:
      "Nous nous engageons à améliorer la vie des animaux en facilitant l'accès aux soins de qualité.",
  },
  {
    icon: Shield,
    title: "Excellence et fiabilité",
    description:
      "Nous développons des solutions robustes et innovantes pour les professionnels de santé animale.",
  },
  {
    icon: Users,
    title: "Communauté et collaboration",
    description:
      "Nous créons un écosystème où professionnels et propriétaires d'animaux collaborent efficacement.",
  },
  {
    icon: Building2,
    title: "Innovation responsable",
    description:
      "Nous innovons constamment tout en respectant les normes éthiques et professionnelles du secteur.",
  },
];

export function ValuesSection() {
  return (
    <section className="py-24 bg-linear-to-b from-background to-accent/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Nos Valeurs</h2>
          <p className="text-xl text-muted-foreground">
            Ces principes fondamentaux guident chacune de nos décisions et
            innovations
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="group relative h-full p-8 bg-linear-to-br from-background via-background to-accent/5 border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/0 via-primary/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon container */}
                  <div className="mb-6 inline-flex">
                    <div className="w-16 h-16 bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-3xl"></div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
