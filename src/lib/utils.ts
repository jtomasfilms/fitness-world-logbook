import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function formatSeconds(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

export function parseRestInput(value: string) {
  // Accept "90", "1:30", "2:00"
  const v = value.trim();
  if (!v) return null;

  if (v.includes(":")) {
    const [m, s] = v.split(":");
    const mm = Number(m);
    const ss = Number(s);
    if (Number.isFinite(mm) && Number.isFinite(ss)) return mm * 60 + ss;
    return null;
  }

  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.floor(n));
}
