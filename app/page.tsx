"use client";

import { useState } from "react";
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

export default function Home() {
  const [currentViewport, setCurrentViewport] =
    useState<ViewportSize>("desktop");

  return (
    <AuthGuard>
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
    </AuthGuard>
  );
}
