"use client";

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";

import { Button } from "@/components/ui/button";
import { format, addMinutes } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllPatients } from "@/lib/api/actions/patients.action";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/api/actions/appointments.action";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2Icon, Search, PawPrint as PawPrintIcon } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Appointment } from "@/lib/schemas";
import { differenceInMinutes } from "date-fns";

const appointmentFormSchema = z.object({
  patientId: z.string().min(1, "Veuillez sélectionner un patient"),
  beginAt: z.date(),
  duration: z
    .number()
    .min(15, "Durée minimale de 15 minutes")
    .max(480, "Durée maximale de 8 heures"),
  atHome: z.boolean(),
  note: z.string().optional(),
  notifyOwner: z.boolean(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface NewAppointmentFormProps {
  date: Date;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
  appointment?: Appointment | null;
}

export function NewAppointmentForm({
  date,
  isOpen,
  onOpenChange,
  onSubmit,
  appointment,
}: NewAppointmentFormProps) {
  const [petSearchTerm, setPetSearchTerm] = useState<string>("");
  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const isEditMode = !!appointment;

  // Récupération de tous les patients
  const { data: allPetsData, isLoading: isLoadingPets } = useQuery({
    queryKey: ["patients"],
    queryFn: () => getAllPatients({ limit: 100 }),
  });

  type PetOwner = { name?: string | null };
  type PetAnimal = { name?: string | null };
  type PetListItem = {
    id: string;
    name: string;
    type?: string | null;
    breed?: string | null;
    image?: string | null;
    owner?: PetOwner | null;
    animal?: PetAnimal | null;
  };

  const pets: PetListItem[] = (allPetsData ?? []) as PetListItem[];
  const filteredPets: PetListItem[] = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(petSearchTerm.toLowerCase()) ||
      (pet.type?.toLowerCase() ?? "").includes(petSearchTerm.toLowerCase()) ||
      (pet.breed ?? "").toLowerCase().includes(petSearchTerm.toLowerCase()) ||
      pet.owner?.name?.toLowerCase().includes(petSearchTerm.toLowerCase()),
  );

  const getDefaultValues = () => {
    if (appointment && appointment.beginAt && appointment.endAt) {
      const beginAt = new Date(appointment.beginAt);
      const endAt = new Date(appointment.endAt);
      const duration = differenceInMinutes(endAt, beginAt);
      return {
        patientId: appointment.patientId || "",
        beginAt,
        duration,
        atHome: appointment.atHome || false,
        note: appointment.note || "",
        notifyOwner: false,
      };
    }
    return {
      patientId: "",
      beginAt: date,
      duration: 30,
      atHome: false,
      note: "",
      notifyOwner: false,
    };
  };

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: getDefaultValues(),
  });

  // Réinitialiser le formulaire quand la date change ou quand l'appointment change
  useEffect(() => {
    form.reset(getDefaultValues());
  }, [date, appointment, form]);

  const { mutateAsync: createAppointmentMutation, isPending: isCreating } =
    useMutation({
      mutationFn: createAppointment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        toast.success("Rendez-vous créé avec succès");
        form.reset();
        onOpenChange(false);
        if (onSubmit) {
          onSubmit({});
        }
      },
      onError: (error: Error) => {
        toast.error(
          error.message || "Erreur lors de la création du rendez-vous",
        );
      },
    });

  const { mutateAsync: updateAppointmentMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: ({
        appointmentId,
        data,
      }: {
        appointmentId: string;
        data: Parameters<typeof updateAppointment>[1];
      }) => updateAppointment(appointmentId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        toast.success("Rendez-vous modifié avec succès");
        form.reset();
        onOpenChange(false);
        if (onSubmit) {
          onSubmit({});
        }
      },
      onError: (error: Error) => {
        toast.error(
          error.message || "Erreur lors de la modification du rendez-vous",
        );
      },
    });

  const isPending = isCreating || isUpdating;

  const handleSubmit = async (values: AppointmentFormValues) => {
    const beginAt = values.beginAt;
    const endAt = addMinutes(beginAt, values.duration);

    if (isEditMode && appointment) {
      await updateAppointmentMutation({
        appointmentId: appointment.id,
        data: {
          patientId: values.patientId,
          beginAt,
          endAt,
          atHome: values.atHome,
          note: values.note || undefined,
        },
      });
    } else {
      await createAppointmentMutation({
        patientId: values.patientId,
        beginAt,
        endAt,
        atHome: values.atHome,
        note: values.note || undefined,
        notifyOwner: values.notifyOwner,
      });
    }
  };

  const beginAt = form.watch("beginAt");
  const duration = form.watch("duration");
  const patientId = form.watch("patientId");
  const endAt = addMinutes(beginAt, duration);

  // Vérifier si le formulaire est valide pour la soumission
  const isFormValid = patientId && beginAt && duration > 0;

  return (
    <Credenza open={isOpen} onOpenChange={onOpenChange}>
      <CredenzaContent className="max-w-md">
        <CredenzaHeader>
          <CredenzaTitle>
            {isEditMode ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
          </CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              {/* Patient */}
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => {
                  const selectedPet = pets.find(
                    (pet) => pet.id === field.value,
                  );

                  return (
                    <FormItem>
                      <FormLabel>Patient</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoadingPets}
                        >
                          <SelectTrigger className="w-full">
                            {isLoadingPets ? (
                              <div className="flex items-center gap-2">
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                                <span>Chargement...</span>
                              </div>
                            ) : (
                              <SelectValue placeholder="Sélectionner un patient" />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <div className="px-2 py-2">
                              <div className="flex items-center px-1 mb-2 border rounded-md">
                                <Search className="h-4 w-4 text-muted-foreground ml-1 mr-1" />
                                <Input
                                  placeholder="Rechercher un patient..."
                                  className="h-8 border-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                                  value={petSearchTerm}
                                  onChange={(e) =>
                                    setPetSearchTerm(e.target.value)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                            {filteredPets.length === 0 ? (
                              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                                Aucun patient trouvé
                              </div>
                            ) : (
                              filteredPets.map((pet) => (
                                <SelectItem
                                  key={pet.id}
                                  value={pet.id}
                                  className="h-auto p-0 pl-8 pr-2"
                                >
                                  <div className="flex items-center gap-2 py-1.5">
                                    <Avatar className="h-6 w-6 shrink-0">
                                      <AvatarImage
                                        src={pet.image ?? undefined}
                                        alt={pet.name}
                                      />
                                      <AvatarFallback className="text-xs bg-muted">
                                        <PawPrintIcon className="h-3.5 w-3.5" />
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="truncate">
                                      {pet.name} ({pet.animal?.name || pet.type}
                                      {pet.breed ? ` - ${pet.breed}` : ""}) -{" "}
                                      {pet.owner?.name ||
                                        "Propriétaire inconnu"}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Date et horaires */}
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="beginAt"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-2 gap-3">
                        <FormControl>
                          <DatePicker
                            label="Date"
                            date={field.value}
                            onSelect={(newDate) => {
                              if (newDate) {
                                // Conserver l'heure actuelle lors du changement de date
                                const updatedDate = new Date(newDate);
                                updatedDate.setHours(
                                  field.value.getHours(),
                                  field.value.getMinutes(),
                                );
                                field.onChange(updatedDate);
                              }
                            }}
                          />
                        </FormControl>
                        <div className="flex flex-col gap-2">
                          <FormLabel className="text-xs">Heure</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              value={format(field.value, "HH:mm")}
                              onChange={(e) => {
                                const [hours, minutes] =
                                  e.target.value.split(":");
                                const newDate = new Date(field.value);
                                newDate.setHours(
                                  parseInt(hours),
                                  parseInt(minutes),
                                );
                                field.onChange(newDate);
                              }}
                            />
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Durée</FormLabel>
                        <FormControl>
                          {isCustomDuration ? (
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                min="5"
                                max="480"
                                value={field.value}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 0)
                                }
                                placeholder="Minutes"
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setIsCustomDuration(false);
                                  field.onChange(30);
                                }}
                              >
                                ✕
                              </Button>
                            </div>
                          ) : (
                            <Select
                              value={field.value.toString()}
                              onValueChange={(value) => {
                                if (value === "custom") {
                                  setIsCustomDuration(true);
                                } else {
                                  field.onChange(parseInt(value));
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15">15 min</SelectItem>
                                <SelectItem value="30">30 min</SelectItem>
                                <SelectItem value="45">45 min</SelectItem>
                                <SelectItem value="60">1h</SelectItem>
                                <SelectItem value="90">1h30</SelectItem>
                                <SelectItem value="120">2h</SelectItem>
                                <SelectItem value="custom">
                                  Personnalisé...
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col">
                    <FormLabel className="text-xs mb-2">Fin</FormLabel>
                    <div className="h-9 flex items-center px-3 rounded-md border bg-muted/50 text-sm">
                      {format(endAt, "HH:mm")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Note */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ajoutez une note..."
                        {...field}
                        rows={2}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Options compactes */}
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="atHome"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="atHome"
                          />
                        </FormControl>
                        <label
                          htmlFor="atHome"
                          className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Rendez-vous à domicile
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notifyOwner"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="notifyOwner"
                          />
                        </FormControl>
                        <label
                          htmlFor="notifyOwner"
                          className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Envoyer un email au propriétaire
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CredenzaFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    onOpenChange(false);
                  }}
                  disabled={isPending}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isPending || !isFormValid}>
                  {isPending && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditMode ? "Modifier le rendez-vous" : "Créer le rendez-vous"}
                </Button>
              </CredenzaFooter>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
