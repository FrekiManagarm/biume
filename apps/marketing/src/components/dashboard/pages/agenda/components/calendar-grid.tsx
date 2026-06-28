"use client";

import { getDaysInMonth, getFirstDayOfMonth } from "@/lib/utils/date";

import { Appointment } from "@/lib/schemas";
import { CalendarCell } from "./calendar-cell";
import { CalendarHeader } from "./calendar-header";
import { ViewMode } from "../types/view-mode";
import { cn } from "@/lib/style";
import { motion } from "framer-motion";
import { useState } from "react";
import { NewAppointmentForm } from "./new-appointment-form";

interface CalendarGridProps {
  appointments: Appointment[];
  onDateSelect: (date: Date) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onNewAppointment?: (date: Date) => void;
  organizationId: string;
}

export function CalendarGrid({
  appointments,
  onDateSelect,
  currentDate,
  onDateChange,
  viewMode,
  onViewModeChange,
  onNewAppointment,
  organizationId,
}: CalendarGridProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [newAppointmentDate, setNewAppointmentDate] = useState<Date | null>(
    null,
  );

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);

  const handlePrevMonth = () => {
    onDateChange(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    onDateChange(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const handleToday = () => {
    const today = new Date();
    onDateChange(today);
    setSelectedDate(today);
    onDateSelect(today);
  };

  const isToday = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return date.toDateString() === new Date().toDateString();
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return date.toDateString() === selectedDate.toDateString();
  };

  const isWeekend = (dayIndex: number) => {
    return dayIndex === 0 || dayIndex === 6;
  };

  const getDayEvents = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return appointments.filter((appointment) => {
      if (!appointment.beginAt) return false;
      const eventDate = new Date(appointment.beginAt);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
  };

  const getWeeksInMonth = () => {
    const weeks: number[][] = [];
    let currentWeek: number[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      currentWeek.push(0);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(0);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const handleNewAppointmentClick = (date: Date) => {
    setNewAppointmentDate(date);
    setIsNewAppointmentOpen(true);
  };

  const handleNewAppointmentSubmit = (data: any) => {
    if (onNewAppointment && newAppointmentDate) {
      onNewAppointment(newAppointmentDate);
    }
    setIsNewAppointmentOpen(false);
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onPrevious={handlePrevMonth}
        onNext={handleNextMonth}
        onToday={handleToday}
        organizationId={organizationId}
      />

      <div className="rounded-2xl border bg-card text-card-foreground shadow-sm flex-1 flex flex-col min-h-0">
        <div className="grid grid-cols-7 p-4 pb-2">
          {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
            <div
              key={day}
              className={cn(
                "text-center font-medium text-xs sm:text-sm p-1",
                day === "Dim" || day === "Sam"
                  ? "text-red-500"
                  : "text-gray-600 dark:text-gray-300",
              )}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-rows-[repeat(6,1fr)] gap-1 sm:gap-2 p-2 sm:p-4 pt-2 min-h-0 overflow-y-auto">
          {getWeeksInMonth().map((week, weekIndex) => (
            <div
              key={weekIndex}
              className="grid grid-cols-7 gap-1 sm:gap-2 h-full"
            >
              {week.map((day, dayIndex) => (
                <CalendarCell
                  key={`${weekIndex}-${dayIndex}`}
                  day={day}
                  isToday={isToday(day)}
                  isSelected={isSelected(day)}
                  isWeekend={isWeekend(dayIndex)}
                  appointments={getDayEvents(day)}
                  onClick={() => {
                    const newDate = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day,
                    );
                    setSelectedDate(newDate);
                    onDateSelect(newDate);
                  }}
                  onAddClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (day !== 0) {
                      const newDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day,
                      );
                      handleNewAppointmentClick(newDate);
                    }
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Modale de nouveau rendez-vous */}
      {newAppointmentDate && (
        <NewAppointmentForm
          date={newAppointmentDate}
          isOpen={isNewAppointmentOpen}
          onOpenChange={setIsNewAppointmentOpen}
          onSubmit={handleNewAppointmentSubmit}
        />
      )}
    </motion.div>
  );
}
