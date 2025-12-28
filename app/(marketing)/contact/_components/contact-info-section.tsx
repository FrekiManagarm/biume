"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Clock, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    description: "Notre équipe vous répond rapidement",
    value: "contact@biume.com",
    href: "mailto:contact@biume.com",
  },
  {
    icon: Clock,
    title: "Horaires",
    description: "Du lundi au vendredi",
    value: "9h00 - 18h00",
    href: null,
  },
  {
    icon: MapPin,
    title: "Localisation",
    description: "Basés en France",
    value: "Bordeaux, France",
    href: null,
  },
  {
    icon: Phone,
    title: "Support",
    description: "Assistance rapide",
    value: "Via email uniquement",
    href: null,
  },
];

export function ContactInfoSection() {
  return (
    <section className="py-16 bg-linear-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
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
                    <info.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{info.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {info.description}
                  </p>
                  {info.href ? (
                    <Link
                      href={info.href}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {info.value}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium">{info.value}</p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
