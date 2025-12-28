"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import { ErrorContext } from "better-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { resetPasswordSchema } from "@/lib/auth/schemas"
import { resetPassword } from "@/lib/auth/auth-client"

export const ResetPasswordForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const password = watch("password")

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")
    if (!tokenFromUrl) {
      toast.error("Token de réinitialisation manquant ou invalide")
      router.push("/forgot-password")
      return
    }
    setToken(tokenFromUrl)
  }, [searchParams, router])

  const onSubmit = handleSubmit(async data => {
    if (!token) {
      toast.error("Token de réinitialisation manquant")
      return
    }

    await resetPassword(
      {
        newPassword: data.password,
        token: token,
      },
      {
        onRequest: () => {
          setLoading(true)
        },
        onSuccess: () => {
          setLoading(false)
          setPasswordReset(true)
          toast.success("Mot de passe réinitialisé avec succès !")
        },
        onError: (error: ErrorContext) => {
          setLoading(false)
          console.log(error, "error")
          toast.error(`Erreur : ${error.error.message}`)
        },
      }
    )
  })

  if (passwordReset) {
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
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Mot de passe réinitialisé !</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter avec votre
                  nouveau mot de passe.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center"
              >
                <Link href="/sign-in">
                  <Button className="w-full">Se connecter</Button>
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
              <Image src="/assets/images/biume-logo.png" alt="Biume" width={200} height={200} className="opacity-20" />
            </div>
          </motion.div>
        </div>
      </div>
    )
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Nouveau mot de passe</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Choisissez un mot de passe sécurisé pour votre compte Biume.
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
                {/* Password Field */}
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-10 border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary rounded-xl"
                      {...register("password")}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-10 border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary rounded-xl"
                      {...register("confirmPassword")}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-gray-600 dark:text-gray-400"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div
                        className={`w-2 h-2 rounded-full ${password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <span>Au moins 8 caractères</span>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full h-10 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Réinitialisation...
                    </>
                  ) : (
                    "Réinitialiser le mot de passe"
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
            <Image src="/assets/images/biume-logo.png" alt="Biume" width={200} height={200} className="opacity-20" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

