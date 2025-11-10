"use client";

import * as React from "react";
import {
  Layout,
  Image,
  FileText,
  Settings2,
  LifeBuoy,
  Send,
  Sparkles,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/app/lib/user-context";

const data = {
  navMain: [
    {
      id: "boards",
      title: "Boards",
      url: "#",
      icon: Layout,
      isActive: true,
      items: [
        {
          id: "boards-all",
          title: "Alle Boards",
          url: "#",
        },
        {
          id: "boards-favorites",
          title: "Favoriten",
          url: "#",
        },
        {
          id: "boards-recent",
          title: "Zuletzt verwendet",
          url: "#",
        },
      ],
    },
    {
      id: "media",
      title: "Media",
      url: "#",
      icon: Image,
      items: [
        {
          id: "media-images",
          title: "Bilder",
          url: "#",
        },
        {
          id: "media-videos",
          title: "Videos",
          url: "#",
        },
        {
          id: "media-uploads",
          title: "Uploads",
          url: "#",
        },
      ],
    },
    {
      id: "templates",
      title: "Templates",
      url: "#",
      icon: FileText,
      items: [
        {
          id: "templates-browse",
          title: "Vorlagen durchsuchen",
          url: "#",
        },
        {
          id: "templates-my",
          title: "Meine Vorlagen",
          url: "#",
        },
      ],
    },
    {
      id: "settings",
      title: "Einstellungen",
      url: "#",
      icon: Settings2,
      items: [
        {
          id: "settings-general",
          title: "Allgemein",
          url: "#",
        },
        {
          id: "settings-account",
          title: "Account",
          url: "#",
        },
        {
          id: "settings-subscription",
          title: "Abonnement",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      id: "support",
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      id: "feedback",
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Mein erstes Board",
      url: "#",
      icon: Sparkles,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  // User-Daten aus AppWrite in das Format für NavUser umwandeln
  const userData = user
    ? {
        name: user.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        avatar: "", // AppWrite speichert Avatar-URLs anders, falls vorhanden
      }
    : {
        name: "User",
        email: "",
        avatar: "",
      };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">LemonSpace</span>
                  <span className="truncate text-xs">Builder</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
