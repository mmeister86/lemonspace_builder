"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useCanvasStore } from "@/lib/stores/canvas-store";
import { useUpdateBoard } from "@/app/lib/hooks/use-boards";

interface BlockDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blockId: string | null;
}

export function BlockDeleteDialog({
  open,
  onOpenChange,
  blockId,
}: BlockDeleteDialogProps) {
  const removeBlock = useCanvasStore((state) => state.removeBlock);
  const addBlock = useCanvasStore((state) => state.addBlock);
  const currentBoard = useCanvasStore((state) => state.currentBoard);
  const blocks = useCanvasStore((state) => state.blocks);
  const updateBoardMutation = useUpdateBoard();

  const handleDelete = async () => {
    if (!blockId) return;

    // Finde den zu löschenden Block für möglichen Rollback
    const blockToDelete = blocks.find((b) => b.id === blockId);
    if (!blockToDelete) return;

    // Berechne aktualisierte Blöcke vor dem Entfernen
    const updatedBlocks = blocks.filter((b) => b.id !== blockId);

    // Optimistic UI: Entferne Block sofort aus Store
    removeBlock(blockId);

    // Aktualisiere Board in AppWrite, falls ein Board geladen ist
    if (currentBoard) {
      try {
        // Warte auf erfolgreiche Backend-Mutation
        await updateBoardMutation.mutateAsync({
          boardId: currentBoard.id,
          boardData: {
            ...currentBoard,
            blocks: updatedBlocks,
          },
        });

        // Bei Erfolg: Dialog schließen
        onOpenChange(false);
      } catch (error) {
        // Rollback: Füge Block wieder hinzu bei Fehler
        addBlock(blockToDelete);
        console.error("Fehler beim Speichern des Boards:", error);
        toast.error("Fehler beim Löschen des Blocks", {
          description:
            "Der Block konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.",
        });
        // Dialog bleibt offen, damit der Benutzer es erneut versuchen kann
      }
    } else {
      // Falls kein Board geladen ist, schließe Dialog direkt
      onOpenChange(false);
    }
  };

  if (!blockId) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Block löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Diese Aktion kann nicht rückgängig gemacht werden. Der Block wird
            dauerhaft vom Board entfernt.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
