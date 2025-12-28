"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/lib/auth/schemas";
import { signIn, signUp } from "@/lib/auth/auth-client";
import { ErrorContext } from "better-auth/react";

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        image: "",
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          toast.success("Inscription réussie ! Vous allez être redirigé ...");
          router.push(`/dashboard`);
        },
        onError: (error: ErrorContext) => {
          setLoading(false);
          console.log(error, "error");
          toast.error(`Error : ${error.error.message}`);
        },
      },
    );
  });

  const handleGoogleSignUp = async () => {
    try {
      await signIn.social({
        provider: "google",
        newUserCallbackURL: "/dashboard",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <div className="min-h-screen w-screen hero-bg">
      <div className="flex min-h-screen">
        {/* Left Panel - Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:flex-1 relative"
        >
          <div className="relative w-full h-full">
            <Image
              priority
              fill
              quality={90}
              src="/assets/images/register-image.jpg"
              alt="Professionnel avec un animal"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold mb-2">
                  Rejoignez la communauté Biume
                </h3>
                <p className="text-lg opacity-90">
                  Simplifiez votre quotidien avec une solution pensée par et
                  pour les professionnels animaliers.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-16 py-8 overflow-y-auto"
        >
          <div className="mx-auto w-full max-w-md">
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-6"
            >
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Créez votre compte <span className="text-primary">Biume</span>
              </h1>
              <p className="text-muted-foreground">
                Le Doctolib des professionnels animaliers
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="glass-panel-strong rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
                Inscription
              </h2>

              <form onSubmit={onSubmit} className="space-y-4">
                {/* Name Field */}
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 h-10 border-border focus:border-primary focus:ring-primary rounded-xl"
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@doe.fr"
                      className="pl-10 h-10 border-border focus:border-primary focus:ring-primary rounded-xl"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-10 border-border focus:border-primary focus:ring-primary rounded-xl"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Minimum 8 caractères avec au moins une majuscule et un
                    chiffre
                  </p>
                </div>

                {/* Terms and Conditions */}
                <div className="text-xs text-muted-foreground">
                  <p>
                    En créant un compte, vous acceptez nos{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Conditions d&apos;utilisation
                    </Link>{" "}
                    et notre{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Politique de confidentialité
                    </Link>
                    .
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  {loading ? "Création du compte..." : "Créer mon compte"}
                </Button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-card text-muted-foreground">
                      Ou inscrivez-vous avec
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={handleGoogleSignUp}
                    className="w-full h-10 border-border hover:bg-accent rounded-xl font-medium transition-all duration-200"
                  >
                    <Image
                      src="/assets/svg/google-icon.svg"
                      width={16}
                      height={16}
                      alt="Google"
                      className="mr-2"
                    />
                    Continuer avec Google
                  </Button>
                </div>

                {/* Sign In Link */}
                <div className="text-center pt-3">
                  <p className="text-sm text-muted-foreground">
                    Vous avez déjà un compte ?{" "}
                    <Link
                      href="/sign-in"
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Connectez-vous
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpForm;
