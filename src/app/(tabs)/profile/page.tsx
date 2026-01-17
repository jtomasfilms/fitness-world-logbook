"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listWorkouts, getProfile, saveProfile, resetAllData } from "@/lib/storage";
import { MeasurementEntry, WorkoutSession } from "@/lib/types";
import { uid } from "@/lib/utils";
import { WidgetShell } from "@/components/widgets/WidgetShell";
import { WorkoutsPerWeekChart } from "@/components/widgets/WorkoutsPerWeekChart";
import { MeasurementsChart } from "@/components/widgets/MeasurementsChart";

export default function ProfilePage() {
  const [workouts, setWorkouts] = React.useState<WorkoutSession[]>([]);
  const [username, setUsername] = React.useState("jtomas229");
  const [metric, setMetric] = React.useState<"Neck" | "Waist" | "Weight">("Neck");
  const [value, setValue] = React.useState("");
  const [measurements, setMeasurements] = React.useState<MeasurementEntry[]>([]);

  React.useEffect(() => {
    setWorkouts(listWorkouts().filter((w) => !!w.endedAt));
    const p = getProfile();
    setUsername(p.username);
    setMeasurements(p.measurements ?? []);
  }, []);

  const totalWorkouts = workouts.length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Profile</h1>
        <p className="text-sm text-zinc-500">Dashboard + widgets</p>
      </div>

      <Card className="rounded-3xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-500">Username</div>
            <div className="text-lg font-bold">{username}</div>
            <div className="text-sm text-zinc-500">{totalWorkouts} workouts</div>
          </div>

          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={() => {
              const next = prompt("Update username", username);
              if (!next) return;
              setUsername(next);
              const p = getProfile();
              saveProfile({ ...p, username: next });
            }}
          >
            Edit
          </Button>
        </div>
      </Card>

      <WidgetShell title="Workouts per week">
        <WorkoutsPerWeekChart workouts={workouts} />
      </WidgetShell>

      <WidgetShell
        title={`${metric} progress`}
        right={
          <select
            className="rounded-xl border bg-white px-2 py-1 text-sm"
            value={metric}
            onChange={(e) => setMetric(e.target.value as any)}
          >
            <option value="Neck">Neck</option>
            <option value="Waist">Waist</option>
            <option value="Weight">Weight</option>
          </select>
        }
      >
        <MeasurementsChart entries={measurements} metric={metric} />
      </WidgetShell>

      <Card className="rounded-3xl p-4">
        <div className="text-sm font-semibold text-zinc-800">Add measurement</div>
        <div className="mt-2 flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter number"
            className="rounded-2xl"
            inputMode="decimal"
          />
          <Button
            onClick={() => {
              const num = Number(value);
              if (!Number.isFinite(num)) return;

              const entry: MeasurementEntry = {
                id: uid(),
                date: new Date().toISOString(),
                key: metric,
                value: num,
              };

              const next = [entry, ...measurements];
              setMeasurements(next);
              setValue("");

              const p = getProfile();
              saveProfile({ ...p, measurements: next });
            }}
          >
            Add
          </Button>
        </div>
      </Card>

      <Card className="rounded-3xl p-4">
        <Button
          variant="destructive"
          className="w-full rounded-2xl"
          onClick={() => {
            resetAllData();
            window.location.reload();
          }}
        >
          Reset App Data (dev)
        </Button>
      </Card>
    </div>
  );
}
