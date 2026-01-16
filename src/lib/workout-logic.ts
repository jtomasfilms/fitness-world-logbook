import { format, isSameDay, parseISO } from "date-fns";
import { WorkoutSession } from "@/lib/types";

export function workoutVolume(w: WorkoutSession) {
  let total = 0;
  for (const ex of w.exercises) {
    for (const s of ex.sets) {
      if (!s.completed) continue;
      if (s.type !== "work") continue;
      const weight = s.weight ?? 0;
      const reps = s.reps ?? 0;
      total += weight * reps;
    }
  }
  return Math.round(total);
}

export function workoutDurationMinutes(w: WorkoutSession) {
  if (!w.endedAt) return 0;
  const a = new Date(w.startedAt).getTime();
  const b = new Date(w.endedAt).getTime();
  return Math.max(0, Math.round((b - a) / 60000));
}

export function niceDate(iso: string) {
  return format(parseISO(iso), "EEE, MMM d");
}

export function niceTime(iso: string) {
  return format(parseISO(iso), "h:mm a");
}

export function monthKey(iso: string) {
  return format(parseISO(iso), "MMMM yyyy");
}

export function dayName(iso: string) {
  return format(parseISO(iso), "EEEE");
}

export function findWorkoutOnDate(workouts: WorkoutSession[], dateISO: string) {
  const d = parseISO(dateISO);
  return workouts.find((w) => w.endedAt && isSameDay(parseISO(w.endedAt), d)) ?? null;
}

export function computePRCount(current: WorkoutSession, finishedHistory: WorkoutSession[]) {
  // Simple PR logic:
  // PR = any completed work set where (weight * reps) exceeds previous best for that exercise.
  const bestByExercise = new Map<string, number>();

  for (const w of finishedHistory) {
    for (const ex of w.exercises) {
      let best = bestByExercise.get(ex.exerciseId) ?? 0;
      for (const s of ex.sets) {
        if (!s.completed || s.type !== "work") continue;
        const score = (s.weight ?? 0) * (s.reps ?? 0);
        if (score > best) best = score;
      }
      bestByExercise.set(ex.exerciseId, best);
    }
  }

  let pr = 0;
  for (const ex of current.exercises) {
    const prevBest = bestByExercise.get(ex.exerciseId) ?? 0;
    for (const s of ex.sets) {
      if (!s.completed || s.type !== "work") continue;
      const score = (s.weight ?? 0) * (s.reps ?? 0);
      if (score > prevBest) {
        pr += 1;
      }
    }
  }

  return pr;
}
