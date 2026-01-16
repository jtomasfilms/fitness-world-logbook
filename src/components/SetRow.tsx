"use client";

import * as React from "react";
import { WorkoutSet } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SetRow(props: {
  index: number;
  set: WorkoutSet;
  previousLabel?: string;
  onUpdate: (patch: Partial<WorkoutSet>) => void;
  onToggleComplete: () => void;
}) {
  const { index, set, previousLabel, onUpdate, onToggleComplete } = props;

  return (
    <div className={cn("grid grid-cols-[48px_1fr_78px_78px_44px] items-center gap-2 py-2", set.completed && "opacity-90")}>
      <div className="flex items-center justify-center">
        <div className={cn("h-8 w-8 rounded-full border text-center text-sm leading-8", set.completed ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold" : "bg-white text-zinc-700")}>
          {index + 1}
        </div>
      </div>

      <div className="text-xs text-zinc-400">
        {previousLabel ?? "—"}
      </div>

      <input
        className="h-10 rounded-xl border bg-white px-2 text-base outline-none"
        inputMode="decimal"
        placeholder="lbs"
        value={set.weight ?? ""}
        onChange={(e) => onUpdate({ weight: e.target.value === "" ? null : Number(e.target.value) })}
      />

      <input
        className="h-10 rounded-xl border bg-white px-2 text-base outline-none"
        inputMode="numeric"
        placeholder="reps"
        value={set.reps ?? ""}
        onChange={(e) => onUpdate({ reps: e.target.value === "" ? null : Number(e.target.value) })}
      />

      <button
        className={cn(
          "h-10 w-10 rounded-xl border text-base font-semibold",
          set.completed ? "bg-green-50 border-green-200 text-green-700" : "bg-white text-zinc-500"
        )}
        onClick={onToggleComplete}
        title="Complete set"
      >
        ✓
      </button>
    </div>
  );
}
