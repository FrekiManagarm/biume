"use client";

import { motion } from "framer-motion";
import { Users, FileText, Heart, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Professionnels actifs",
    description: "Thérapeutes qui utilisent Biume quotidiennement",
  },
  {
    icon: FileText,
    value: "10k+",
    label: "Rapports générés",
    description: "Documents créés et partagés avec les clients",
  },
  {
    icon: Heart,
    value: "20k+",
    label: "Animaux suivis",
    description: "Patients bénéficiant de soins de qualité",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Satisfaction",
    description: "Professionnels recommandant Biume",
  },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
