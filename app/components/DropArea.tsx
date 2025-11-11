"use client";

import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { useCanvasStore } from "@/lib/stores/canvas-store";
import { cn } from "@/lib/utils";

export function DropArea() {
  const blocks = useCanvasStore((state) => state.blocks);
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-drop-area",
  });

  const hasBlocks = blocks.length > 0;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-[90%] mx-auto rounded-lg border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-4",
        hasBlocks
          ? "min-h-[120px] p-4 mt-4"
          : "min-h-[300px] p-8",
        isOver
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-muted-foreground/30 bg-muted/20 hover:border-muted-foreground/50 hover:bg-muted/30"
      )}
    >
      <div
        className={cn(
          "rounded-full transition-colors",
          hasBlocks ? "p-2" : "p-4",
          isOver ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <Plus className={hasBlocks ? "h-5 w-5" : "h-8 w-8"} />
      </div>
      <div className="text-center">
        <h3 className={cn("font-semibold mb-2", hasBlocks ? "text-base" : "text-lg")}>
          {isOver ? "Hier ablegen" : hasBlocks ? "Weiteren Block hinzufügen" : "Inhalte hier ablegen"}
        </h3>
        {!hasBlocks && (
          <p className="text-sm text-muted-foreground">
            Ziehe Blöcke aus der Sidebar hierher, um dein Board zu erstellen
          </p>
        )}
      </div>
    </div>
  );
}
