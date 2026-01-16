"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function WidgetShell(props: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("rounded-3xl p-4", props.className)}>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-zinc-800">{props.title}</div>
        {props.right}
      </div>
      {props.children}
    </Card>
  );
}
