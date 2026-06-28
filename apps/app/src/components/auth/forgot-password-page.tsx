import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/auth/auth-client";
import { forgotPasswordSchema } from "@/lib/auth/schemas";

export default function ForgotPasswordPage() {
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
        onRequest: () => setLoading(true),
        onSuccess: () => {
          setLoading(false);
          setEmailSent(true);
          toast.success(
            "Email de réinitialisation envoyé. Vérifiez votre boîte mail.",
          );
        },
        onError: ({ error }) => {
          setLoading(false);
          toast.error(`Erreur : ${error.message}`);
        },
      },
    );
  });

  return (
    <main className="flex min-h-screen w-screen items-center justify-center bg-background px-4">
      <section className="w-full max-w-md rounded-[2rem] border bg-card p-7 shadow-xl shadow-foreground/5">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <Mail className="size-6" />
          </div>
          <h1 className="text-2xl font-bold">
            {emailSent ? "Email envoyé" : "Mot de passe oublié ?"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {emailSent
              ? "Un lien de réinitialisation vient d’être envoyé à votre adresse email."
              : "Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe."}
          </p>
        </div>

        {emailSent ? (
          <Button asChild variant="outline" className="w-full rounded-full">
            <Link href="/sign-in">
              <ArrowLeft className="size-4" />
              Retour à la connexion
            </Link>
          </Button>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Adresse email
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  className="h-11 rounded-xl pl-10"
                  disabled={loading}
                  {...register("email")}
                />
              </div>
              {errors.email ? (
                <p className="mt-2 text-sm text-destructive">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Envoyer le lien
            </Button>

            <Button asChild variant="ghost" className="w-full rounded-full">
              <Link href="/sign-in">
                <ArrowLeft className="size-4" />
                Retour à la connexion
              </Link>
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
