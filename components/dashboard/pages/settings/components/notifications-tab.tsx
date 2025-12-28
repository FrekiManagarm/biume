"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Bell, Mail, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { updateUserNotifications } from "@/lib/api/actions/user.action";
import { useSession } from "@/lib/auth/auth-client";
import { useMutation } from "@tanstack/react-query";

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

const NotificationTab = () => {
  const { data: session, refetch } = useSession();

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: session?.user?.emailNotifications ?? false,
    },
  });

  const { handleSubmit } = form;

  const { mutateAsync: updateNotifications, isPending } = useMutation({
    mutationFn: updateUserNotifications,
    onSuccess: () => {
      toast.success("Préférences de notifications mises à jour");
      refetch();
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour des préférences");
      console.error(error);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await updateNotifications(data);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">
          Gérez vos préférences de notifications pour rester informé des activités importantes.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences de notifications
              </CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez recevoir les notifications importantes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Notifications par email
                      </FormLabel>
                      <FormDescription>
                        Recevez des notifications importantes par email (nouveaux rapports, demandes de rendez-vous, etc.)
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} className="gap-2">
              <Save className="h-4 w-4" />
              {isPending ? "Sauvegarde..." : "Sauvegarder les préférences"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NotificationTab;
