"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/auth/schemas";
import { requestPasswordReset } from "@/lib/auth/auth-client";
import { Loader2 } from "lucide-react";
import { ErrorContext } from "better-auth/react";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    await requestPasswordReset(
      { email: data.email, redirectTo: "/reset-password" },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          setEmailSent(true);
          toast.success(
            "Email de réinitialisation envoyé ! Vérifiez votre boîte mail.",
          );
        },
        onError: (error: ErrorContext) => {
          setLoading(false);
          console.log(error, "error");
          toast.error(`Erreur : ${error.error.message}`);
        },
      },
    );
  });

  if (emailSent) {
    return (
      <div className="min-h-screen w-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex min-h-screen">
          {/* Left Panel - Success Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-16 py-8"
          >
            <div className="mx-auto w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center mb-6"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Email envoyé !
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Nous avons envoyé un lien de réinitialisation à votre adresse
                  email. Vérifiez votre boîte mail et suivez les instructions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center"
              >
                <Link href="/sign-in">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Panel - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden lg:flex lg:flex-1 bg-linear-to-br from-primary/10 to-primary/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent" />
            <div className="flex items-center justify-center w-full relative z-10">
              <Image
                src="/assets/images/biume-logo.png"
                alt="Biume"
                width={200}
                height={200}
                className="opacity-20"
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen">
        {/* Left Panel - Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-16 py-8"
        >
          <div className="mx-auto w-full max-w-md">
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-6"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Mot de passe oublié ?
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Pas de souci ! Entrez votre adresse email et nous vous enverrons
                un lien pour réinitialiser votre mot de passe.
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
            >
              <form onSubmit={onSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      className="pl-10 h-10 border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary rounded-xl"
                      {...register("email")}
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le lien de réinitialisation
                    </>
                  )}
                </Button>
              </form>

              {/* Back to Sign In */}
              <div className="mt-6 text-center">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-200"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Retour à la connexion
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="hidden lg:flex lg:flex-1 bg-linear-to-br from-primary/10 to-primary/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent" />
          <div className="flex items-center justify-center w-full relative z-10">
            <Image
              src="/assets/images/biume-logo.png"
              alt="Biume"
              width={200}
              height={200}
              className="opacity-20"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
