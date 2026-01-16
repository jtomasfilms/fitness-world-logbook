"use client";

import * as React from "react";
import { BottomNav } from "@/components/BottomNav";
import { ensureSeed } from "@/lib/storage";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    ensureSeed();
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-[520px] pb-24">
      <div className="px-4 pt-4">{children}</div>
      <BottomNav />
    </div>
  );
}
