"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { listWorkouts } from "@/lib/storage";
import { WorkoutSession } from "@/lib/types";
import { dayName, monthKey, niceDate, workoutDurationMinutes, workoutVolume, findWorkoutOnDate } from "@/lib/workout-logic";

export default function HistoryPage() {
  const [workouts, setWorkouts] = React.useState<WorkoutSession[]>([]);
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [datePick, setDatePick] = React.useState("");
  const [found, setFound] = React.useState<WorkoutSession | null>(null);

  React.useEffect(() => {
    const all = listWorkouts().filter((w) => !!w.endedAt);
    all.sort((a, b) => new Date(b.endedAt!).getTime() - new Date(a.endedAt!).getTime());
    setWorkouts(all);
  }, []);

  const grouped = React.useMemo(() => {
    const map = new Map<string, WorkoutSession[]>();
    for (const w of workouts) {
      const k = monthKey(w.endedAt!);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(w);
    }
    return Array.from(map.entries());
  }, [workouts]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">History</h1>
          <p className="text-sm text-zinc-500">Your workout log</p>
        </div>
        <Button variant="outline" className="rounded-2xl" onClick={() => setCalendarOpen(true)}>
          Calendar
        </Button>
      </div>

      {grouped.map(([k, arr]) => (
        <div key={k} className="space-y-3">
          <div className="text-sm font-semibold text-zinc-800">{k}</div>

          {arr.map((w) => (
            <Card key={w.id} className="rounded-3xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold">{dayName(w.endedAt!)}</div>
                  <div className="text-sm text-zinc-500">{niceDate(w.endedAt!)}</div>
                </div>

                <div className="text-right text-sm text-zinc-600">
                  <div>{workoutDurationMinutes(w)}m</div>
                  <div className="font-semibold">{workoutVolume(w)} lb</div>
                  <div className="text-xs text-zinc-500">{w.prCount ?? 0} PRs</div>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {w.exercises.map((ex) => {
                  const best = ex.sets
                    .filter((s) => s.completed && s.type === "work" && s.weight != null && s.reps != null)
                    .reduce(
                      (acc, s) => {
                        const score = (s.weight ?? 0) * (s.reps ?? 0);
                        if (score > acc.score) return { score, label: `${s.weight} lb × ${s.reps}` };
                        return acc;
                      },
                      { score: 0, label: "—" }
                    );

                  return (
                    <div key={ex.id} className="flex items-center justify-between text-sm">
                      <div className="text-zinc-700">{ex.name}</div>
                      <div className="text-zinc-500">{best.label}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      ))}

      {/* calendar modal (simple date picker jump) */}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Jump to workout day</DialogTitle>
          </DialogHeader>

          <input
            type="date"
            value={datePick}
            onChange={(e) => setDatePick(e.target.value)}
            className="h-10 rounded-2xl border bg-white px-3 text-base outline-none"
          />

          <Button
            onClick={() => {
              if (!datePick) return;
              const iso = new Date(datePick).toISOString();
              const w = findWorkoutOnDate(workouts, iso);
              setFound(w);
            }}
          >
            Find
          </Button>

          {found && (
            <div className="rounded-2xl border bg-zinc-50 p-3 text-sm">
              <div className="font-semibold">{found.title}</div>
              <div className="text-zinc-500">{niceDate(found.endedAt!)}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
