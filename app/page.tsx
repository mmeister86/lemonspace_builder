"use client";

import { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import AuthGuard from "./components/AuthGuard";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ViewportSwitcher, ViewportSize } from "@/components/viewport-switcher";
import Canvas from "./components/Canvas";
import { BuilderMenubar } from "./components/BuilderMenubar";
import { useCanvasStore } from "@/lib/stores/canvas-store";
import { ID } from "@/app/lib/appwrite";
import type { Block, BlockType } from "@/lib/types/board";

// Valide Block-Typen für Runtime-Validierung
const VALID_BLOCK_TYPES: BlockType[] = [
  "text",
  "heading",
  "image",
  "button",
  "spacer",
  "video",
  "form",
  "pricing",
  "testimonial",
  "accordion",
  "code",
] as const;

export default function Home() {
  const [currentViewport, setCurrentViewport] =
    useState<ViewportSize>("desktop");
  const addBlock = useCanvasStore((state) => state.addBlock);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Prüfe ob Drop auf Drop-Area erfolgt
    if (over?.id === "canvas-drop-area") {
      // Runtime-Validierung: Prüfe ob active und active.data existieren
      if (!active || !active.data) {
        console.warn(
          "[Canvas] Invalid drag event: active or active.data is missing",
          { active }
        );
        return;
      }

      // Runtime-Validierung: Prüfe ob active.data.current existiert
      if (!active.data.current) {
        console.warn(
          "[Canvas] Invalid drag event: active.data.current is missing",
          { active }
        );
        return;
      }

      const current = active.data.current;

      // Validierung: type muss ein String sein und ein gültiger BlockType
      let validatedType: BlockType = "text"; // Default
      if (
        typeof current.type === "string" &&
        VALID_BLOCK_TYPES.includes(current.type as BlockType)
      ) {
        validatedType = current.type as BlockType;
      } else if (current.type !== undefined) {
        console.warn(
          `[Canvas] Invalid block type "${current.type}", defaulting to "text"`,
          { current }
        );
      }

      // Validierung: data muss ein Objekt sein
      let validatedData: Record<string, unknown> = {};
      if (
        current.data !== null &&
        typeof current.data === "object" &&
        !Array.isArray(current.data)
      ) {
        validatedData = current.data as Record<string, unknown>;
      } else if (current.data !== undefined) {
        console.warn(
          `[Canvas] Invalid block data, expected object but got ${typeof current.data}, defaulting to {}`,
          { current }
        );
      }

      // Erstelle neuen Block mit validierten Werten
      const newBlock: Block = {
        id: ID.unique(),
        type: validatedType,
        data: validatedData,
      };

      // Füge Block hinzu
      addBlock(newBlock);

      // Drop-Area wird automatisch versteckt wenn Blöcke vorhanden sind
      // (wird im Store gehandhabt)
    }
  };

  return (
    <AuthGuard>
      <DndContext onDragEnd={handleDragEnd}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="border-b bg-background">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                  />
                  <BuilderMenubar />
                </div>
                <ViewportSwitcher
                  currentViewport={currentViewport}
                  onViewportChange={setCurrentViewport}
                />
              </div>
            </div>
            <Canvas currentViewport={currentViewport} />
          </SidebarInset>
        </SidebarProvider>
      </DndContext>
    </AuthGuard>
  );
}
