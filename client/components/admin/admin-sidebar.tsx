"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  LayoutDashboard,
  Map,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { ThemeToggle } from "@/components/theme-toggle";

interface AdminSidebarProps {
  userName: string;
}

const navigation = [
  {
    title: "Dashboard",
    href: "#dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Infrastructure Map",
    href: "#infrastructure-map",
    icon: Map,
  },
  {
    title: "Reports",
    href: "#reports",
    icon: TriangleAlert,
  },
  {
    title: "AI Assistant",
    href: "#ai-assistant",
    icon: Bot,
  },
  {
    title: "Assign Crew",
    href: "#assign-crew",
    icon: Activity,
  }
];

export function AdminSidebar({ userName }: AdminSidebarProps) {
  const [activeSection, setActiveSection] = useState("dashboard");

  /*
   * ------------------------------------------------------------
   * Detect the section currently visible on screen
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.href.replace("#", "")))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.25, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* =========================================================
          LOGO
      ========================================================= */}

      <SidebarHeader className="border-b border-border">
        <div
          className="
            flex h-16 items-center
            justify-start gap-3 px-3
            group-data-[collapsible=icon]:justify-center
            group-data-[collapsible=icon]:px-0
          "
        >
          {/* Logo */}

          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-lg
              bg-foreground
              text-background
            "
          >
            <ShieldCheck className="h-5 w-5" />
          </div>

          {/* Brand */}

          <div
            className="
              min-w-0
              overflow-hidden
              transition-all
              group-data-[collapsible=icon]:hidden
            "
          >
            <p className="truncate text-[16px] font-bold tracking-tight">
              PaveXa
            </p>

            <p className="truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Command Center
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* =========================================================
          ADMIN PROFILE
      ========================================================= */}

      <div
        className="
          px-3 pt-5
          group-data-[collapsible=icon]:px-2
        "
      >
        <div
          className="
            rounded-xl
            border border-border
            bg-muted/40
            p-3

            group-data-[collapsible=icon]:
            border-transparent
            group-data-[collapsible=icon]:
            bg-transparent
            group-data-[collapsible=icon]:
            p-0
          "
        >
          <div
            className="
              flex items-center gap-3

              group-data-[collapsible=icon]:
              justify-center
            "
          >
            {/* Avatar */}

            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-full
                bg-foreground
                text-background
              "
            >
              <ShieldCheck className="h-4 w-4" />
            </div>

            {/* User details */}

            <div
              className="
                min-w-0
                overflow-hidden
                group-data-[collapsible=icon]:hidden
              "
            >
              <p className="truncate text-sm font-semibold">{userName}</p>

              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                Administrator
              </p>

              <p className="mt-1 truncate text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                Infrastructure Division
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          NAVIGATION
      ========================================================= */}

      <SidebarContent className="mt-4">
        <SidebarGroup>
          {/* Section title */}

          <SidebarGroupLabel
            className="
              px-3
              group-data-[collapsible=icon]:hidden
            "
          >
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;

                const sectionId = item.href.replace("#", "");

                const isActive = activeSection === sectionId;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      className="
    h-10
    w-full
    rounded-lg
    px-3
    transition-colors

    group-data-[collapsible=icon]:justify-center
    group-data-[collapsible=icon]:px-0
  "
                      onClick={() => {
                        window.location.hash = sectionId;
                      }}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />

                      <span
                        className="
      truncate
      group-data-[collapsible=icon]:hidden
    "
                      >
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* =======================================================
            SYSTEM STATUS
        ======================================================= */}

      </SidebarContent>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <SidebarFooter className="border-t border-border">
        <div
          className="
            flex items-center
            justify-between
            gap-2
            py-2

            group-data-[collapsible=icon]:
            justify-center
          "
        >
          {/* System information */}

          <div
            className="
              flex min-w-0
              items-center gap-2
              overflow-hidden

              group-data-[collapsible=icon]:
              hidden
            "
          >
            <Activity className="h-4 w-4 shrink-0 text-emerald-500" />

            <div className="min-w-0">
              <p className="truncate text-xs font-medium">All systems online</p>

              <p className="truncate text-[10px] text-muted-foreground">
                PaveXa infrastructure
              </p>
            </div>
          </div>




        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
