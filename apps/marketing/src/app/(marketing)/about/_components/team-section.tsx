"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Linkedin, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  profile: string;
}

export function TeamSection() {
  const teamMembers: TeamMember[] = [
    {
      name: "Mathieu Chambaud",
      role: "Co-fondateur & Développeur",
      image: "/assets/images/mathieu-chambaud.jpg",
      profile: "https://www.linkedin.com/in/mathieu-chambaud-9b4106170/",
    },
    {
      name: "Graig Kolodziejczyk",
      role: "Co-fondateur & Développeur",
      image: "/assets/images/graig-kolodziejczyk.png",
      profile: "https://www.linkedin.com/in/graig-kolodziejczyk-1482241b8/",
    },
  ];

  return (
    <section className="py-24 bg-linear-to-b from-accent/5 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            L&apos;équipe fondatrice
          </h2>
          <p className="text-xl text-muted-foreground">
            Deux développeurs passionnés par la santé animale et
            l&apos;innovation technologique
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <Link
                href={member.profile}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                    {/* LinkedIn badge */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-background via-background/95 to-transparent">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors duration-300">
                          {member.name}
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          {member.role}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Linkedin className="w-4 h-4" />
                          <span className="group-hover:underline">
                            Voir le profil LinkedIn
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
