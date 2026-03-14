"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Code2,
  SlidersHorizontal,
  Menu,
  List,
  Users,
  Trophy,
} from "lucide-react";

const navItems = [
  { label: "Systems", icon: LayoutGrid, href: "#" },
  { label: "System Code", icon: Code2, href: "#" },
  { label: "Properties", icon: SlidersHorizontal, href: "#" },
  { label: "Menus", icon: Menu, href: "/" },
  { label: "API List", icon: List, href: "#" },
  { label: "Users & Group", icon: Users, href: "#" },
  { label: "Competition", icon: Trophy, href: "#" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-60 flex flex-col bg-[#101828] transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <LayoutGrid size={18} className="text-white" />
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">
              Fullstack
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 lg:hidden focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pb-6">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/" && pathname === "/";
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-white text-[#101828]"
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
