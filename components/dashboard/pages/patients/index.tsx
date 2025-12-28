"use client";

import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  PawPrint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { Pet } from "@/lib/schemas";
import { AnimalCredenza } from "@/components/animal-folder/index";
import { useState } from "react";
import { PatientStepperDialog } from "./components/PatientStepperDialog";

// Types pour les patients
type PetType = "Chien" | "Chat" | "Oiseau" | "Cheval" | "Vache" | "NAC";
type PetGender = "Mâle" | "Femelle";

interface Patient {
  id: string;
  nom: string;
  type: PetType;
  race: string;
  sexe: PetGender;
  age: number;
  proprietaire: string;
  derniereConsultation?: Date;
  dateCreation: Date;
}

// Source de données alimentée par les props des pages

// Fonction helper pour le badge de type (tolère une string générique)
const getTypeBadge = (type: string) => {
  const variants = {
    Chien: { variant: "default" as const, emoji: "🐕" },
    Chat: { variant: "secondary" as const, emoji: "🐈" },
    Oiseau: { variant: "outline" as const, emoji: "🦜" },
    Cheval: { variant: "outline" as const, emoji: "🐴" },
    Vache: { variant: "outline" as const, emoji: "🐄" },
    NAC: { variant: "outline" as const, emoji: "🐹" },
  };

  const normalized =
    type in variants ? (type as keyof typeof variants) : ("NAC" as const);
  const config = variants[normalized];
  return (
    <Badge variant={config.variant}>
      <span className="mr-1">{config.emoji}</span>
      {type || "NAC"}
    </Badge>
  );
};

type PatientsTableProps = {
  items?: Pet[];
  initialSearch?: string;
  initialType?: string;
  initialPage?: number;
};

