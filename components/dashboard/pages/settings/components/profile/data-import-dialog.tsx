"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ImportEntityType,
  ImportFileFormat,
  ImportResult,
} from "@/lib/schemas/dataImport";
import {
  importData,
  parseCSV,
  validateImportData,
} from "@/lib/api/actions/dataImport.action";
import { toast } from "sonner";

interface DataImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  format: ImportFileFormat;
}

export const DataImportDialog = ({
  open,
  onOpenChange,
  format,
}: DataImportDialogProps) => {
  const [entityType, setEntityType] = useState<ImportEntityType>("clients");
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValidationErrors([]);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    setIsProcessing(true);

    try {
      const fileContent = await file.text();
      let data: Array<Record<string, unknown>> = [];

      if (format === "csv") {
        data = await parseCSV(fileContent);
      } else if (format === "json") {
        data = JSON.parse(fileContent);
      } else if (format === "excel") {
        toast.warning("Le format Excel sera traité comme CSV pour le moment");
        data = await parseCSV(fileContent);
      }

      const validation = await validateImportData(entityType, data);
      if (!validation.valid) {
        setValidationErrors(validation.errors);
        setIsProcessing(false);
        return;
      }

      const result = await importData(entityType, data);
      setImportResult(result);

      if (result.success) {
        toast.success(
          `Import réussi ! ${result.imported} élément(s) importé(s).`,
        );
      } else {
        toast.warning(
          `Import partiel : ${result.imported} réussi(s), ${result.failed} échoué(s).`,
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de l'import",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setValidationErrors([]);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const getFormatAccept = () => {
    switch (format) {
      case "csv":
        return ".csv";
      case "excel":
        return ".xlsx,.xls";
      case "json":
        return ".json";
      default:
        return "";
    }
  };

  const getFormatLabel = () => {
    switch (format) {
      case "csv":
        return "CSV";
      case "excel":
        return "Excel";
      case "json":
        return "JSON";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import {getFormatLabel()}</DialogTitle>
          <DialogDescription>
            Sélectionnez le type de données et votre fichier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="entity-type">Type de données</Label>
            <Select
              value={entityType}
              onValueChange={(value) =>
                setEntityType(value as ImportEntityType)
              }
              disabled={isProcessing}
            >
              <SelectTrigger id="entity-type">
                <SelectValue placeholder="Sélectionnez le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clients">Clients uniquement</SelectItem>
                <SelectItem value="pets">Animaux uniquement</SelectItem>
                <SelectItem value="both">Clients et animaux</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Fichier</Label>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept={getFormatAccept()}
              onChange={handleFileChange}
              disabled={isProcessing}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {file ? file.name : `Sélectionner un fichier ${getFormatLabel()}`}
            </Button>
          </div>

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">Erreurs :</div>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {isProcessing && (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Import en cours...</span>
            </div>
          )}

          {importResult && !isProcessing && (
            <Alert variant={importResult.success ? "default" : "destructive"}>
              {importResult.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                <div className="space-y-1">
                  <div className="font-semibold">
                    {importResult.success
                      ? "Import réussi !"
                      : "Import terminé avec des erreurs"}
                  </div>
                  <div className="text-sm">
                    ✓ {importResult.imported} importé(s)
                    {importResult.failed > 0 &&
                      ` • ✗ ${importResult.failed} échoué(s)`}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            {importResult ? "Fermer" : "Annuler"}
          </Button>
          {!importResult && (
            <Button onClick={handleImport} disabled={!file || isProcessing}>
              {isProcessing && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {isProcessing ? "Import..." : "Importer"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
