"use client";

import { ViewportSize } from "@/components/viewport-switcher";

interface CanvasProps {
  currentViewport: ViewportSize;
}

export default function Canvas({ currentViewport }: CanvasProps) {
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
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
                Canvas -{" "}
                {currentViewport.charAt(0).toUpperCase() +
                  currentViewport.slice(1)}{" "}
                View
              </h2>
              <p className="text-sm text-muted-foreground">
                Hier wird der Builder-Canvas erscheinen
              </p>
              {currentViewport !== "desktop" && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600">
                    Viewport: {currentViewport} (
                    {currentViewport === "tablet" ? "768px" : "375px"} width)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
