"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { ensureSeed } from "@/lib/storage";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/workout/");

  React.useEffect(() => {
    ensureSeed();
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-[520px]">
      <div className={hideNav ? "px-4 pt-4 pb-6" : "px-4 pt-4 pb-24"}>
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}