export function PatientsTable({
  items,
  initialSearch = "",
  initialType = "tous",
  initialPage = 1,
}: PatientsTableProps) {
  const [openAddPatient, setOpenAddPatient] = useState(false);
  const [openEditPatient, setOpenEditPatient] = useState(false);
  const [openDetailsPatient, setOpenDetailsPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Pet | null>(null);
  const [editingPatient, setEditingPatient] = useState<Pet | null>(null);
  const [{ search, type, page }, setQuery] = useQueryStates({
    search: parseAsString.withDefault(initialSearch),
    type: parseAsString.withDefault(initialType),
    page: parseAsInteger.withDefault(initialPage),
  });
  const searchQuery = search;
  const typeFilter = type;
  const currentPage = page;
  const itemsPerPage = 10;

  // Filtrage des patients (sans useMemo)
  const dataSource: Pet[] = items ?? [];

  const filteredPatients = dataSource.filter((patient) => {
    const matchesSearch =
      searchQuery === "" ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.owner?.name ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "tous" || (patient.animal?.name ?? "") === typeFilter;

    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      {/* Header séparé */}
      <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="bg-linear-to-r from-primary to-secondary bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                Mes Patients
              </h1>
              <p className="text-muted-foreground text-sm">
                Aperçu de vos patients
              </p>
            </div>
            <Button onClick={() => setOpenAddPatient(true)}>
              <Plus />
              Ajouter un patient
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contenu */}
      {dataSource.length > 0 ? (
        <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
          <CardContent>
            <div className="space-y-4">
              {/* Filtres */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    placeholder="Rechercher par nom, race ou propriétaire..."
                    value={searchQuery}
                    onChange={(e) =>
                      setQuery({ search: e.target.value, page: 1 })
                    }
                    className="pl-9"
                  />
                </div>
                <Select
                  value={typeFilter}
                  onValueChange={(val) => setQuery({ type: val, page: 1 })}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrer par type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les types</SelectItem>
                    <SelectItem value="Chien">🐕 Chien</SelectItem>
                    <SelectItem value="Chat">🐈 Chat</SelectItem>
                    <SelectItem value="Oiseau">🦜 Oiseau</SelectItem>
                    <SelectItem value="Cheval">🐴 Cheval</SelectItem>
                    <SelectItem value="Vache">🐄 Vache</SelectItem>
                    <SelectItem value="NAC">🐹 NAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Statistiques */}
              <div className="text-muted-foreground text-sm">
                {filteredPatients.length} patient
                {filteredPatients.length > 1 ? "s" : ""} trouvé
                {filteredPatients.length > 1 ? "s" : ""}
              </div>

              {/* Table ou Empty state si filtrage sans résultat */}
              {filteredPatients.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Search />
                    </EmptyMedia>
                    <EmptyTitle>Aucun résultat</EmptyTitle>
                    <EmptyDescription>
                      Aucun patient ne correspond à vos critères de recherche.
                      Essayez de modifier vos filtres.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setQuery({ search: "", type: "tous", page: 1 })
                      }
                    >
                      Réinitialiser les filtres
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Race</TableHead>
                          <TableHead>Sexe</TableHead>
                          <TableHead>Âge</TableHead>
                          <TableHead>Propriétaire</TableHead>
                          <TableHead>Dernier rapport</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentPatients.map((patient) => (
                          <TableRow key={patient.id}>
                            <TableCell>
                              <div className="font-medium">{patient.name}</div>
                            </TableCell>
                            <TableCell>
                              {getTypeBadge(
                                patient.animal?.name ??
                                  (patient.animal?.name as string) ??
                                  "NAC",
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {patient.breed}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {patient.gender === "Male" ? "Mâle" : "Femelle"}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {(() => {
                                const birth = patient.birthDate
                                  ? new Date(patient.birthDate)
                                  : null;
                                if (!birth) return "—";
                                const today = new Date();
                                let age =
                                  today.getFullYear() - birth.getFullYear();
                                const m = today.getMonth() - birth.getMonth();
                                if (
                                  m < 0 ||
                                  (m === 0 && today.getDate() < birth.getDate())
                                ) {
                                  age--;
                                }
                                return `${age} an${age > 1 ? "s" : ""}`;
                              })()}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {patient.owner?.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {(() => {
                                const reports = patient.advancedReport || [];
                                if (reports.length === 0) return "—";
                                const latest = reports
                                  .filter((r) => r?.createdAt)
                                  .sort(
                                    (a, b) =>
                                      new Date(
                                        b.createdAt as unknown as string,
                                      ).getTime() -
                                      new Date(
                                        a.createdAt as unknown as string,
                                      ).getTime(),
                                  )[0];
                                if (!latest?.createdAt) return "—";
                                const d = new Date(
                                  latest.createdAt as unknown as string,
                                );
                                return d.toLocaleDateString("fr-FR", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                });
                              })()}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="size-4" />
                                    <span className="sr-only">
                                      Ouvrir le menu
                                    </span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedPatient(patient);
                                      setOpenDetailsPatient(true);
                                    }}
                                  >
                                    <Eye className="size-4" />
                                    Voir les détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setEditingPatient(patient);
                                      setOpenEditPatient(true);
                                    }}
                                  >
                                    <Edit className="size-4" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="size-4" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="text-muted-foreground text-sm">
                        Page {currentPage} sur {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setQuery({ page: Math.max(1, currentPage - 1) })
                          }
                          disabled={currentPage === 1}
                        >
                          Précédent
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setQuery({
                              page: Math.min(totalPages, currentPage + 1),
                            })
                          }
                          disabled={currentPage === totalPages}
                        >
                          Suivant
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PawPrint />
                </EmptyMedia>
                <EmptyTitle>Aucun patient</EmptyTitle>
                <EmptyDescription>
                  Vous n&apos;avez pas encore de patients. Commencez par en
                  ajouter un.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => setOpenAddPatient(true)}>
                  <Plus />
                  Ajouter votre premier patient
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      )}

      <PatientStepperDialog
        open={openAddPatient}
        onOpenChange={setOpenAddPatient}
        mode="create"
      />
      <PatientStepperDialog
        open={openEditPatient}
        onOpenChange={setOpenEditPatient}
        mode="edit"
        patient={editingPatient}
      />

      <AnimalCredenza
        isOpen={openDetailsPatient}
        onOpenChange={setOpenDetailsPatient}
        petId={selectedPatient?.id ?? ""}
      />
    </div>
  );
}
