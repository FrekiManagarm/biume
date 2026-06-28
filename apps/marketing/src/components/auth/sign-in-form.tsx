"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/auth/schemas";
import { signIn } from "@/lib/auth/auth-client";
import { Loader2 } from "lucide-react";
import { ErrorContext } from "better-auth/react";

const SignInForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await signIn.email(
        {
          email: data.email,
          password: data.password,
          rememberMe: false,
        },
        {
          onRequest: (ctx) => {
            console.log(ctx, "ctx");
            setLoading(true);
          },
          onSuccess: () => {
            toast.success("Connexion réussie ! Vous allez être redirigé ...");
            router.push(`/dashboard`);
          },
          onError: (error: ErrorContext) => {
            setLoading(false);
            console.log(error, "error");
            toast.error(`Error : ${error.error.message}`);
          },
        },
      );
      console.log(response, "response");
    } catch (error) {
      console.log(error, "error");
    }
  });

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        newUserCallbackURL: "/dashboard",
      });
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <div className="min-h-screen w-screen hero-bg">
      <div className="flex min-h-screen">
        {/* Left Panel - Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
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
                Bienvenue sur <span className="text-primary">Biume</span>
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
                Connexion
              </h2>

              <form onSubmit={onSubmit} className="space-y-4">
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
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
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
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </Button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-card text-muted-foreground">
                      Ou continuez avec
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className="w-full h-10 border-border hover:bg-accent rounded-xl font-medium transition-all duration-200"
                    onClick={handleGoogleSignIn}
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

                {/* Sign Up Link */}
                <div className="text-center pt-3">
                  <p className="text-sm text-muted-foreground">
                    Vous n&apos;avez pas encore de compte ?{" "}
                    <Link
                      href="/sign-up"
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Inscrivez-vous gratuitement
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
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
              alt="Professionnel animalier avec un chien"
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
                  Gérez votre activité professionnelle en toute simplicité
                </h3>
                <p className="text-lg opacity-90">
                  Planification, suivi patient, vulgarisation de rapports...
                  Tout ce dont vous avez besoin pour simplifier votre pratique.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInForm;
