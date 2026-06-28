"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Credenza,
  CredenzaContent,
  CredenzaTitle,
} from "@/components/ui/credenza";
import {
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  User,
  PawPrint,
  Edit,
  Trash2,
} from "lucide-react";

import { Appointment } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/style";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";
import { deleteAppointment } from "@/lib/api/actions/appointments.action";
import { toast } from "sonner";
import { useState } from "react";
import { NewAppointmentForm } from "./new-appointment-form";

interface AppointmentDetailsProps {
  appointment: Appointment;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig = {
  CREATED: {
    label: "En attente",
    color: "bg-amber-500/10 text-amber-700 border-amber-200",
  },
  CONFIRMED: {
    label: "Confirmé",
    color: "bg-blue-500/10 text-blue-700 border-blue-200",
  },
  COMPLETED: {
    label: "Terminé",
    color: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  },
  CANCELLED: {
    label: "Annulé",
    color: "bg-red-500/10 text-red-700 border-red-200",
  },
};

export function AppointmentDetails({
  appointment,
  isOpen,
  onOpenChange,
}: AppointmentDetailsProps) {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  if (!appointment) return null;

  if (!appointment.beginAt || !appointment.endAt) return null;

  const startTime = new Date(appointment.beginAt);
  const endTime = new Date(appointment.endAt);
  const duration = Math.round(
    (endTime.getTime() - startTime.getTime()) / 1000 / 60,
  );

  const { mutateAsync: deleteAppointmentMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: deleteAppointment,
      onSuccess: () => {
        toast.success("Rendez-vous supprimé avec succès");
        onOpenChange(false);
      },
      onError: (error: Error) => {
        toast.error(
          `Erreur lors de la suppression du rendez-vous: ${error.message}`,
        );
      },
    });

  const handleEditClick = () => {
    setIsEditFormOpen(true);
  };

  const handleEditFormClose = () => {
    setIsEditFormOpen(false);
  };

  const handleEditSubmit = () => {
    setIsEditFormOpen(false);
  };

  return (
    <>
      <Credenza open={isOpen} onOpenChange={onOpenChange}>
        <CredenzaContent className="min-w-2xl max-h-[35vh] p-0 gap-0 overflow-hidden">
          <VisuallyHidden>
            <CredenzaTitle>Détails du rendez-vous</CredenzaTitle>
          </VisuallyHidden>

          <div className="grid md:grid-cols-[280px_1fr] h-[85vh] w-full">
            {/* Sidebar gauche avec les patients */}
            <div className="bg-muted/30 border-r p-6 overflow-y-auto">
              <div className="space-y-3 mb-6">
                {/* Statut */}
                <Badge
                  variant="default"
                  className={cn(
                    "px-3 py-1 font-medium border w-fit text-xs ",
                    statusConfig[appointment.status]?.color,
                  )}
                >
                  {statusConfig[appointment.status]?.label}
                </Badge>

                {/* Date et heure */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {format(startTime, "EEEE", { locale: fr })}
                  </p>
                  <h2 className="text-2xl font-semibold">
                    {format(startTime, "d MMMM", { locale: fr })}
                  </h2>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Patient
                </p>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-accent/50 transition-colors cursor-pointer group">
                  <div className="relative flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-background">
                      {appointment.patient.image ? (
                        <AvatarImage
                          src={appointment.patient.image}
                          alt={appointment.patient.name}
                        />
                      ) : (
                        <AvatarFallback className="text-sm font-semibold bg-linear-to-br from-blue-50 to-blue-100 text-blue-700">
                          <PawPrint className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate group-hover:text-foreground transition-colors">
                        {appointment.patient.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {appointment.patient.animal.name}
                        {appointment.patient.breed &&
                          ` • ${appointment.patient.breed}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t space-y-2">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={handleEditClick}
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  className="justify-start"
                  onClick={async () =>
                    await deleteAppointmentMutation(appointment.id)
                  }
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </div>

            {/* Contenu principal à droite */}
            <div className="overflow-y-auto">
              <div className="p-8 space-y-8">
                <div className="space-y-6">
                  {/* Grille d'informations */}
                  <div className="grid gap-6">
                    {/* Propriétaire */}
                    <div className="group">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <h4 className="font-semibold">Propriétaire</h4>
                      </div>
                      <div className="pl-10 space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            {appointment.patient.owner.image ? (
                              <AvatarImage
                                src={appointment.patient.owner.image}
                                alt={appointment.patient.owner.name || ""}
                              />
                            ) : (
                              <AvatarFallback className="text-xs font-medium">
                                {appointment.patient.owner.name
                                  ?.slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <p className="font-medium">
                            {appointment.patient.owner.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    {(appointment.patient.owner.phone ||
                      appointment.patient.owner.email ||
                      appointment.patient.owner.address) && (
                      <div className="group">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Phone className="h-4 w-4 text-emerald-600" />
                          </div>
                          <h4 className="font-semibold">Contact</h4>
                        </div>
                        <div className="pl-10 space-y-2.5">
                          {appointment.patient.owner.phone && (
                            <a
                              href={`tel:${appointment.patient.owner.phone}`}
                              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group/link"
                            >
                              <Phone className="h-4 w-4 shrink-0" />
                              <span className="group-hover/link:underline">
                                {appointment.patient.owner.phone}
                              </span>
                            </a>
                          )}
                          {appointment.patient.owner.email && (
                            <a
                              href={`mailto:${appointment.patient.owner.email}`}
                              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group/link"
                            >
                              <Mail className="h-4 w-4 shrink-0" />
                              <span className="group-hover/link:underline truncate">
                                {appointment.patient.owner.email}
                              </span>
                            </a>
                          )}
                          {appointment.patient.owner.address && (
                            <div className="flex items-start gap-3 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                              <span>{appointment.patient.owner.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {appointment.note && (
                      <div className="group">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-purple-600" />
                          </div>
                          <h4 className="font-semibold">Notes</h4>
                        </div>
                        <div className="pl-10">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {appointment.note}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Informations complémentaires */}
                    <div className="group">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-500/10 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-slate-600" />
                        </div>
                        <h4 className="font-semibold">Informations</h4>
                      </div>
                      <div className="pl-10 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Durée</span>
                          <span className="font-medium">
                            {duration} minutes
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Créé le</span>
                          <span className="font-medium">
                            {format(
                              new Date(appointment.createdAt || new Date()),
                              "d MMM yyyy à HH:mm",
                              { locale: fr },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CredenzaContent>
      </Credenza>

      {/* Formulaire d'édition */}
      {appointment.beginAt && (
        <NewAppointmentForm
          date={new Date(appointment.beginAt)}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSubmit={handleEditSubmit}
          appointment={appointment}
        />
      )}
    </>
  );
}
