"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Calendar,
  Weight,
  Ruler,
  PawPrint,
  ImageIcon,
  PenBox,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { getAllAnimals } from "@/lib/api/actions/animals.action";
import { Pet } from "@/lib/schemas";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/utils/uploadthing";
import { cn } from "@/lib/style";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

interface PatientBasicInfoStepProps {
  onNext: (data: any) => void;
  initialData?: any;
  patient?: Pet | null;
}

export function PatientBasicInfoStep({
  onNext,
  initialData,
  patient,
}: PatientBasicInfoStepProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dateOpen, setDateOpen] = useState(false);

  const [name, setName] = useState(initialData?.name || patient?.name || "");
  const [type, setType] = useState(initialData?.type || patient?.type || "");
  const [gender, setGender] = useState<"Male" | "Female">(
    initialData?.gender || patient?.gender || "Male",
  );
  const [breed, setBreed] = useState(
    initialData?.breed || patient?.breed || "",
  );
  const [image, setImage] = useState(
    initialData?.image || patient?.image || "",
  );
  const [birthDate, setBirthDate] = useState<Date>(
    initialData?.birthDate ||
      (patient?.birthDate ? new Date(patient.birthDate) : new Date()),
  );
  const [description, setDescription] = useState(
    initialData?.description || patient?.description || "",
  );
  const [weight, setWeight] = useState<number>(
    initialData?.weight || patient?.weight || 0,
  );
  const [height, setHeight] = useState<number>(
    initialData?.height || patient?.height || 0,
  );
  const [chippedNumber, setChippedNumber] = useState<number>(
    initialData?.chippedNumber || patient?.chippedNumber || 0,
  );

  const { data: animals = [] } = useQuery({
    queryKey: ["animals"],
    queryFn: () => getAllAnimals(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !type || !breed || !birthDate || !image || !description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (weight <= 0 || height <= 0) {
      toast.error("Le poids et la taille doivent être supérieurs à 0");
      return;
    }

    onNext({
      name,
      type,
      gender,
      breed,
      image,
      birthDate,
      description,
      weight,
      height,
      chippedNumber,
    });
  };

  const { startUpload: startImageUpload } = useUploadThing(
    "documentsUploader",
    {
      onClientUploadComplete: (res) => {
        if (res && res[0]) {
          setImage(res[0].url);
          toast.success("Image téléchargée avec succès!");
        }
      },
      onUploadProgress(p) {
        setUploadProgress(p);
      },
      onUploadError: (error) => {
        toast.error(`Erreur: ${error.message}`);
      },
    },
  );

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({
    accept: ACCEPTED_IMAGE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true);
        toast.info("Téléchargement de l'image en cours...");
        await startImageUpload(acceptedFiles);
        setIsUploading(false);
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Layout principal : Image à gauche, champs à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Image Upload - Colonne de gauche */}
        <div className="space-y-2 col-span-1">
          <label className="block text-sm font-medium">
            Photo du patient <span className="text-red-500">*</span>
          </label>
          {!image ? (
            <div className="w-full">
              <div
                {...getImageRootProps()}
                className={cn(
                  "w-full h-[150px] border-2 border-dashed border-primary/20 rounded-2xl transition-all bg-background/50 hover:bg-primary/5 cursor-pointer",
                  isImageDragActive && "border-primary bg-primary/5",
                )}
              >
                <input {...getImageInputProps()} />
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ImageIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-xs font-medium text-primary">
                      Glissez-déposez
                    </p>
                    <p className="text-xs text-muted-foreground">ou cliquez</p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG • 5MB
                    </p>
                  </div>
                </div>
              </div>
              {isUploading && (
                <div className="w-full mt-2">
                  <div className="h-1 w-full bg-primary/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full">
              <div className="group relative w-full h-[200px] rounded-2xl overflow-hidden border-2 border-primary/20">
                <Image
                  width={200}
                  height={200}
                  src={image}
                  alt="photo du patient"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    {...getImageRootProps()}
                    className="w-full h-full absolute inset-0 flex items-center justify-center gap-2"
                  >
                    <input {...getImageInputProps()} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-xl text-white hover:text-white"
                    >
                      <PenBox size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-xl text-white hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage("");
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tous les champs - Colonne de droite */}
        <div className="space-y-4 h-full col-span-2">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nom <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Ex: Luna"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Date de naissance <span className="text-red-500">*</span>
              </label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {birthDate.toLocaleDateString("fr-FR")}
                    </div>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <CalendarComponent
                    mode="single"
                    selected={birthDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (date) setBirthDate(date);
                      setDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Animal Type & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Type d'animal <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <PawPrint className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="pl-9 w-full">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {animals.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id ?? ""}>
                        {animal.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Sexe <span className="text-red-500">*</span>
              </label>
              <Select
                value={gender}
                onValueChange={(val) => setGender(val as "Male" | "Female")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Mâle</SelectItem>
                  <SelectItem value="Female">Femelle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Physical Info */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Poids (kg) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Weight className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              step="0.1"
              className="pl-9"
              placeholder="Ex: 25.5"
              value={weight || ""}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Taille (cm) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Ruler className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              className="pl-9"
              placeholder="Ex: 60"
              value={height || ""}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Race <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ex: Border Collie"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          />
        </div>
      </div>

      {/* Additional Info */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Numéro d'identification
        </label>
        <Input
          type="text"
          placeholder="Numéro d'identification"
          value={chippedNumber || ""}
          onChange={(e) =>
            setChippedNumber(e.target.value ? parseInt(e.target.value) : 0)
          }
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          placeholder="Décrivez votre animal..."
          className="resize-none h-20"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isUploading}>
          Suivant
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
