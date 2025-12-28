"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Tag } from "lucide-react";

import { Appointment } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <div className="rounded-xl border bg-card transition-colors">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10 shrink-0 border-2 border-purple-200 dark:border-purple-800">
              {appointment.patient.image ? (
                <AvatarImage
                  src={appointment.patient.image}
                  alt={appointment.patient.name}
                />
              ) : (
                <AvatarFallback className="bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100">
                  {appointment.patient.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0">
              <h4 className="font-semibold text-base truncate">
                {appointment.patient.name}
              </h4>
              <p className="text-sm text-muted-foreground truncate">
                {appointment.organization.name}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-2 shrink-0">
            {appointment.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-medium truncate">
              {appointment.beginAt.toLocaleString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {appointment.endAt.toLocaleString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-muted-foreground text-xs truncate">
              Durée :{" "}
              {Math.round(
                (appointment.endAt.getTime() - appointment.beginAt.getTime()) /
                  1000 /
                  60,
              )}{" "}
              min
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
