"use client";

import * as React from "react";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  UserCircle,
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
import { Client } from "@/lib/schemas";
import { ClientDetailsDialog } from "@/components/dashboard/pages/clients/components/ClientDetailsDialog";
import { ClientDialog } from "./components/ClientDialog/ClientDialog";

// Fonction de formatage de date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

type ClientsTableProps = {
  items?: Client[];
  initialSearch?: string;
  initialPage?: number;
};

export function ClientsTable({
  items,
  initialSearch = "",
  initialPage = 1,
}: ClientsTableProps) {
  const [openAddClient, setOpenAddClient] = React.useState(false);
  const [openEditClient, setOpenEditClient] = React.useState(false);
  const [openDetailsClient, setOpenDetailsClient] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(
    null,
  );
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  const [{ search, page, status }, setQuery] = useQueryStates({
    search: parseAsString.withDefault(initialSearch),
    page: parseAsInteger.withDefault(initialPage),
    status: parseAsString.withDefault("tous"),
  });
  const searchQuery = search;
  const currentPage = page;
  const statusFilter = status;
  const itemsPerPage = 10;

  // Pagination
  const totalPages = Math.ceil(items?.length ?? 0 / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = items?.slice(startIndex, endIndex) ?? [];

  return (
    <div className="space-y-4">
      {/* Header séparé */}
      <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Mes Clients
              </h1>
              <p className="text-muted-foreground text-sm">
                Aperçu de vos clients
              </p>
            </div>
            <Button onClick={() => setOpenAddClient(true)}>
              <UserPlus />
              Ajouter un client
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contenu */}
      {items?.length && items?.length > 0 ? (
        <Card className="border-border/70 bg-card/80 backdrop-blur-sm">
          <CardContent>
            <div className="space-y-4">
              {/* Filtres */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    placeholder="Rechercher par nom, email ou téléphone..."
                    value={searchQuery}
                    onChange={(e) =>
                      setQuery(
                        { search: e.target.value, page: 1 },
                        {
                          shallow: false,
                        },
                      )
                    }
                    className="pl-9"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setQuery({ status: val, page: 1 })}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Statistiques */}
              <div className="text-muted-foreground text-sm">
                {items?.length} client
                {items?.length && items?.length > 1 ? "s" : ""} trouvé
                {items?.length && items?.length > 1 ? "s" : ""}
              </div>

              {/* Table ou Empty state si filtrage sans résultat */}
              {items?.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Search />
                    </EmptyMedia>
                    <EmptyTitle>Aucun résultat</EmptyTitle>
                    <EmptyDescription>
                      Aucun client ne correspond à vos critères de recherche.
                      Essayez de modifier vos filtres.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setQuery({ search: "", status: "tous", page: 1 })
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
                          <TableHead>Client</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Patients</TableHead>
                          <TableHead>Créé le</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <div className="font-medium">{client.name}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="text-muted-foreground size-3" />
                                  <span className="truncate">
                                    {client.email}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="text-muted-foreground size-3" />
                                  <span>{client.phone}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {client.pets.length || 0} patient
                                {client.pets.length > 1 ? "s" : ""}
                              </Badge>
                            </TableCell>
                            {/* <TableCell>{getStatusBadge(client.status) ?? "Actif"}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {client.lastVisit
                              ? formatDate(client.lastVisit ?? new Date())
                              : "—"}
                          </TableCell> */}
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDate(client.createdAt ?? new Date())}
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
                                      setSelectedClient(client);
                                      setOpenDetailsClient(true);
                                    }}
                                  >
                                    <Eye className="size-4" />
                                    Voir les détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setEditingClient(client);
                                      setOpenEditClient(true);
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
          <CardContent className="pt-6">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UserCircle />
                </EmptyMedia>
                <EmptyTitle>Aucun client</EmptyTitle>
                <EmptyDescription>
                  Vous n&apos;avez pas encore de clients. Commencez par en
                  ajouter un.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => setOpenAddClient(true)}>
                  <UserPlus />
                  Ajouter votre premier client
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      )}
      <ClientDialog open={openAddClient} onOpenChange={setOpenAddClient} />
      <ClientDetailsDialog
        open={openDetailsClient}
        onOpenChange={setOpenDetailsClient}
        client={selectedClient}
      />
    </div>
  );
}
