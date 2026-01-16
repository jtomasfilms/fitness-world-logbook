"use client";

import * as React from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { MeasurementEntry } from "@/lib/types";

export function MeasurementsChart(props: { entries: MeasurementEntry[]; metric: "Neck" | "Waist" | "Weight" }) {
  const data = props.entries
    .filter((e) => e.key === props.metric)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => ({
      date: format(parseISO(e.date), "MMM d"),
      value: e.value,
    }));

  if (data.length === 0) {
    return <div className="text-sm text-zinc-500">No entries yet.</div>;
  }

  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line dataKey="value" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
