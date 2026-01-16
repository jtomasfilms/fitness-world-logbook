"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { WorkoutTemplate } from "@/lib/types";
import { EXERCISES } from "@/data/exercises";

export function TemplatePreviewSheet(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  template: WorkoutTemplate | null;
  lastPerformedLabel?: string;
  onStart: () => void;
}) {
  const t = props.template;

  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="text-lg">{t?.title ?? "Template"}</SheetTitle>
          <p className="text-sm text-zinc-500">
            Last performed: {props.lastPerformedLabel ?? "—"}
          </p>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          {t?.exerciseIds?.map((te) => {
            const ex = EXERCISES.find((x) => x.id === te.exerciseId);
            return (
              <div key={te.exerciseId} className="flex items-center justify-between rounded-2xl border bg-white px-4 py-3">
                <div className="font-semibold text-zinc-800">{ex?.name ?? "Exercise"}</div>
                <div className="text-sm text-zinc-500">{te.sets}×</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-2">
          <Button className="w-full" onClick={props.onStart}>
            Start Workout
          </Button>
          <Button className="w-full" variant="outline" onClick={() => props.onOpenChange(false)}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
