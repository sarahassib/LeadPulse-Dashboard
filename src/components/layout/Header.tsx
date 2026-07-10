"use client";

import { Menu, Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/campaigns": "Campagnes",
  "/campaigns/new": "Nouvelle campagne",
  "/settings": "Paramètres",
};

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();

  const getTitle = () => {
    for (const [path, title] of Object.entries(pageTitles)) {
      if (pathname === path || pathname.startsWith(path + "/")) {
        return title;
      }
    }
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 px-4 py-3 bg-[#121212] border-b border-border lg:px-6 backdrop-blur-sm">
      {/* Mobile hamburger */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-surface-card lg:hidden transition-colors"
      >
        <Menu size={20} className="text-text-secondary" />
      </button>

      {/* Page title */}
      <h1 className="text-lg font-semibold text-white">{getTitle()}</h1>

      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-surface-card transition-colors">
          <Bell size={20} className="text-text-secondary hover:text-white" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* User avatar */}
        <button className="p-2 rounded-lg hover:bg-surface-card transition-colors">
          <User size={20} className="text-text-secondary hover:text-white" />
        </button>
      </div>
    </header>
  );
}
