"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getWorkout } from "@/lib/storage";
import { workoutDurationMinutes, workoutVolume, niceDate, dayName } from "@/lib/workout-logic";

export default function HistoryWorkoutDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [workout, setWorkout] = React.useState<any>(null);

  React.useEffect(() => {
    const w = getWorkout(id);
    if (!w || !w.endedAt) {
      router.push("/history");
      return;
    }
    setWorkout(w);
  }, [id, router]);

  if (!workout) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" className="rounded-2xl" onClick={() => router.push("/history")}>
          Back
        </Button>
      </div>

      {/* Header */}
      <Card className="rounded-3xl p-4">
        <div className="text-xl font-bold">{workout.title}</div>
        <div className="mt-1 text-sm text-zinc-500">
          {dayName(workout.endedAt)} • {niceDate(workout.endedAt)}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border bg-white p-3 text-center">
            <div className="text-xs text-zinc-500">Duration</div>
            <div className="text-sm font-semibold">{workoutDurationMinutes(workout)}m</div>
          </div>
          <div className="rounded-2xl border bg-white p-3 text-center">
            <div className="text-xs text-zinc-500">Volume</div>
            <div className="text-sm font-semibold">{workoutVolume(workout)} lb</div>
          </div>
          <div className="rounded-2xl border bg-white p-3 text-center">
            <div className="text-xs text-zinc-500">PRs</div>
            <div className="text-sm font-semibold">{workout.prCount ?? 0}</div>
          </div>
        </div>

        {workout.photoDataUrl && (
          <img
            src={workout.photoDataUrl}
            alt="Workout photo"
            className="mt-4 w-full rounded-2xl border object-cover"
          />
        )}

        {workout.note && (
          <div className="mt-4 rounded-2xl border bg-zinc-50 p-3 text-sm">
            <div className="font-semibold">Note</div>
            <div className="mt-1 whitespace-pre-wrap text-zinc-700">{workout.note}</div>
          </div>
        )}
      </Card>

      {/* Exercises */}
      <div className="space-y-4">
        {workout.exercises.map((ex: any) => (
          <Card key={ex.id} className="rounded-3xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-bold text-blue-600">{ex.name}</div>
                <div className="text-xs text-zinc-500">
                  {ex.bodyPart} • {ex.category}
                </div>
              </div>
            </div>

            {(ex.stickyNote || ex.note) && (
              <div className="mt-3 space-y-2">
                {ex.stickyNote && (
                  <div className="rounded-2xl border bg-yellow-50 p-3 text-sm">
                    <div className="font-semibold">📌 Sticky Note</div>
                    <div className="mt-1 whitespace-pre-wrap">{ex.stickyNote}</div>
                  </div>
                )}
                {ex.note && (
                  <div className="rounded-2xl border bg-zinc-50 p-3 text-sm">
                    <div className="font-semibold">📝 Note</div>
                    <div className="mt-1 whitespace-pre-wrap">{ex.note}</div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 space-y-2">
              {ex.sets.map((s: any, idx: number) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-2xl border bg-white px-3 py-2 text-sm"
                >
                  <div className="text-zinc-600">
                    {s.type === "warmup" ? "Warmup" : "Set"} {idx + 1}
                  </div>

                  <div className="font-semibold text-zinc-800">
                    {s.completed
                      ? `${s.weight ?? 0} lb × ${s.reps ?? 0}`
                      : "Not completed"}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
