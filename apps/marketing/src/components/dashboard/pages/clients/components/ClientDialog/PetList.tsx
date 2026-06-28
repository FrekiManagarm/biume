import { PetCard } from "./PetCard";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { Pet } from "@/lib/schemas";

export const PetList = React.memo(function PetList(props: {
  fields: Pet[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}) {
  return (
    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
      <AnimatePresence initial={false}>
        {props.fields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-md">
            Aucun animal ajouté pour ce client
          </div>
        ) : (
          props.fields.map((pet, index) => (
            <PetCard
              key={pet.id}
              pet={pet}
              index={index}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
});
