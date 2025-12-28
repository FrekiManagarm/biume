"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { Appointment } from "@/lib/schemas";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AppointmentCard } from "./appointment-card";

interface CalendarSidebarProps {
  selectedDate: Date | null;
  appointments: Appointment[];
}

export function CalendarSidebar({
  selectedDate,
  appointments,
}: CalendarSidebarProps) {
  const sortedAppointments = [...appointments].sort((a, b) => {
    const timeA = new Date(a.beginAt).getTime();
    const timeB = new Date(b.beginAt).getTime();
    return timeA - timeB;
  });

  return (
    <div className="h-full rounded-2xl border bg-card flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">
              {selectedDate
                ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })
                : "Sélectionnez une date"}
            </h3>
            {selectedDate && appointments.length > 0 && (
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {appointments.length} rendez-vous programmé
                {appointments.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 space-y-4">
          {selectedDate ? (
            sortedAppointments.length > 0 ? (
              sortedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="p-3 rounded-full bg-muted/30 w-fit mx-auto mb-3">
                  <CalendarIcon className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Aucun rendez-vous prévu
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Profitez de cette journée tranquille !
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <div className="p-3 rounded-full bg-muted/30 w-fit mx-auto mb-3">
                <CalendarIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Sélectionnez une date
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Pour voir les rendez-vous programmés
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
