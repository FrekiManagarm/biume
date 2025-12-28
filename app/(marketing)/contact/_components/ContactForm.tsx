"use client";

import React from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/api/actions/email.action";
import { contactSchema, ContactSchema } from "@/lib/utils/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";

export function ContactFormSection() {
  const form = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const { handleSubmit, reset } = form;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendContactEmail,
    onSuccess: () => {
      toast.success("Votre message a été envoyé avec succès !");
      reset();
    },
    onError: (error) => {
      console.error(error, "error");
      toast.error("Une erreur est survenue lors de l'envoi du message");
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      console.error(error, "error");
      toast.error("Une erreur est survenue lors de l'envoi du message");
    }
  });

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Formulaire de contact
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Envoyez-nous un message
          </h2>
          <p className="text-xl text-muted-foreground">
            Remplissez le formulaire ci-dessous et notre équipe vous répondra
            dans les meilleurs délais
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="p-8 md:p-12 bg-linear-to-br from-background to-accent/5 border-2 shadow-xl">
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Nom complet</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Votre nom et prénom"
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Adresse email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="vous@exemple.com"
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Sujet</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Sujet de votre message"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Parlez-nous de votre projet, de vos besoins ou de vos questions..."
                          className="min-h-[180px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base group"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="mr-2">Envoi en cours</span>
                      <Spinner className="size-4" />
                    </>
                  ) : (
                    <>
                      <span>Envoyer le message</span>
                      <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  Vos données sont protégées et ne seront jamais partagées avec
                  des tiers
                </p>
              </form>
            </Form>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
