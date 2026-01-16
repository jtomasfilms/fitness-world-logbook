import { Exercise } from "@/lib/types";

export const EXERCISES: Exercise[] = [
  { id: "bench-press", name: "Bench Press", bodyPart: "Chest", category: "Strength" },
  { id: "incline-db-press", name: "Incline Dumbbell Press", bodyPart: "Chest", category: "Strength" },
  { id: "chest-fly", name: "Chest Fly (Machine)", bodyPart: "Chest", category: "Machine" },
  { id: "push-up", name: "Push-Up", bodyPart: "Chest", category: "Bodyweight" },

  { id: "pull-up", name: "Pull-Up", bodyPart: "Back", category: "Bodyweight" },
  { id: "lat-pulldown", name: "Lat Pulldown", bodyPart: "Back", category: "Machine" },
  { id: "seated-row", name: "Seated Cable Row", bodyPart: "Back", category: "Machine" },
  { id: "db-row", name: "Dumbbell Row", bodyPart: "Back", category: "Strength" },

  { id: "ohp", name: "Overhead Press", bodyPart: "Shoulders", category: "Strength" },
  { id: "arnold-press", name: "Arnold Press", bodyPart: "Shoulders", category: "Strength" },
  { id: "lateral-raise", name: "Lateral Raise", bodyPart: "Shoulders", category: "Strength" },
  { id: "rear-delt-fly", name: "Rear Delt Fly", bodyPart: "Shoulders", category: "Machine" },

  { id: "barbell-curl", name: "Barbell Curl", bodyPart: "Biceps", category: "Strength" },
  { id: "hammer-curl", name: "Hammer Curl", bodyPart: "Biceps", category: "Strength" },
  { id: "preacher-curl", name: "Preacher Curl (Machine)", bodyPart: "Biceps", category: "Machine" },

  { id: "tricep-pushdown", name: "Tricep Pushdown", bodyPart: "Triceps", category: "Machine" },
  { id: "skullcrushers", name: "Skullcrushers", bodyPart: "Triceps", category: "Strength" },
  { id: "dips", name: "Dips", bodyPart: "Triceps", category: "Bodyweight" },

  { id: "squat", name: "Barbell Squat", bodyPart: "Legs", category: "Strength" },
  { id: "hack-squat", name: "Hack Squat", bodyPart: "Legs", category: "Machine" },
  { id: "rdl", name: "Romanian Deadlift", bodyPart: "Legs", category: "Strength" },
  { id: "sumo-deadlift", name: "Sumo Deadlift", bodyPart: "Legs", category: "Strength" },
  { id: "leg-extension", name: "Leg Extension", bodyPart: "Legs", category: "Machine" },
  { id: "leg-curl", name: "Leg Curl", bodyPart: "Legs", category: "Machine" },
  { id: "calf-raise", name: "Calf Raise (Machine)", bodyPart: "Legs", category: "Machine" },

  { id: "hip-thrust", name: "Hip Thrust", bodyPart: "Glutes", category: "Strength" },
  { id: "glute-bridge", name: "Glute Bridge", bodyPart: "Glutes", category: "Bodyweight" },

  { id: "plank", name: "Plank", bodyPart: "Core", category: "Bodyweight" },
  { id: "cable-crunch", name: "Cable Crunch", bodyPart: "Core", category: "Machine" },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", bodyPart: "Core", category: "Bodyweight" },

  { id: "treadmill", name: "Treadmill", bodyPart: "Full Body", category: "Cardio" },
];
