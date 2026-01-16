"use client";

import * as React from "react";
import { EXERCISES } from "@/data/exercises";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ExercisesPage() {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return EXERCISES;
    return EXERCISES.filter((e) => e.name.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Exercises</h1>
        <p className="text-sm text-zinc-500">Searchable database</p>
      </div>

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search exercises..."
        className="rounded-2xl"
      />

      <Card className="rounded-3xl p-4">
        <div className="space-y-2">
          {filtered.map((ex) => (
            <div key={ex.id} className="flex items-center justify-between rounded-2xl border bg-white px-4 py-3">
              <div>
                <div className="font-semibold text-zinc-800">{ex.name}</div>
                <div className="text-xs text-zinc-500">{ex.bodyPart}</div>
              </div>
              <div className="text-xs text-zinc-500">{ex.category}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
