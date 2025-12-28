"use client";

import { useState, useEffect, memo } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/style";
import { Skeleton } from "@/components/ui/skeleton";

interface TrialCountdownProps {
  endTime: number; // Timestamp en millisecondes
  isLoading?: boolean;
}

function TrialCountdown({ endTime, isLoading = false }: TrialCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculer immédiatement pour éviter le délai initial
    calculateTimeLeft();

    // Mettre à jour toutes les secondes
    const timer = setInterval(calculateTimeLeft, 1000);

    // Nettoyer l'intervalle lors du démontage du composant
    return () => {
      clearInterval(timer);
    };
  }, [endTime]);

  const formatTime = () => {
    const { days, hours, minutes, seconds } = timeLeft;

    if (days > 0) {
      return `${days}j ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const isExpiringSoon = timeLeft.days === 0 && timeLeft.hours < 24;
  const isCritical = timeLeft.days === 0 && timeLeft.hours < 2;

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return (
      <div className="relative flex items-center gap-2 px-4 py-2 rounded-lg border bg-card border-border">
        {/* Skeleton pour l'icône */}
        <Skeleton className="w-4 h-4 rounded-full" />

        {/* Skeleton pour le contenu */}
        <div className="flex flex-col gap-1">
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-16 h-4" />
        </div>

        {/* Skeleton pour la barre de progression */}
        <Skeleton className="w-1 h-8 rounded-full" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300",
        "bg-card border-border",
        isExpiringSoon && "bg-accent border-accent-foreground/20",
        isCritical && "bg-destructive/10 border-destructive/30 animate-pulse"
      )}
    >
      {/* Icône avec animation */}
      <div className="flex items-center justify-center">
        {isCritical ? (
          <AlertTriangle
            size={16}
            className="text-destructive animate-bounce"
          />
        ) : (
          <Clock
            size={16}
            className={cn(
              "text-primary",
              isExpiringSoon && "text-secondary"
            )}
          />
        )}
      </div>

      {/* Contenu du compte à rebours */}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground">
          Période d&apos;essai
        </span>
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            "text-foreground",
            isExpiringSoon && "text-secondary",
            isCritical && "text-destructive"
          )}
        >
          {formatTime()}
        </span>
      </div>

      {/* Indicateur de progression */}
      <div className="flex flex-col items-end">
        <div className="w-1 h-8 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "w-full transition-all duration-1000 rounded-full",
              "bg-primary",
              isExpiringSoon && "bg-secondary",
              isCritical && "bg-destructive"
            )}
            style={{
              height: `${Math.max(0, Math.min(100, (timeLeft.days * 24 + timeLeft.hours) / 24 * 100))}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const TrialCountdownComponent = memo(TrialCountdown);
