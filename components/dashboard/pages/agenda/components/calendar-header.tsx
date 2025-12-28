"use client";

import * as React from "react";
import {
  CalendarDays,
  CalendarIcon,
  Calendar as CalendarMonth,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewMode } from "../types/view-mode";
import { cn } from "@/lib/style";
import { fr } from "date-fns/locale";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { useDailySummary } from "@/hooks/useDailySummary";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Response } from "@/components/ai-elements/response";

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  organizationId: string;
}

const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
} as const;

// Fonction utilitaire pour extraire le texte d'un message
function getMessageText(message: any): string {
  if (message.parts && Array.isArray(message.parts)) {
    const textParts = message.parts
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text || "")
      .filter((text: string) => text.length > 0);
    return textParts.join("\n\n");
  }

  if (typeof message.content === "string") {
    return message.content;
  }

  return "";
}

export function CalendarHeader({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrevious,
  onNext,
  onToday,
  organizationId,
}: CalendarHeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const { messages, isLoading, error, requestDailySummary, reset } =
    useDailySummary();

  const handleRequestSummary = async () => {
    setIsDrawerOpen(true);
    if (messages.length === 0) {
      try {
        let startDate: Date;
        let endDate: Date;
        let periodType: "day" | "week" | "month";

        if (viewMode === "month") {
          startDate = startOfMonth(currentDate);
          endDate = endOfMonth(currentDate);
          periodType = "month";
        } else {
          // Mode week
          startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
          endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
          periodType = "week";
        }

        await requestDailySummary(organizationId, {
          startDate,
          endDate,
          periodType,
        });
      } catch (err) {
        toast.error("Erreur lors de la génération du résumé");
      }
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Réinitialiser après fermeture pour éviter de garder l'ancien résumé
    setTimeout(() => reset(), 300);
  };

  // Titre et description du drawer selon le mode
  const drawerTitle =
    viewMode === "month"
      ? `Résumé du mois de ${format(currentDate, "MMMM yyyy", { locale: fr })}`
      : viewMode === "week"
        ? `Résumé de la semaine du ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d MMMM", { locale: fr })}`
        : "Résumé de la journée";

  const drawerDescription =
    viewMode === "month"
      ? "Votre assistant IA vous présente un résumé de vos rendez-vous du mois"
      : viewMode === "week"
        ? "Votre assistant IA vous présente un résumé de vos rendez-vous de la semaine"
        : "Votre assistant IA vous présente un résumé de votre journée";

  return (
    <>
      <Card className="mb-4 p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon size={24} className="text-primary" />
              <h2 className="text-xl sm:text-2xl font-semibold truncate">
                {format(currentDate, "MMMM yyyy", { locale: fr })}
              </h2>
            </div>
            <Button
              onClick={onToday}
              variant="outline"
              size="sm"
              className="items-center gap-2 border-primary/20 text-primary/80 hover:bg-primary/5 hover:text-primary hover:border-primary transition-all duration-200 hidden sm:flex"
            >
              <CalendarDays className="h-4 w-4" />
              Aujourd&apos;hui
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="group h-9 w-9 border-primary/20 hover:bg-primary/5 hover:border-primary hidden sm:flex"
              onClick={handleRequestSummary}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all"
              >
                <defs>
                  <linearGradient
                    id="sparkles-gradient-header"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      stopColor="rgb(147 51 234)"
                      stopOpacity="0.8"
                      className="transition-all group-hover:[stop-opacity:1]"
                    />
                    <stop
                      offset="50%"
                      stopColor="rgb(219 39 119)"
                      stopOpacity="0.8"
                      className="transition-all group-hover:[stop-opacity:1]"
                    />
                    <stop
                      offset="100%"
                      stopColor="rgb(249 115 22)"
                      stopOpacity="0.8"
                      className="transition-all group-hover:[stop-opacity:1]"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.583a.5.5 0 0 1 0 .96L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                  fill="url(#sparkles-gradient-header)"
                />
                <path
                  d="M20 3v4M22 5h-4M6 21v-3M4 19h4"
                  stroke="url(#sparkles-gradient-header)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center">
              <div className="flex rounded-xl overflow-hidden border border-primary/20 shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 px-4 rounded-none transition-all duration-200",
                    viewMode === "month"
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-primary/5 hover:text-primary",
                  )}
                  onClick={() => onViewModeChange("month")}
                >
                  <CalendarMonth className="h-4 w-4 mr-2" />
                  Mois
                </Button>
                <div className="w-0.5 bg-primary/20" />
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 px-4 rounded-none transition-all duration-200",
                    viewMode === "week"
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-primary/5 hover:text-primary",
                  )}
                  onClick={() => onViewModeChange("week")}
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Semaine
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                onClick={onPrevious}
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={onNext}
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Drawer pour le résumé IA */}
      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="right"
      >
        <DrawerContent className="h-full w-full sm:min-w-xl ml-auto">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <DrawerTitle>{drawerTitle}</DrawerTitle>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" onClick={handleCloseDrawer}>
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription>{drawerDescription}</DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 flex flex-col min-h-0 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-4 pr-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => {
                    const messageText = getMessageText(message);
                    if (message.role === "user") return null; // Masquer le message utilisateur

                    return (
                      <motion.div
                        key={message.id}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="rounded-lg p-4 bg-muted border"
                      >
                        <Badge variant="secondary" className="mb-3">
                          Assistant
                        </Badge>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <Response>{messageText}</Response>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3 p-4"
                  >
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
                  >
                    <p className="text-sm text-destructive">
                      Une erreur est survenue lors de la génération du résumé.
                    </p>
                  </motion.div>
                )}

                {messages.length === 0 && !isLoading && !error && (
                  <div className="flex-1 flex items-center justify-center text-center text-muted-foreground text-sm p-8">
                    <div className="space-y-2">
                      <Sparkles className="h-8 w-8 mx-auto opacity-50" />
                      <p>
                        {viewMode === "month"
                          ? "Génération du résumé du mois..."
                          : viewMode === "week"
                            ? "Génération du résumé de la semaine..."
                            : "Génération du résumé de votre journée..."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
