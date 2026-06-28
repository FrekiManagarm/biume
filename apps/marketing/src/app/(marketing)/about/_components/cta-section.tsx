"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-linear-to-b from-background to-accent/10 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Card */}
          <div className="relative bg-linear-to-br from-primary/10 via-background to-accent/10 border-2 border-primary/20 rounded-3xl p-12 md:p-16 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="relative text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Rejoignez l&apos;aventure
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Prêt à transformer{" "}
                <span className="bg-linear-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                  votre pratique
                </span>{" "}
                ?
              </h2>

              {/* Description */}
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Rejoignez des centaines de professionnels qui utilisent déjà
                Biume pour simplifier leur quotidien et offrir de meilleurs
                soins à leurs patients.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="text-lg px-8 py-6 group">
                  <Link href="/sign-up">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6"
                >
                  <Link
                    href="https://cal.com/mathieu-chambaud-biume"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Demander une démo
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              {/* Trust badge */}
              <p className="text-sm text-muted-foreground mt-8">
                Essai gratuit • Sans engagement • Configuration en 5 minutes
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
