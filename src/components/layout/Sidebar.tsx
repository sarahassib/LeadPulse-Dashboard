"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Settings,
  Factory,
  ChevronLeft,
  FileText,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Campagnes",
    href: "/campaigns",
    icon: <FileText size={20} />,
  },
  {
    label: "Ajouter une campagne",
    href: "/campaigns/new",
    icon: <PlusCircle size={20} />,
  },
  {
    label: "Comparaison",
    href: "/dashboard#comparaison",
    icon: <BarChart3 size={20} />,
  },
  {
    label: "Paramètres",
    href: "/settings",
    icon: <Settings size={20} />,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[#0a0a0a] border-r border-border
          transition-transform duration-300
          lg:translate-x-0 lg:z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="h-9 w-9 rounded-lg bg-primary-500 flex items-center justify-center">
            <Factory size={20} className="text-black" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">LeadPulse</span>
            <span className="block text-[10px] text-primary-400 font-medium uppercase tracking-widest">Analytics</span>
          </div>
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded hover:bg-surface-card text-text-muted hover:text-white transition-colors lg:hidden"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150
                  ${
                    isActive
                      ? "bg-primary-500 text-black"
                      : "text-text-secondary hover:bg-surface-card hover:text-white"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
