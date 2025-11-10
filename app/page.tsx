"use client";

import { useState } from "react";
import AuthGuard from "./components/AuthGuard";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ViewportSwitcher, ViewportSize } from "@/components/viewport-switcher";
import Canvas from "./components/Canvas";

export default function Home() {
  const [currentViewport, setCurrentViewport] =
    useState<ViewportSize>("desktop");

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between">
            <div className="flex items-center gap-2 px-4 flex-1">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">LemonSpace Builder</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Board Editor</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="px-4">
              <ViewportSwitcher
                currentViewport={currentViewport}
                onViewportChange={setCurrentViewport}
              />
            </div>
          </header>
          <Canvas currentViewport={currentViewport} />
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
