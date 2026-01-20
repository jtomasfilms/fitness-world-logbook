"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { EXERCISES } from "@/data/exercises";
import { WorkoutSession, WorkoutExerciseBlock } from "@/lib/types";
import { deleteWorkout, getWorkout, listWorkouts, markTemplatePerformed, upsertWorkout } from "@/lib/storage";
import { uid, formatSeconds, parseRestInput } from "@/lib/utils";
import { SetRow } from "@/components/SetRow";
import { RestTimerInline } from "@/components/RestTimerInline";
import { WorkoutOptionsMenu } from "@/components/WorkoutOptionsMenu";
import { ExerciseOptionsMenu } from "@/components/ExerciseOptionsMenu";
import { computePRCount, workoutVolume } from "@/lib/workout-logic";
import { format } from "date-fns";
import { primeAudio, playBeep, vibrateTimer } from "@/lib/sound";
import { getProfile } from "@/lib/storage";
import { getSettings } from "@/lib/settings";

type ActiveRest = {
  blockId: string;
  afterSetId: string;
  endAtMs: number;
};

export default function WorkoutPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);

  const [workout, setWorkout] = React.useState<WorkoutSession | null>(null);
  const [elapsedSec, setElapsedSec] = React.useState(0);

  const [activeRest, setActiveRest] = React.useState<ActiveRest | null>(null);

  // dialogs
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState("");

  const [noteOpen, setNoteOpen] = React.useState(false);
  const [noteValue, setNoteValue] = React.useState("");

  const [timeOpen, setTimeOpen] = React.useState(false);
  const [startDraft, setStartDraft] = React.useState("");
  const [endDraft, setEndDraft] = React.useState("");

  const [photoOpen, setPhotoOpen] = React.useState(false);

  const [addExerciseOpen, setAddExerciseOpen] = React.useState(false);
  const [exerciseSearch, setExerciseSearch] = React.useState("");

  const [blockNoteOpen, setBlockNoteOpen] = React.useState<{
    open: boolean;
    blockId: string | null;
    mode: "note" | "sticky";
  }>({
    open: false,
    blockId: null,
    mode: "note",
  });
  const [blockNoteDraft, setBlockNoteDraft] = React.useState("");

  const [restEditOpen, setRestEditOpen] = React.useState<{ open: boolean; blockId: string | null }>({
    open: false,
    blockId: null,
  });
  const [restDraft, setRestDraft] = React.useState("");

  React.useEffect(() => {
    const w = getWorkout(id);
    if (!w) {
      router.push("/start");
      return;
    }
    setWorkout(w);
  }, [id, router]);

  // live workout timer
  React.useEffect(() => {
    if (!workout) return;
    const tick = () => {
      const start = new Date(workout.startedAt).getTime();
      const now = Date.now();
      setElapsedSec(Math.max(0, Math.floor((now - start) / 1000)));
    };
    tick();
    const t = setInterval(tick, 500);
    return () => clearInterval(t);
  }, [workout]);

  // autosave
  React.useEffect(() => {
    if (!workout) return;
    const t = setTimeout(() => upsertWorkout(workout), 200);
    return () => clearTimeout(t);
  }, [workout]);

  if (!workout) return null;

  const finishedHistory = listWorkouts().filter((w) => w.endedAt && w.id !== workout.id);

  const previousLabelFor = (exerciseId: string, setIndex: number) => {
    const last = finishedHistory.find((w) => w.exercises.some((x) => x.exerciseId === exerciseId));
    if (!last) return "—";
    const ex = last.exercises.find((x) => x.exerciseId === exerciseId);
    if (!ex) return "—";
    const s = ex.sets[setIndex];
    if (!s || !s.completed) return "—";
    const wt = s.weight ?? 0;
    const rp = s.reps ?? 0;
    return `${wt} lb × ${rp}`;
  };

  const startRest = (blockId: string, afterSetId: string, seconds: number) => {
    setActiveRest({
      blockId,
      afterSetId,
      endAtMs: Date.now() + seconds * 1000,
    });
  };

  const updateBlock = (blockId: string, updater: (b: WorkoutExerciseBlock) => WorkoutExerciseBlock) => {
    setWorkout((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.map((b) => (b.id === blockId ? updater(b) : b)),
      };
    });
  };

  const finishWorkout = () => {
    const endedAt = new Date().toISOString();
    const copy: WorkoutSession = { ...workout, endedAt };

    copy.totalVolume = workoutVolume(copy);
    copy.prCount = computePRCount(copy, finishedHistory);

    upsertWorkout(copy);

    if (copy.templateId) markTemplatePerformed(copy.templateId);

    router.push("/history");
  };

  const cancelWorkout = () => {
    deleteWorkout(workout.id);
    router.push("/start");
  };

  return (
    <div className="space-y-4">
      {/* top bar */}
      <div className="flex items-center justify-between">
        <div className="rounded-2xl border bg-white px-3 py-2 text-sm font-semibold text-zinc-700">
          ⏱️ {formatSeconds(elapsedSec)}
        </div>

        <div className="flex items-center gap-2">
          <WorkoutOptionsMenu
            onRename={() => {
              setRenameValue(workout.title);
              setRenameOpen(true);
            }}
            onTimeEdit={() => {
              setStartDraft(workout.startedAt.slice(0, 16));
              setEndDraft(workout.endedAt ? workout.endedAt.slice(0, 16) : "");
              setTimeOpen(true);
            }}
            onAddPhoto={() => setPhotoOpen(true)}
            onAddNote={() => {
              setNoteValue(workout.note ?? "");
              setNoteOpen(true);
            }}
          />
          <Button className="bg-green-600 hover:bg-green-700" onClick={finishWorkout}>
            Finish
          </Button>
        </div>
      </div>

      {/* header */}
      <Card className="rounded-3xl p-4">
        <div className="text-xl font-bold">{workout.title}</div>
        <div className="mt-1 text-sm text-zinc-500">
          {format(new Date(workout.startedAt), "EEEE, MMM d")} • {formatSeconds(elapsedSec)}
        </div>

        {/* Make notes/photos obvious */}
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            className="w-full rounded-2xl"
            onClick={() => {
              setNoteValue(workout.note ?? "");
              setNoteOpen(true);
            }}
          >
            Add Note
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-2xl"
            onClick={() => setPhotoOpen(true)}
          >
            Add Photo
          </Button>
        </div>

        {workout.photoDataUrl && (
          <img
            src={workout.photoDataUrl}
            alt="Workout photo"
            className="mt-3 w-full rounded-2xl border object-cover"
          />
        )}

        {workout.note && (
          <div className="mt-3 rounded-2xl border bg-zinc-50 p-3 text-sm text-zinc-700">
            <div className="font-semibold">Note</div>
            <div className="mt-1 whitespace-pre-wrap">{workout.note}</div>
          </div>
        )}
      </Card>

      {/* exercise blocks */}
      <div className="space-y-4">
        {workout.exercises.map((b) => (
          <Card key={b.id} className="rounded-3xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <button className="text-left text-lg font-bold text-blue-600">{b.name}</button>
                <div className="text-xs text-zinc-500">
                  {b.bodyPart} • {b.category}
                </div>
              </div>

              <ExerciseOptionsMenu
                onAddNote={() => {
                  setBlockNoteOpen({ open: true, blockId: b.id, mode: "note" });
                  setBlockNoteDraft(b.note ?? "");
                }}
                onAddSticky={() => {
                  setBlockNoteOpen({ open: true, blockId: b.id, mode: "sticky" });
                  setBlockNoteDraft(b.stickyNote ?? "");
                }}
                onAddWarmup={() => {
                  updateBlock(b.id, (blk) => {
                    const warmup = {
                      id: uid(),
                      type: "warmup" as const,
                      weight: null,
                      reps: null,
                      completed: false,
                    };
                    return { ...blk, sets: [warmup, ...blk.sets] };
                  });
                }}
                onUpdateRest={() => {
                  setRestEditOpen({ open: true, blockId: b.id });
                  setRestDraft(formatSeconds(b.restSeconds));
                }}
                onReplace={() => {
                  setAddExerciseOpen(true);
                  setExerciseSearch("");
                }}
                onRemove={() => {
                  setWorkout((prev) => {
                    if (!prev) return prev;
                    return { ...prev, exercises: prev.exercises.filter((x) => x.id !== b.id) };
                  });
                }}
              />
            </div>

            {(b.stickyNote || b.note) && (
              <div className="mt-3 space-y-2">
                {b.stickyNote && (
                  <div className="rounded-2xl border bg-yellow-50 p-3 text-sm text-zinc-800">
                    <div className="font-semibold">📌 Sticky</div>
                    <div className="mt-1 whitespace-pre-wrap">{b.stickyNote}</div>
                  </div>
                )}
                {b.note && (
                  <div className="rounded-2xl border bg-zinc-50 p-3 text-sm text-zinc-700">
                    <div className="font-semibold">📝 Note</div>
                    <div className="mt-1 whitespace-pre-wrap">{b.note}</div>
                  </div>
                )}
              </div>
            )}

            <Separator className="my-3" />

            <div className="grid grid-cols-[48px_1fr_78px_78px_44px] gap-2 text-xs text-zinc-500">
              <div className="text-center">Set</div>
              <div>Previous</div>
              <div className="text-center">lbs</div>
              <div className="text-center">Reps</div>
              <div className="text-center">✓</div>
            </div>

            <div className="mt-1 space-y-2">
             d
              {b.sets.map((s, idx) => (
                <div key={s.id} className="space-y-2">
                  <SetRow
                    index={idx}
                    set={s}
                    previousLabel={previousLabelFor(b.exerciseId, idx)}
                    onUpdate={(patch) => {
                      updateBlock(b.id, (blk) => ({
                        ...blk,
                        sets: blk.sets.map((x) => (x.id === s.id ? { ...x, ...patch } : x)),
                      }));
                    }}
                    onToggleComplete={() => {
                      updateBlock(b.id, (blk) => {
                        const next = blk.sets.map((x) => {
                          if (x.id !== s.id) return x;
                          const completed = !x.completed;
                          return {
                            ...x,
                            completed,
                            completedAt: completed ? new Date().toISOString() : undefined,
                          };
                        });

                        return { ...blk, sets: next };
                      });

                      // only start timer when marking COMPLETE
                      if (!s.completed) {
                        primeAudio(); // unlock sound on iPhone tap
                        startRest(b.id, s.id, b.restSeconds);
                      }
                    }}
                  />

                  {/* ONLY show timer directly under the set that triggered it */}
                  {activeRest?.blockId === b.id && activeRest.afterSetId === s.id && (
                    <RestTimerInline
                      endAtMs={activeRest.endAtMs}
                      defaultSeconds={b.restSeconds}
                      onChangeSeconds={(seconds) => {
                        updateBlock(b.id, (blk) => ({ ...blk, restSeconds: seconds }));
                        startRest(b.id, s.id, seconds);
                      }}
                      onStop={() => setActiveRest(null)}
                      onComplete={() => {
  const s = getSettings();

  // ✅ Sound
  if (s.soundEnabled) playBeep();

  // ✅ Vibration
  if (s.vibrationEnabled && typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([200, 100, 200]); // buzz-buzz pattern
  }
}}

                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full rounded-2xl"
                onClick={() => {
                  updateBlock(b.id, (blk) => ({
                    ...blk,
                    sets: [
                      ...blk.sets,
                      {
                        id: uid(),
                        type: "work",
                        weight: null,
                        reps: null,
                        completed: false,
                      },
                    ],
                  }));
                }}
              >
                + Add Set ({formatSeconds(b.restSeconds)})
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* add exercises */}
      <Card className="rounded-3xl p-4">
        <Button className="w-full rounded-2xl" onClick={() => setAddExerciseOpen(true)}>
          Add Exercises
        </Button>
        <Button className="mt-2 w-full rounded-2xl" variant="destructive" onClick={cancelWorkout}>
          Cancel Workout
        </Button>
      </Card>

      {/* Rename dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit Workout Name</DialogTitle>
          </DialogHeader>
          <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
          <Button
            onClick={() => {
              setWorkout((prev) => (prev ? { ...prev, title: renameValue || prev.title } : prev));
              setRenameOpen(false);
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>

      {/* workout note dialog */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <textarea
            className="min-h-[120px] rounded-2xl border bg-white p-3 text-base outline-none"
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
          />
          <Button
            onClick={() => {
              setWorkout((prev) => (prev ? { ...prev, note: noteValue.trim() } : prev));
              setNoteOpen(false);
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>

      {/* time edit dialog */}
      <Dialog open={timeOpen} onOpenChange={setTimeOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Adjust Start/End Time</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Start</div>
            <input
              type="datetime-local"
              value={startDraft}
              onChange={(e) => setStartDraft(e.target.value)}
              className="h-10 w-full rounded-2xl border bg-white px-3 text-base outline-none"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">End (optional)</div>
            <input
              type="datetime-local"
              value={endDraft}
              onChange={(e) => setEndDraft(e.target.value)}
              className="h-10 w-full rounded-2xl border bg-white px-3 text-base outline-none"
            />
          </div>

          <Button
            onClick={() => {
              setWorkout((prev) => {
                if (!prev) return prev;
                const startedAt = startDraft ? new Date(startDraft).toISOString() : prev.startedAt;
                const endedAt = endDraft ? new Date(endDraft).toISOString() : prev.endedAt;
                return { ...prev, startedAt, endedAt };
              });
              setTimeOpen(false);
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>

      {/* photo dialog */}
      <Dialog open={photoOpen} onOpenChange={setPhotoOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add Photo</DialogTitle>
          </DialogHeader>

          <input
            type="file"
            accept="image/*"
            className="text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = String(reader.result);
                setWorkout((prev) => (prev ? { ...prev, photoDataUrl: dataUrl } : prev));
              };
              reader.readAsDataURL(file);
            }}
          />

          <Button onClick={() => setPhotoOpen(false)}>Done</Button>
        </DialogContent>
      </Dialog>

      {/* block note dialog */}
      <Dialog
        open={blockNoteOpen.open}
        onOpenChange={(v) => setBlockNoteOpen((p) => ({ ...p, open: v }))}
      >
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{blockNoteOpen.mode === "sticky" ? "Sticky Note" : "Exercise Note"}</DialogTitle>
          </DialogHeader>

          <textarea
            className="min-h-[120px] rounded-2xl border bg-white p-3 text-base outline-none"
            value={blockNoteDraft}
            onChange={(e) => setBlockNoteDraft(e.target.value)}
          />

          <Button
            onClick={() => {
              const blockId = blockNoteOpen.blockId;
              if (!blockId) return;

              updateBlock(blockId, (blk) => {
                if (blockNoteOpen.mode === "sticky") {
                  return { ...blk, stickyNote: blockNoteDraft.trim() };
                }
                return { ...blk, note: blockNoteDraft.trim() };
              });

              setBlockNoteOpen({ open: false, blockId: null, mode: "note" });
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>

      {/* rest timer edit dialog */}
      <Dialog open={restEditOpen.open} onOpenChange={(v) => setRestEditOpen((p) => ({ ...p, open: v }))}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Update Rest Timer</DialogTitle>
          </DialogHeader>

          <Input value={restDraft} onChange={(e) => setRestDraft(e.target.value)} placeholder="1:30" />

          <Button
            onClick={() => {
              const blockId = restEditOpen.blockId;
              if (!blockId) return;
              const parsed = parseRestInput(restDraft);
              if (parsed === null) return;

              updateBlock(blockId, (blk) => ({ ...blk, restSeconds: parsed }));
              setRestEditOpen({ open: false, blockId: null });
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>

      {/* add exercise dialog */}
      <Dialog open={addExerciseOpen} onOpenChange={setAddExerciseOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add Exercises</DialogTitle>
          </DialogHeader>

          <Input
            value={exerciseSearch}
            onChange={(e) => setExerciseSearch(e.target.value)}
            placeholder="Search exercises..."
          />

          <div className="max-h-[320px] overflow-auto space-y-2">
            {EXERCISES.filter((x) =>
              x.name.toLowerCase().includes(exerciseSearch.trim().toLowerCase())
            ).map((ex) => (
              <button
                key={ex.id}
                className="w-full rounded-2xl border bg-white p-3 text-left"
                onClick={() => {
                  setWorkout((prev) => {
                    if (!prev) return prev;
                    const newBlock: WorkoutExerciseBlock = {
                      id: uid(),
                      exerciseId: ex.id,
                      name: ex.name,
                      bodyPart: ex.bodyPart,
                      category: ex.category,
                      restSeconds: 90,
                      sets: Array.from({ length: 3 }).map(() => ({
                        id: uid(),
                        type: "work",
                        weight: null,
                        reps: null,
                        completed: false,
                      })),
                    };
                    return { ...prev, exercises: [...prev.exercises, newBlock] };
                  });
                  setAddExerciseOpen(false);
                }}
              >
                <div className="font-semibold">{ex.name}</div>
                <div className="text-xs text-zinc-500">
                  {ex.bodyPart} • {ex.category}
                </div>
              </button>
            ))}
          </div>

          <Button variant="outline" onClick={() => setAddExerciseOpen(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}