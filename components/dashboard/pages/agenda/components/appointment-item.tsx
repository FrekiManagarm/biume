"use client";

import { User2 } from "lucide-react";
import { Appointment } from "@/lib/schemas";
import { cn } from "@/lib/style";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

interface AppointmentItemProps {
  appointment: Appointment;
  position: { top: string; height: string };
  status: { color: string; label: string };
  onClick: () => void;
}

const appointmentVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

interface HeaderProps {
  startTime: Date;
  endTime: Date;
  status: string;
}

function Header({ startTime, endTime, status }: HeaderProps) {
  return (
    <div className="flex items-center justify-between min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <div
            className={cn("shrink-0 w-2 h-2 rounded-full", {
              "bg-emerald-500": status === "CONFIRMED",
              "bg-orange-500": status === "PENDING",
              "bg-red-500": status === "CANCELLED",
              "bg-blue-500": status === "COMPLETED",
            })}
          />
          <span className="font-medium truncate">
            {format(startTime, "HH:mm", { locale: fr })} -{" "}
            {format(endTime, "HH:mm", { locale: fr })}
          </span>
        </div>
      </div>
    </div>
  );
}

interface SingleAppointmentContentProps {
  patient?: { name: string };
  client?: { name: string };
  service?: { price: number | null; description: string | null };
}

function SingleAppointmentContent({
  patient,
  client,
}: SingleAppointmentContentProps) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="font-medium truncate">{patient?.name}</div>
      <div className="text-muted-foreground flex items-center gap-1 flex-wrap min-w-0">
        <div className="flex items-center gap-1 shrink-0">
          <User2 className="h-3 w-3 shrink-0" />
          <span className="truncate">{client?.name}</span>
        </div>
      </div>
    </div>
  );
}

export function AppointmentItem({
  appointment,
  position,
  onClick,
}: AppointmentItemProps) {
  const startTime = appointment.beginAt ? new Date(appointment.beginAt) : null;
  const endTime = appointment.endAt ? new Date(appointment.endAt) : null;

  if (!startTime || !endTime) return null;

  return (
    <motion.div
      className={cn(
        "absolute inset-x-1 z-10",
        "text-[10px] sm:text-xs truncate rounded-lg px-2 py-1.5",
        "flex flex-col gap-1",
        "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 border border-purple-200 dark:border-purple-800",
        "cursor-pointer hover:shadow-md transition-shadow",
      )}
      style={position}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      onClick={onClick}
      layoutId={`appointment-${appointment.id}`}
    >
      <Header
        startTime={startTime}
        endTime={endTime}
        status={appointment.status}
      />
      <SingleAppointmentContent
        patient={appointment.patient}
        client={appointment.organization}
      />
    </motion.div>
  );
}
