import { DEFAULT_PROFILE, DEFAULT_PROGRAMS } from "@/lib/seed";
import { EXERCISES } from "@/data/exercises";
import {
  ProgramFolder,
  UserProfile,
  WorkoutSession,
  WorkoutExerciseBlock,
  WorkoutSet,
} from "@/lib/types";
import { uid } from "@/lib/utils";

const KEYS = {
  programs: "fwj.programs.v1",
  workouts: "fwj.workouts.v1",
  profile: "fwj.profile.v1",
};

function getJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureSeed() {
  const programs = getJSON<ProgramFolder[] | null>(KEYS.programs, null);
  if (!programs || programs.length === 0) setJSON(KEYS.programs, DEFAULT_PROGRAMS);

  const profile = getJSON<UserProfile | null>(KEYS.profile, null);
  if (!profile) setJSON(KEYS.profile, DEFAULT_PROFILE);

  const workouts = getJSON<WorkoutSession[] | null>(KEYS.workouts, null);
  if (!workouts) setJSON(KEYS.workouts, []);
}

export function listPrograms() {
  return getJSON<ProgramFolder[]>(KEYS.programs, DEFAULT_PROGRAMS);
}

export function savePrograms(programs: ProgramFolder[]) {
  setJSON(KEYS.programs, programs);
}

export function listWorkouts() {
  return getJSON<WorkoutSession[]>(KEYS.workouts, []);
}

export function saveWorkouts(workouts: WorkoutSession[]) {
  setJSON(KEYS.workouts, workouts);
}

export function getWorkout(id: string) {
  return listWorkouts().find((w) => w.id === id) ?? null;
}

export function upsertWorkout(workout: WorkoutSession) {
  const all = listWorkouts();
  const idx = all.findIndex((w) => w.id === workout.id);
  if (idx >= 0) all[idx] = workout;
  else all.unshift(workout);
  saveWorkouts(all);
}

export function deleteWorkout(id: string) {
  const all = listWorkouts().filter((w) => w.id !== id);
  saveWorkouts(all);
}

export function getProfile() {
  return getJSON<UserProfile>(KEYS.profile, DEFAULT_PROFILE);
}

export function saveProfile(profile: UserProfile) {
  setJSON(KEYS.profile, profile);
}

export function createEmptyWorkout(): WorkoutSession {
  const now = new Date().toISOString();
  const workout: WorkoutSession = {
    id: uid(),
    title: "Empty Workout",
    startedAt: now,
    exercises: [],
  };
  upsertWorkout(workout);
  return workout;
}

export function createWorkoutFromTemplate(templateId: string): WorkoutSession {
  const programs = listPrograms();
  const template =
    programs.flatMap((p) => p.templates).find((t) => t.id === templateId) ?? null;

  const now = new Date().toISOString();
  const workout: WorkoutSession = {
    id: uid(),
    title: template?.title ?? "Workout",
    templateId,
    startedAt: now,
    exercises: [],
  };

  if (template) {
    workout.exercises = template.exerciseIds.map((te) => {
      const ex = EXERCISES.find((e) => e.id === te.exerciseId);
      const sets: WorkoutSet[] = Array.from({ length: te.sets }).map(() => ({
        id: uid(),
        type: "work",
        weight: null,
        reps: null,
        completed: false,
      }));

      const block: WorkoutExerciseBlock = {
        id: uid(),
        exerciseId: te.exerciseId,
        name: ex?.name ?? "Exercise",
        bodyPart: ex?.bodyPart ?? "Full Body",
        category: ex?.category ?? "Strength",
        restSeconds: te.restSeconds ?? 90,
        sets,
      };

      return block;
    });
  }

  upsertWorkout(workout);
  return workout;
}

export function markTemplatePerformed(templateId: string) {
  const programs = listPrograms();
  for (const program of programs) {
    const t = program.templates.find((x) => x.id === templateId);
    if (t) {
      t.lastPerformedAt = new Date().toISOString();
    }
  }
  savePrograms(programs);
}

export function resetAllData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.programs);
  localStorage.removeItem(KEYS.workouts);
  localStorage.removeItem(KEYS.profile);
  ensureSeed();
}
