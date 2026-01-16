"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { startOfWeek, subWeeks, format } from "date-fns";
import { WorkoutSession } from "@/lib/types";

function weekKey(date: Date) {
  const w = startOfWeek(date, { weekStartsOn: 1 });
  return format(w, "MMM d");
}

export function WorkoutsPerWeekChart(props: { workouts: WorkoutSession[] }) {
  const finished = props.workouts.filter((w) => !!w.endedAt);

  const buckets = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = subWeeks(new Date(), i);
    buckets.set(weekKey(d), 0);
  }

  for (const w of finished) {
    const d = new Date(w.endedAt!);
    const k = weekKey(d);
    if (buckets.has(k)) buckets.set(k, (buckets.get(k) ?? 0) + 1);
  }

  const data = Array.from(buckets.entries()).map(([name, value]) => ({ name, value }));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
