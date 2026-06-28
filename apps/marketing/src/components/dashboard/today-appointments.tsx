"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Home,
  ArrowRight,
  PawPrint,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/style";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty";
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
import { X } from "lucide-react";
import { useDailySummary } from "@/hooks/useDailySummary";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Response } from "../ai-elements/response";

const statusConfig = {
  CREATED: {
    label: "Créé",
    color:
      "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  },
  CONFIRMED: {
    label: "Confirmé",
    color:
      "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  },
  CANCELLED: {
    label: "Annulé",
    color: "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  },
  COMPLETED: {
    label: "Terminé",
    color:
      "bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400",
  },
};

interface TodayAppointmentsProps {
  appointments: Awaited<
    ReturnType<
      typeof import("@/lib/api/actions/appointments.action").getTodayAppointments
    >
  >;
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

export function TodayAppointments({
  appointments,
  organizationId,
}: TodayAppointmentsProps) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const { messages, isLoading, error, requestDailySummary, reset } =
    useDailySummary();

  const handleRequestSummary = async () => {
    setIsDrawerOpen(true);
    if (messages.length === 0) {
      try {
        await requestDailySummary(organizationId);
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

  return (
    <>
      <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">
              Rendez-vous du jour
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="group size-8"
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
                    id="sparkles-gradient"
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
                  fill="url(#sparkles-gradient)"
                />
                <path
                  d="M20 3v4M22 5h-4M6 21v-3M4 19h4"
                  stroke="url(#sparkles-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/dashboard/agenda"
                className="flex items-center gap-1"
              >
                Voir l&apos;agenda
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <Empty className="py-8">
              <EmptyHeader>
                <EmptyMedia>
                  <Calendar className="size-10 text-muted-foreground/50" />
                </EmptyMedia>
                <EmptyTitle>Aucun rendez-vous aujourd&apos;hui</EmptyTitle>
                <EmptyDescription>
                  Profitez de cette journée calme ou planifiez de nouveaux
                  rendez-vous.
                </EmptyDescription>
                <EmptyContent className="pt-4">
                  <Button asChild variant="outline">
                    <Link href="/dashboard/agenda">
                      <Plus />
                      Créer un rendez-vous
                    </Link>
                  </Button>
                </EmptyContent>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => {
                const statusInfo = statusConfig[appointment.status];

                return (
                  <Link
                    key={appointment.id}
                    href="/dashboard/agenda"
                    className={cn(
                      "block rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50",
                      appointment.status === "CANCELLED" && "opacity-60",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        {/* Horaire et statut */}
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-muted-foreground" />
                          <span className="font-medium">
                            {format(new Date(appointment.beginAt), "HH:mm", {
                              locale: fr,
                            })}
                            {" - "}
                            {format(new Date(appointment.endAt), "HH:mm", {
                              locale: fr,
                            })}
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn("text-xs", statusInfo.color)}
                          >
                            {statusInfo.label}
                          </Badge>
                        </div>

                        {/* Informations patient */}
                        <div className="flex items-center gap-2">
                          <PawPrint className="size-4 text-muted-foreground" />
                          <span className="font-medium">
                            {appointment.patient.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            (
                            {appointment.patient.animal?.name ||
                              "Animal non spécifié"}
                            )
                          </span>
                        </div>

                        {/* Propriétaire */}
                        {appointment.patient.owner && (
                          <div className="text-sm text-muted-foreground">
                            {appointment.patient.owner.name}
                          </div>
                        )}

                        {/* Lieu */}
                        {appointment.atHome && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Home className="size-3.5" />
                            <span>À domicile</span>
                          </div>
                        )}

                        {/* Note */}
                        {appointment.note && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {appointment.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drawer pour le résumé IA */}
      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="right"
      >
        <DrawerContent className="h-full w-full sm:max-w-md ml-auto">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <DrawerTitle>Résumé de la journée</DrawerTitle>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" onClick={handleCloseDrawer}>
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription>
              Votre assistant IA vous présente un résumé de votre journée
            </DrawerDescription>
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
                      <p>Génération du résumé de votre journée...</p>
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
