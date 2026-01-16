"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StorePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Store</h1>
        <p className="text-sm text-zinc-500">PRO upsells / premium</p>
      </div>

      <Card className="rounded-3xl p-4">
        <div className="text-lg font-bold">WorkoutLog PRO</div>
        <p className="mt-1 text-sm text-zinc-500">
          Unlock advanced analytics, extra widgets, and deeper progress charts.
        </p>
        <Button className="mt-4 w-full rounded-2xl">Upgrade</Button>
      </Card>
    </div>
  );
}
