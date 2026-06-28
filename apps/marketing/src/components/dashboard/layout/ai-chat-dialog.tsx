"use client";

import { useState, useRef, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  FileText,
  Repeat,
  BarChart,
  ListChecks,
  Calendar,
  Activity,
  ClipboardCheck,
} from "lucide-react";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/style";
import type { BiumeUIMessage } from "@/lib/ai/types";
import { useAppContext } from "@/hooks/useAppContext";
import { addActionToHistory } from "@/lib/ai/context-builder";

// AI Elements imports
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageAvatar,
} from "@/components/ai-elements/message";
import {
  Tool,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { Loader } from "@/components/ai-elements/loader";
import { Response } from "@/components/ai-elements/response";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Spinner } from "@/components/ui/spinner";

interface AIChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Commandes disponibles
const commands = [
  {
    name: "/create",
    description: "Créer un nouveau rapport, patient ou client",
    icon: FileText,
  },
  {
    name: "/resume",
    description: "Résumer un patient ou rapport",
    icon: Repeat,
  },
  {
    name: "/analyse",
    description: "Résumé chiffré des consultations d'un patient",
    icon: BarChart,
  },
  {
    name: "/synthese",
    description: "Synthèse narrative des consultations d'un patient",
    icon: ListChecks,
  },
  {
    name: "/followup",
    description: "Suivi médical approfondi d'un patient",
    icon: Activity,
  },
  {
    name: "/schedule",
    description: "Voir les créneaux disponibles ou planifier un RDV",
    icon: Calendar,
  },
  {
    name: "/todo",
    description: "Voir les tâches à faire",
    icon: ClipboardCheck,
  },
];

// Suggestions initiales
const QUICK_SUGGESTIONS = [
  "Créer un nouveau rapport",
  "Résumer le dernier patient",
  "Voir mes créneaux disponibles",
  "Analyser les consultations",
];

const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
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

// Fonction pour obtenir un titre lisible pour un outil
function getToolDisplayName(toolType: string): string {
  const toolNames: Record<string, string> = {
    createClientTool: "Création d'un client",
    createPetTool: "Création d'un patient",
    createReportTool: "Création d'un rapport",
    getPatientDetailsTool: "Détails du patient",
    searchClientsTool: "Recherche de clients",
    searchPetsTool: "Recherche de patients",
    summarizeConsultationsTool: "Résumé des consultations",
    synthesizeConsultationsTool: "Synthèse des consultations",
    analyzeAnatomyTool: "Analyse anatomique",
    followupTool: "Suivi médical",
    getAppointmentsTool: "Rendez-vous",
    createAppointmentTool: "Création d'un rendez-vous",
    updateAppointmentTool: "Modification d'un rendez-vous",
    getAppointmentsWithoutReportTool: "Rendez-vous sans rapport",
  };

  // Enlever le préfixe "tool-" si présent
  const cleanType = toolType.replace(/^tool-/, "");
  return toolNames[cleanType] || cleanType;
}

