"use client";

import { ViewportSize } from "@/components/viewport-switcher";
import { DropArea } from "./DropArea";
import { useCanvasStore } from "@/lib/stores/canvas-store";

interface CanvasProps {
  currentViewport: ViewportSize;
}

export default function Canvas({ currentViewport }: CanvasProps) {
  const blocks = useCanvasStore((state) => state.blocks);

  const getViewportClasses = (viewport: ViewportSize) => {
    switch (viewport) {
      case "desktop":
        return "w-full max-w-[1200px] mx-auto";
      case "tablet":
        return "w-[768px] mx-auto border-x";
      case "mobile":
        return "w-[375px] mx-auto border-x";
      default:
        return "w-full max-w-[1200px] mx-auto";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-1 items-start justify-center rounded-xl border-2 border-dashed border-muted bg-muted/20 min-h-[600px] p-4 w-full max-w-[1200px] mx-auto">
        <div
          className={`${getViewportClasses(
            currentViewport
          )} transition-[width,max-width] duration-300 ease-in-out h-full min-h-[500px] bg-white rounded-lg shadow-lg border`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex flex-col gap-4 flex-1">
              {blocks.length > 0 && (
                <>
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
                      Canvas -{" "}
                      {currentViewport.charAt(0).toUpperCase() +
                        currentViewport.slice(1)}{" "}
                      View
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {blocks.length} Block{blocks.length !== 1 ? "s" : ""}{" "}
                      hinzugefügt
                    </p>
                  </div>
                  {/* Blöcke werden später mit Grid-Layout angezeigt */}
                  <div className="space-y-4">
                    {blocks.map((block) => (
                      <div
                        key={block.id}
                        className="p-4 border rounded-lg bg-background"
                      >
                        <div className="text-sm font-medium mb-2">
                          Block: {block.type}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {block.id}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* DropArea immer verfügbar, um weitere Blöcke hinzuzufügen */}
              <DropArea />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
