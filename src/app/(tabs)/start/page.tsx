"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  listPrograms,
  createEmptyWorkout,
  createWorkoutFromTemplate,
  listWorkouts,
} from "@/lib/storage";
import { ProgramFolder, WorkoutTemplate, WorkoutSession } from "@/lib/types";
import { useRouter } from "next/navigation";
import { TemplatePreviewSheet } from "@/components/TemplatePreviewSheet";
import { formatDistanceToNow } from "date-fns";

export default function StartPage() {
  const router = useRouter();

  const [programs, setPrograms] = React.useState<ProgramFolder[]>([]);
  const [selected, setSelected] = React.useState<WorkoutTemplate | null>(null);
  const [open, setOpen] = React.useState(false);

  // ✅ Prevent hydration mismatch
  const [mounted, setMounted] = React.useState(false);

  // ✅ Store unfinished workout in state instead of rendering it from localStorage immediately
  const [unfinished, setUnfinished] = React.useState<WorkoutSession | null>(null);

  React.useEffect(() => {
    setMounted(true);
    setPrograms(listPrograms());

    // ✅ localStorage read AFTER mount
    const u = listWorkouts().find((w) => !w.endedAt) ?? null;
    setUnfinished(u);
  }, []);

  const lastPerformedLabel = React.useMemo(() => {
    if (!mounted) return "—";
    if (!selected?.lastPerformedAt) return "—";
    return formatDistanceToNow(new Date(selected.lastPerformedAt), { addSuffix: true });
  }, [selected, mounted]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">Start Workout</h1>
          <p className="text-sm text-zinc-500">Templates + quick start</p>
        </div>
      </div>

      {mounted && unfinished && (
  <Card className="rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-zinc-500">Active workout</div>
              <div className="text-lg font-bold">{unfinished.title}</div>
            </div>
            <Button onClick={() => router.push(`/workout/${unfinished.id}`)}>Resume</Button>
          </div>
        </Card>
      )}

      <Card className="rounded-3xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-500">Quick Start</div>
            <div className="text-lg font-bold">Start an Empty Workout</div>
          </div>
          <Button
            onClick={() => {
              const w = createEmptyWorkout();

              // ✅ Update unfinished immediately so UI stays synced
              setUnfinished(w);

              router.push(`/workout/${w.id}`);
            }}
          >
            Start
          </Button>
        </div>
      </Card>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-zinc-800">Templates</div>

        {programs.map((p) => (
          <Card key={p.id} className="rounded-3xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-base font-bold">{p.name}</div>
              <div className="text-sm text-zinc-500">{p.templates.length}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {p.templates.map((t) => (
                <button
                  key={t.id}
                  className="rounded-2xl border bg-white p-3 text-left"
                  onClick={() => {
                    setSelected(t);
                    setOpen(true);
                  }}
                >
                  <div className="font-semibold text-zinc-800">{t.title}</div>

                  {/* ✅ Only render relative time after mounted */}
                  <div className="mt-1 text-xs text-zinc-500">
                    Last performed:{" "}
                    {!mounted
                      ? "—"
                      : t.lastPerformedAt
                      ? formatDistanceToNow(new Date(t.lastPerformedAt), { addSuffix: true })
                      : "—"}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <TemplatePreviewSheet
        open={open}
        onOpenChange={setOpen}
        template={selected}
        lastPerformedLabel={lastPerformedLabel}
        onStart={() => {
          if (!selected) return;
          const w = createWorkoutFromTemplate(selected.id);

          // ✅ Update unfinished immediately so UI stays synced
          setUnfinished(w);

          setOpen(false);
          router.push(`/workout/${w.id}`);
        }}
      />
    </div>
  );
}