export function AIChatDialog({ open, onOpenChange }: AIChatDialogProps) {
  const [inputText, setInputText] = useState("");
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const appContext = useAppContext();

  const { messages, status, error, sendMessage, setMessages } =
    useChat<BiumeUIMessage>({
      transport: new DefaultChatTransport({
        api: `/api/chat`,
      }),
      onFinish: (message) => {
        console.log("Message terminé:", message);
      },
    });

  // Helper pour vérifier si on est en train de streamer
  const isStreaming = status === "streaming";

  // Filtrer les commandes en fonction du texte
  const filteredCommands = useMemo(() => {
    if (!inputText.startsWith("/")) return [];
    return commands.filter((cmd) =>
      cmd.name.toLowerCase().includes(inputText.toLowerCase()),
    );
  }, [inputText]);

  // Détecter si on doit afficher l'autocomplétion
  const shouldShowAutocomplete =
    inputText.startsWith("/") && !inputText.includes(" ");

  // Réinitialiser l'index sélectionné quand les commandes filtrées changent
  useMemo(() => {
    setSelectedCommandIndex(0);
  }, [filteredCommands]);

  const handleSend = async () => {
    if (!inputText.trim()) {
      toast.error("Veuillez saisir une question");
      return;
    }

    // Si l'autocomplétion des commandes est affichée, Enter ne doit PAS envoyer
    if (shouldShowAutocomplete && filteredCommands.length > 0) {
      return;
    }

    // Ajouter l'action à l'historique
    addActionToHistory(
      `Envoyé: "${inputText.substring(0, 50)}${inputText.length > 50 ? "..." : ""}"`,
    );

    await sendMessage(
      {
        text: inputText,
      },
      {
        body: {
          context: appContext,
        },
      },
    );
    setInputText("");
  };

  // Gérer la sélection d'une commande
  const handleCommandSelect = (commandName: string) => {
    setInputText(commandName + " ");
    inputRef.current?.focus();
  };

  // Gérer la sélection d'une suggestion
  const handleQuickSuggestion = async (suggestion: string) => {
    addActionToHistory(`Suggestion: "${suggestion}"`);

    await sendMessage(
      {
        text: suggestion,
      },
      {
        body: {
          context: appContext,
        },
      },
    );
  };

  const handleReset = () => {
    setMessages([]);
    setInputText("");
    addActionToHistory("Conversation réinitialisée");
    toast.info("Conversation réinitialisée");
  };

  // Fonction pour rendre les parts d'un message (tools, data, etc.)
  const renderMessageParts = (message: any) => {
    if (!message.parts || !Array.isArray(message.parts)) {
      return null;
    }

    return message.parts.map((part: any, index: number) => {
      const key = `${message.id}-part-${index}`;

      // Ignorer les parts de type texte (déjà rendues)
      if (part.type === "text") {
        return null;
      }

      // Rendre les tools avec les AI Elements
      if (part.type.startsWith("tool-")) {
        const toolName = getToolDisplayName(part.type);

        return (
          <Tool key={key} defaultOpen={false}>
            <ToolHeader title={toolName} type={part.type} state={part.state} />
            {part.args && Object.keys(part.args).length > 0 && (
              <ToolInput input={part.args} />
            )}
            {(part.result || part.errorText) && (
              <ToolOutput output={part.result} errorText={part.errorText} />
            )}
          </Tool>
        );
      }

      // Autres types de parts (data, etc.)
      return null;
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-full sm:max-w-2xl lg:min-w-[35vw] ml-auto flex flex-col border-l shadow-2xl">
        {/* Header */}
        <DrawerHeader className="border-b shrink-0 bg-linear-to-r from-background to-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="header-sparkle-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="rgb(147 51 234)" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="rgb(219 39 119)" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="rgb(249 115 22)" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.583a.5.5 0 0 1 0 .96L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                    fill="url(#header-sparkle-gradient)"
                  />
                </svg>
              </div>
              <div>
                <DrawerTitle className="text-lg">Assistant Biume</DrawerTitle>
                <DrawerDescription className="text-xs mt-0.5">
                  Propulsé par l'IA
                </DrawerDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  size="icon"
                  title="Nouvelle conversation"
                  className="h-8 w-8"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </div>
          <DrawerDescription className="mt-2">
            Votre copilote pour gérer vos patients, analyser les consultations
            et organiser votre planning
          </DrawerDescription>
        </DrawerHeader>

        {/* Conversation avec AI Elements */}
        <div className="flex-1 min-h-0 flex flex-col">
          <Conversation className="flex-1">
            <ConversationContent className="space-y-4">
              {messages.length === 0 && status !== "streaming" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <ConversationEmptyState
                    icon={
                      <div className="relative flex items-center justify-center">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <linearGradient
                              id="empty-state-sparkle-gradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor="rgb(147 51 234)" stopOpacity="1" />
                              <stop offset="50%" stopColor="rgb(219 39 119)" stopOpacity="1" />
                              <stop offset="100%" stopColor="rgb(249 115 22)" stopOpacity="1" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.583a.5.5 0 0 1 0 .96L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                            fill="url(#empty-state-sparkle-gradient)"
                          />
                          <path
                            d="M20 3v4M22 5h-4M6 21v-3M4 19h4"
                            stroke="url(#empty-state-sparkle-gradient)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute inset-0 animate-pulse opacity-40"
                        >
                          <path
                            d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.583a.5.5 0 0 1 0 .96L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                            fill="url(#empty-state-sparkle-gradient)"
                          />
                          <path
                            d="M20 3v4M22 5h-4M6 21v-3M4 19h4"
                            stroke="url(#empty-state-sparkle-gradient)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    }
                    title="Bienvenue dans l'assistant IA unifié"
                    description="Posez une question ou utilisez les suggestions ci-dessous pour commencer"
                  />
                </motion.div>
              )}

              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => {
                  const messageText = getMessageText(message);
                  const isLastMessage = index === messages.length - 1;
                  const isStreamingThisMessage =
                    isStreaming &&
                    isLastMessage &&
                    message.role === "assistant";

                  return (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Message from={message.role}>
                        <MessageAvatar
                          src={
                            message.role === "user"
                              ? "/images/user-avatar.png"
                              : "/images/ai-avatar.png"
                          }
                          name={message.role === "user" ? "Vous" : "IA"}
                        />
                        <MessageContent variant="flat">
                          {renderMessageParts(message)}

                          {/* Si c'est l'assistant qui stream et qu'il n'y a pas encore de texte, afficher le loader */}
                          {isStreamingThisMessage && !messageText && (
                            <div className="flex items-center gap-3">
                              <Spinner className="size-4" />
                              <Shimmer className="text-sm" duration={1.5}>
                                L'assistant réfléchit...
                              </Shimmer>
                            </div>
                          )}

                          {/* Si il y a du texte */}
                          {messageText && isStreamingThisMessage && (
                            <Response>{messageText}</Response>
                          )}

                          {messageText && !isStreamingThisMessage && (
                            <Response>{messageText}</Response>
                          )}
                        </MessageContent>
                      </Message>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mx-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-destructive/20 p-2">
                      <X className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-destructive mb-1">
                        Une erreur est survenue
                      </p>
                      <p className="text-xs text-destructive/80">
                        Veuillez réessayer ou reformuler votre question.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Suggestions rapides (affichées au début) */}
          {messages.length === 0 && !isStreaming && (
            <div className="px-4 pb-2 shrink-0">
              <p className="text-sm font-medium mb-2">Questions rapides :</p>
              <div className="flex flex-col gap-2">
                {QUICK_SUGGESTIONS.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(suggestion)}
                    disabled={isStreaming}
                    className="justify-start text-xs"
                  >
                    {index === 0 && <FileText className="h-3 w-3 mr-2" />}
                    {index === 1 && <Repeat className="h-3 w-3 mr-2" />}
                    {index === 2 && <Calendar className="h-3 w-3 mr-2" />}
                    {index === 3 && <BarChart className="h-3 w-3 mr-2" />}
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Zone de saisie */}
          <div className="p-4 border-t shrink-0 bg-linear-to-t from-muted/10 to-background">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Tapez / pour les commandes ou posez votre question..."
                  className={cn(
                    "pr-4 transition-all duration-200",
                    inputText && "ring-2 ring-primary/20",
                  )}
                  onKeyDown={(e) => {
                    // Navigation dans l'autocomplétion
                    if (shouldShowAutocomplete && filteredCommands.length > 0) {
                      switch (e.key) {
                        case "ArrowDown":
                          e.preventDefault();
                          setSelectedCommandIndex((prev) =>
                            prev < filteredCommands.length - 1 ? prev + 1 : 0,
                          );
                          return;
                        case "ArrowUp":
                          e.preventDefault();
                          setSelectedCommandIndex((prev) =>
                            prev > 0 ? prev - 1 : filteredCommands.length - 1,
                          );
                          return;
                        case "Enter":
                          if (filteredCommands[selectedCommandIndex]) {
                            e.preventDefault();
                            handleCommandSelect(
                              filteredCommands[selectedCommandIndex].name,
                            );
                            return;
                          }
                          break;
                        case "Escape":
                          e.preventDefault();
                          setInputText("");
                          setSelectedCommandIndex(0);
                          return;
                      }
                    }

                    // Envoi du message
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isStreaming}
                />

                {/* Autocomplétion des commandes */}
                {shouldShowAutocomplete && filteredCommands.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 mb-2 w-full z-50"
                  >
                    <Command className="rounded-lg border shadow-lg bg-background/95 backdrop-blur-sm">
                      <CommandList>
                        <CommandGroup heading="Commandes disponibles">
                          {filteredCommands.map((cmd, index) => {
                            const Icon = cmd.icon;
                            const isSelected = index === selectedCommandIndex;
                            return (
                              <CommandItem
                                key={cmd.name}
                                onSelect={() => handleCommandSelect(cmd.name)}
                                className={cn(
                                  "cursor-pointer",
                                  isSelected &&
                                  "bg-accent text-accent-foreground",
                                )}
                                onMouseEnter={() =>
                                  setSelectedCommandIndex(index)
                                }
                              >
                                <Icon className="mr-2 h-4 w-4" />
                                <div className="flex flex-col flex-1">
                                  <span className="font-medium">
                                    {cmd.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {cmd.description}
                                  </span>
                                </div>
                                {isSelected && (
                                  <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">↵</span>
                                  </kbd>
                                )}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </motion.div>
                )}
              </div>
              <Button
                onClick={handleSend}
                disabled={isStreaming || !inputText.trim()}
                size="icon"
                className={cn(
                  "shrink-0 transition-all duration-200",
                  inputText.trim() &&
                  !isStreaming &&
                  "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20",
                )}
              >
                {isStreaming ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
