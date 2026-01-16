import { ProgramFolder, UserProfile } from "@/lib/types";

export const DEFAULT_PROGRAMS: ProgramFolder[] = [
  {
    id: "program-6day",
    name: "6 Day Split (6)",
    templates: [
      {
        id: "tpl-mon",
        title: "Monday",
        exerciseIds: [
          { exerciseId: "ohp", sets: 4, restSeconds: 90 },
          { exerciseId: "arnold-press", sets: 3, restSeconds: 90 },
          { exerciseId: "lateral-raise", sets: 4, restSeconds: 60 },
        ],
      },
      {
        id: "tpl-tue",
        title: "Tuesday",
        exerciseIds: [
          { exerciseId: "lat-pulldown", sets: 4, restSeconds: 90 },
          { exerciseId: "seated-row", sets: 4, restSeconds: 90 },
          { exerciseId: "barbell-curl", sets: 3, restSeconds: 60 },
        ],
      },
      {
        id: "tpl-wed",
        title: "Wednesday",
        exerciseIds: [
          { exerciseId: "hack-squat", sets: 4, restSeconds: 120 },
          { exerciseId: "rdl", sets: 4, restSeconds: 120 },
          { exerciseId: "leg-extension", sets: 3, restSeconds: 90 },
        ],
      },
      {
        id: "tpl-thu",
        title: "Thursday",
        exerciseIds: [
          { exerciseId: "bench-press", sets: 4, restSeconds: 120 },
          { exerciseId: "incline-db-press", sets: 3, restSeconds: 90 },
          { exerciseId: "tricep-pushdown", sets: 4, restSeconds: 60 },
        ],
      },
      {
        id: "tpl-fri",
        title: "Friday",
        exerciseIds: [
          { exerciseId: "sumo-deadlift", sets: 4, restSeconds: 150 },
          { exerciseId: "leg-curl", sets: 4, restSeconds: 90 },
          { exerciseId: "calf-raise", sets: 4, restSeconds: 60 },
        ],
      },
      {
        id: "tpl-sat",
        title: "Saturday",
        exerciseIds: [
          { exerciseId: "dips", sets: 4, restSeconds: 90 },
          { exerciseId: "skullcrushers", sets: 3, restSeconds: 90 },
          { exerciseId: "lateral-raise", sets: 3, restSeconds: 60 },
        ],
      },
    ],
  },
];

export const DEFAULT_PROFILE: UserProfile = {
  username: "jtomas229",
  measurements: [],
};
