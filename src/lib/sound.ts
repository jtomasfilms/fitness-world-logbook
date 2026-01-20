let ctx: AudioContext | null = null;

export async function primeAudio() {
  try {
    if (typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    if (!ctx) ctx = new AudioCtx();
    if (ctx.state === "suspended") await ctx.resume();
  } catch {
    // ignore
  }
}
// src/lib/sound.ts
import { getSettings } from "./settings";

export function playBeep() {
  const settings = getSettings();

  try {
    // ✅ Sound toggle
    if (settings.soundEnabled) {
      const audio = new Audio("/beep.mp3"); // keep your existing path
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }

    // ✅ Vibration toggle
    if (
      settings.vibrationEnabled &&
      typeof navigator !== "undefined" &&
      "vibrate" in navigator
    ) {
      navigator.vibrate([200, 100, 200]);
    }
  } catch {
    // ignore
  }
}
export function vibrateTimer(pattern: number | number[] = [120, 60, 120]) {
  if (typeof window === "undefined") return;
  if (!("vibrate" in navigator)) return;
  navigator.vibrate(pattern);
}
