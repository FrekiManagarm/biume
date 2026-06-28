"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PawPrint,
  Menu,
  X,
  FileText,
  Grid3x3,
  CreditCard,
  LogIn,
  UserPlus,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/style";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled
            ? "bg-background/95 backdrop-blur-lg border-b border-border"
            : "bg-transparent",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                <PawPrint
                  fill="white"
                  className={cn(
                    "text-white transition-all duration-300",
                    isScrolled
                      ? "w-3 h-3 md:w-4 md:h-4"
                      : "w-4 h-4 md:w-5 md:h-5",
                  )}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg md:text-xl tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text leading-none">
                  Biume
                </span>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                href="/#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Grid3x3 className="w-4 h-4" />
                Fonctionnalités
              </Link>
              <Link
                href="/#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Tarifs
              </Link>

              <Link
                href="/contact"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact
              </Link>
              <ModeToggle />
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="lg">
                  <Link href="/sign-in">
                    <LogIn className="w-4 h-4" />
                    Connexion
                  </Link>
                </Button>
                <Button asChild variant="default" size="lg">
                  <Link href="/sign-up">
                    <UserPlus className="w-4 h-4" />
                    Inscription
                  </Link>
                </Button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <ModeToggle />
              <Button
                variant="default"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative z-50"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden fixed inset-x-0 top-16 bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300",
            isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none",
          )}
        >
          <div className="container mx-auto px-4 py-6">
            <nav className="space-y-4 mb-6">
              <a
                href="#reports"
                className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="w-4 h-4" />
                Module Rapports
              </a>
              <a
                href="#features"
                className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Grid3x3 className="w-4 h-4" />
                Fonctionnalités
              </a>
              <a
                href="#pricing"
                className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <CreditCard className="w-4 h-4" />
                Tarifs
              </a>
            </nav>

            <div className="space-y-3">
              <Button asChild variant="default">
                <Link href="/sign-in">
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/sign-up">
                  <UserPlus className="w-4 h-4" />
                  Créer un compte
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay pour mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
