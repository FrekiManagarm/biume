"use client";

import { motion } from "framer-motion";
import { ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pet } from "@/lib/schemas";

interface PetCardProps {
  pet: Pet;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function PetCard({ pet, index, onEdit, onDelete }: PetCardProps) {
  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      DOG: "Chien",
      CAT: "Chat",
      HORSE: "Cheval",
      OTHER: "Autre",
    };
    return types[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      DOG: "bg-amber-100 text-amber-800",
      CAT: "bg-purple-100 text-purple-800",
      HORSE: "bg-emerald-100 text-emerald-800",
      OTHER: "bg-pink-100 text-pink-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">{pet.name}</CardTitle>
            {/* <div className="text-xs mt-1 text-muted-foreground">
              <Badge className={`${getTypeColor(pet.animal.code ?? "")} mr-1`}>
                {getTypeLabel(pet.animal.code ?? "")}
              </Badge>
              {pet.breed}
            </div> */}
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(index)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onDelete(index)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
