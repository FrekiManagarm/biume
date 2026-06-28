"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Building2, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/style";
import { proBasicInformationsSchema } from "../../types/onboarding-schemas";
import { useMutation } from "@tanstack/react-query";
import { createOrganization } from "@/lib/api/actions/organization.action";

const InformationsForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof proBasicInformationsSchema>>({
    resolver: zodResolver(proBasicInformationsSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { control, formState, handleSubmit } = form;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      toast.success("Votre espace est prêt.");
      router.refresh();
    },
    onError: () => {
      toast.error("Une erreur est survenue");
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutateAsync(values);
    } catch {
      toast.error("Une erreur est survenue");
    }
  });

  return (
    <div className="flex h-full flex-col">
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex min-h-full flex-col">
          <div className="flex-1 space-y-6 px-6 py-6">
            <div className="rounded-md border bg-muted/35 p-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Configuration volontairement courte.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Logo, description et préférences attendront les paramètres.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-medium">
                      Nom de votre espace
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Cabinet Dupont"
                          {...field}
                          value={field.value ?? ""}
                          className={cn(
                            "h-11 pl-9 text-base",
                            formState.errors.name && "border-destructive",
                          )}
                          autoComplete="organization"
                          autoFocus
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Email de contact
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="contact@cabinet.fr"
                          {...field}
                          value={field.value ?? ""}
                          className={cn(
                            "h-11 pl-9 text-base",
                            formState.errors.email && "border-destructive",
                          )}
                          autoComplete="email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border-t bg-muted/25 px-6 py-5">
            <Button
              size="lg"
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Création..." : "Créer mon espace"}
              {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InformationsForm;
