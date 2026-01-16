"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, History, PlayCircle, Dumbbell, Store } from "lucide-react";

const items = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/history", label: "History", icon: History },
  { href: "/start", label: "Start", icon: PlayCircle },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/store", label: "Store", icon: Store },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-[520px] items-center justify-between px-3 pb-[env(safe-area-inset-bottom)] pt-2">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + "/");
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex w-full flex-col items-center gap-1 rounded-xl py-2 text-xs",
                active ? "text-blue-600" : "text-zinc-500"
              )}
            >
              <Icon className={cn("h-5 w-5", active ? "text-blue-600" : "text-zinc-500")} />
              <span className={cn(active ? "font-semibold" : "font-medium")}>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
