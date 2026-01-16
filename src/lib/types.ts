export type BodyPart =
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Biceps"
  | "Triceps"
  | "Legs"
  | "Glutes"
  | "Core"
  | "Full Body";

export type Category = "Strength" | "Machine" | "Bodyweight" | "Cardio";

export type Exercise = {
  id: string;
  name: string;
  bodyPart: BodyPart;
  category: Category;
};

export type TemplateExercise = {
  exerciseId: string;
  sets: number;
  restSeconds: number; // default rest timer
};

export type WorkoutTemplate = {
  id: string;
  title: string; // "Tuesday"
  exerciseIds: TemplateExercise[];
  lastPerformedAt?: string; // ISO
};

export type ProgramFolder = {
  id: string;
  name: string; // "6 Day Split"
  templates: WorkoutTemplate[];
};

export type SetType = "warmup" | "work";

export type WorkoutSet = {
  id: string;
  type: SetType;
  weight: number | null;
  reps: number | null;
  completed: boolean;
  completedAt?: string; // ISO timestamp
};

export type WorkoutExerciseBlock = {
  id: string; // block id
  exerciseId: string;
  name: string;
  bodyPart: BodyPart;
  category: Category;

  restSeconds: number;
  sets: WorkoutSet[];

  note?: string;
  stickyNote?: string;

  // future-ready fields
  supersetGroupId?: string;
};

export type WorkoutSession = {
  id: string;
  title: string;
  templateId?: string;

  startedAt: string; // ISO
  endedAt?: string; // ISO

  exercises: WorkoutExerciseBlock[];

  note?: string;
  photoDataUrl?: string;

  // computed summaries (set when finished)
  totalVolume?: number;
  prCount?: number;
};

export type UserProfile = {
  username: string;
  measurements: MeasurementEntry[];
};

export type MeasurementEntry = {
  id: string;
  date: string; // ISO
  key: "Neck" | "Waist" | "Weight";
  value: number;
};
