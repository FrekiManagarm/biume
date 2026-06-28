"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const keyPoints = [
  {
    icon: Shield,
    title: "Protection maximale",
    description:
      "Vos données sont cryptées et sécurisées selon les normes les plus strictes",
  },
  {
    icon: Lock,
    title: "Conformité RGPD",
    description:
      "Nous respectons toutes les exigences du règlement européen sur la protection des données",
  },
  {
    icon: Eye,
    title: "Transparence totale",
    description:
      "Vous savez toujours quelles données nous collectons et pourquoi",
  },
  {
    icon: FileCheck,
    title: "Vos droits respectés",
    description:
      "Accès, rectification, suppression : exercez vos droits à tout moment",
  },
];

export function KeyPointsSection() {
  return (
    <section className="py-20 bg-linear-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Nos engagements
          </h2>
          <p className="text-xl text-muted-foreground">
            La confiance que vous nous accordez est précieuse. Voici comment
            nous la protégeons.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="p-6 h-full bg-linear-to-br from-background to-accent/5 border-2 hover:border-primary/50 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <point.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{point.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
