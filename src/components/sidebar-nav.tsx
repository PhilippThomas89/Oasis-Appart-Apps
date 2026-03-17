"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Map,
  ShoppingCart,
  TrendingUp,
  Microscope,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Raumplan",
    href: "/raumplan",
    icon: Map,
  },
  {
    label: "Bestellungen",
    href: "/bestellungen",
    icon: ShoppingCart,
  },
{
    label: "Fortschritt",
    href: "/fortschritt",
    icon: TrendingUp,
  },
  {
    label: "Ausstattung",
    href: "/ausstattung",
    icon: Microscope,
  },
];

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: (typeof navItems)[number];
  pathname: string;
  onClick?: () => void;
}) {
  const isActive =
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        "hover:bg-emerald-900/50 hover:text-emerald-400",
        isActive
          ? "bg-emerald-900/60 text-emerald-300 shadow-sm"
          : "text-slate-400"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          isActive ? "text-emerald-400" : "text-slate-500"
        )}
      />
      <span>{item.label}</span>
    </Link>
  );
}

function SidebarContent({
  pathname,
  onNavClick,
}: {
  pathname: string;
  onNavClick?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-slate-900">
      {/* Logo / Branding */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 shadow-sm">
          <Microscope className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-slate-100">Biologielabor EFG</p>
          <p className="text-xs text-slate-500">Schwarzheide</p>
        </div>
      </div>

      <Separator className="mx-4 w-auto" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onNavClick}
          />
        ))}
      </nav>

      <Separator className="mx-4 w-auto" />

      {/* Footer */}
      <div className="px-4 py-4">
        <p className="text-xs text-slate-400">
          Emil-Fischer-Gymnasium
        </p>
        <p className="text-xs font-medium text-emerald-600">
          MINT-Schule
        </p>
      </div>
    </div>
  );
}

export function SidebarNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-slate-800 lg:flex lg:flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:text-emerald-700"
              aria-label="Menü öffnen"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <SidebarContent
              pathname={pathname}
              onNavClick={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600">
            <Microscope className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-100">
            Biologielabor EFG
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
}
