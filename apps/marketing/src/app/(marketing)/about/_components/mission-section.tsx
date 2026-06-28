"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Eye, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";

const missions = [
  {
    icon: Target,
    title: "Notre Mission",
    description:
      "Simplifier la gestion quotidienne des professionnels de santé animale pour qu'ils puissent se concentrer pleinement sur le soin de leurs patients.",
  },
  {
    icon: Eye,
    title: "Notre Vision",
    description:
      "Un monde où chaque animal reçoit les meilleurs soins possibles grâce à des professionnels équipés d'outils technologiques performants.",
  },
  {
    icon: Lightbulb,
    title: "Notre Approche",
    description:
      "Développer des solutions intuitives et puissantes qui s'adaptent aux besoins réels des thérapeutes animaliers sur le terrain.",
  },
];

export function MissionSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-accent/5 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ce qui nous anime
          </h2>
          <p className="text-xl text-muted-foreground">
            Chez Biume, chaque décision est guidée par une passion commune :
            améliorer la vie des animaux et de ceux qui prennent soin
            d&apos;eux.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {missions.map((mission, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <Card className="p-8 h-full bg-gradient-to-br from-background to-accent/5 border-2 hover:border-primary/50 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <mission.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{mission.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {mission.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Image avec overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl"
        >
          <Image
            src="/assets/images/about-mission.jpg"
            alt="Notre mission"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <p className="text-white text-2xl md:text-3xl font-semibold max-w-3xl">
              &quot;Chaque fonctionnalité que nous développons est pensée pour
              libérer du temps aux thérapeutes et améliorer le bien-être
              animal.&quot;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
