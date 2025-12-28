"use client";

import { Appointment } from "@/lib/schemas";
import { CalendarGrid } from "./components/calendar-grid";
import { ViewMode } from "./types/view-mode";
import { WeekView } from "./components/week-view";
import { useState } from "react";

interface CalendarViewProps {
  appointments?: Appointment[];
  organizationId: string;
}

export function CalendarView({ appointments = [], organizationId }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <div className="lg:order-1 flex-1 min-h-0 overflow-hidden">
          {viewMode === "month" ? (
            <CalendarGrid
              appointments={appointments}
              onDateSelect={setSelectedDate}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              organizationId={organizationId}
            />
          ) : viewMode === "week" ? (
            <WeekView
              appointments={appointments}
              onDateSelect={setSelectedDate}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              organizationId={organizationId}
            />
          ) : (
            <WeekView
              appointments={appointments.filter((apt) => {
                if (!selectedDate || !apt.beginAt) return false;
                const aptDate = new Date(apt.beginAt);
                return aptDate.toDateString() === selectedDate.toDateString();
              })}
              onDateSelect={setSelectedDate}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              organizationId={organizationId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
