"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { useState } from "react";
import { DataImportDialog } from "./data-import-dialog";
import { ImportFileFormat } from "@/lib/schemas/dataImport";

export const ProfileDataImportSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ImportFileFormat>("csv");

  const handleOpenDialog = (format: ImportFileFormat) => {
    setSelectedFormat(format);
    setDialogOpen(true);
  };

  const downloadTemplate = (format: ImportFileFormat) => {
    let content = "";
    let filename = "";
    let type = "";

    if (format === "csv") {
      content = "name,email,phone,city,country\nJean Dupont,jean@example.com,0612345678,Paris,France\nMarie Martin,marie@example.com,0687654321,Lyon,France";
      filename = "template_clients.csv";
      type = "text/csv";
    } else if (format === "json") {
      content = JSON.stringify(
        [
          {
            name: "Jean Dupont",
            email: "jean@example.com",
            phone: "0612345678",
            city: "Paris",
            country: "France",
          },
          {
            name: "Marie Martin",
            email: "marie@example.com",
            phone: "0687654321",
            city: "Lyon",
            country: "France",
          },
        ],
        null,
        2
      );
      filename = "template_clients.json";
      type = "application/json";
    } else {
      content = "name,email,phone,city,country\nJean Dupont,jean@example.com,0612345678,Paris,France\nMarie Martin,marie@example.com,0687654321,Lyon,France";
      filename = "template_clients.csv";
      type = "text/csv";
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Import des données</CardTitle>
          <CardDescription className="text-sm">
            Importez vos clients et animaux depuis un fichier.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenDialog("csv")}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Importer CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenDialog("excel")}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Importer Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenDialog("json")}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Importer JSON
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadTemplate("csv")}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Modèle CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadTemplate("excel")}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Modèle Excel
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadTemplate("json")}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Modèle JSON
            </Button>
          </div>
        </CardContent>
      </Card>

      <DataImportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        format={selectedFormat}
      />
    </>
  );
};
