"use client";

import { useEffect, useState } from "react";

import { Appointment } from "@/lib/schemas";
import { cn } from "@/lib/style";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface CalendarCellProps {
  day: number;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  appointments: Appointment[];
  onClick: () => void;
  onAddClick: (e: React.MouseEvent) => void;
}

export const addButtonVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

function renderDayAppointments(
  appointments: Appointment[],
  maxDisplayedAppointments: number,
) {
  if (appointments.length === 0) return null;

  const displayedAppointments = appointments.slice(0, maxDisplayedAppointments);
  const remainingCount = appointments.length - maxDisplayedAppointments;

  return (
    <>
      {displayedAppointments.map((appointment) => {
        return (
          <div
            key={appointment.id}
            className={cn(
              "text-[10px] sm:text-xs truncate rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1",
              "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 border border-purple-200 dark:border-purple-800",
            )}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-medium">
                {new Date(appointment.beginAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {appointment.patient && (
                <span className="text-[8px] sm:text-[10px] font-medium truncate">
                  {appointment.patient.name}
                </span>
              )}
            </div>
          </div>
        );
      })}
      {remainingCount > 0 && (
        <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5 sm:mt-1">
          +{remainingCount} autre{remainingCount > 1 ? "s" : ""}
        </div>
      )}
    </>
  );
}

export function CalendarCell({
  day,
  isToday,
  isSelected,
  isWeekend,
  appointments,
  onClick,
  onAddClick,
}: CalendarCellProps) {
  const [maxDisplayedAppointments, setMaxDisplayedAppointments] = useState(2);

  // Ajuster le nombre d'événements affichés en fonction de la hauteur de la fenêtre
  useEffect(() => {
    const updateMaxDisplayedAppointments = () => {
      const windowHeight = window.innerHeight;
      if (windowHeight < 768) {
        setMaxDisplayedAppointments(1);
      } else if (windowHeight < 1024) {
        setMaxDisplayedAppointments(2);
      } else {
        setMaxDisplayedAppointments(3);
      }
    };

    updateMaxDisplayedAppointments();
    window.addEventListener("resize", updateMaxDisplayedAppointments);
    return () =>
      window.removeEventListener("resize", updateMaxDisplayedAppointments);
  }, []);

  if (day === 0) {
    return <div className="invisible" />;
  }

  return (
    <div
      className={cn(
        "relative flex flex-col p-1 sm:p-2 transition-all duration-200",
        "h-[120px] md:h-[180px]", // Hauteur fixe pour toutes les cellules
        "rounded-lg sm:rounded-xl border border-border/60 hover:border-border",
        "dark:border-gray-700 dark:hover:border-gray-600",
        isToday && "bg-primary/5 ring-2 ring-primary border-primary/50",
        isSelected &&
        "bg-secondary/5 ring-2 ring-secondary border-secondary/50",
        isWeekend &&
        "bg-muted/80 border-muted/80 dark:bg-muted/60 dark:border-muted/60",
        "group cursor-pointer",
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "text-xs sm:text-sm font-medium",
          "group-hover:text-secondary",
          isToday && "text-primary",
          isSelected && "text-secondary",
          isWeekend && "text-foreground/70",
        )}
      >
        {day}
      </div>
      <div className="mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1 overflow-y-auto scrollbar-none">
        {renderDayAppointments(appointments, maxDisplayedAppointments)}
      </div>
      <motion.div
        className="absolute bottom-1 right-1"
        variants={addButtonVariants as Variants}
        initial="initial"
        whileHover="animate"
        exit="exit"
      >
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onAddClick || (() => { })}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
