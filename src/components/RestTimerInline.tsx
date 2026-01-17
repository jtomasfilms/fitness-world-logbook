"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { formatSeconds, parseRestInput } from "@/lib/utils";

export function RestTimerInline(props: {
  endAtMs: number;
  defaultSeconds: number;
  onChangeSeconds: (seconds: number) => void;
  onStop: () => void;
  onComplete?: () => void;
}) {
  const { endAtMs, defaultSeconds, onChangeSeconds, onStop, onComplete } = props;

  const [now, setNow] = React.useState(() => Date.now());
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");

  const firedRef = React.useRef(false);

  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  const remaining = Math.max(0, Math.ceil((endAtMs - now) / 1000));

  React.useEffect(() => {
    if (remaining <= 0 && !firedRef.current) {
      firedRef.current = true;
      onComplete?.();
    }
  }, [remaining, onComplete]);

  if (editing) {
    return (
      <div className="flex items-center justify-between rounded-xl border bg-blue-50 px-3 py-2">
        <div className="text-sm font-semibold text-blue-700">Rest</div>

        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="1:30"
            className="w-24 rounded-lg border bg-white px-2 py-1 text-base outline-none"
            inputMode="numeric"
          />
          <Button
            size="sm"
            onClick={() => {
              const parsed = parseRestInput(draft);
              if (parsed === null) {
                setEditing(false);
                return;
              }
              onChangeSeconds(parsed);
              setEditing(false);
              setDraft("");
              firedRef.current = false;
            }}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl border bg-white px-3 py-2">
      <div className="text-sm font-semibold text-zinc-800">Rest</div>

      <div className="flex items-center gap-2">
        <button
          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-base font-semibold text-blue-700"
          onClick={() => {
            setEditing(true);
            setDraft(formatSeconds(defaultSeconds));
          }}
          title="Tap to edit"
        >
          {formatSeconds(remaining)}
        </button>

        <Button size="sm" variant="ghost" onClick={onStop}>
          Stop
        </Button>
      </div>
    </div>
  );
}
