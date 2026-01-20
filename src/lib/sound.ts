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

export function playBeep() {
  try {
    // whatever audio code you already have (keep it)
    const audio = new Audio("/beep.mp3"); // example: KEEP YOUR EXISTING PATH
    audio.currentTime = 0;
    audio.play().catch(() => {});

    // ✅ add vibration
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  } catch (e) {
    // ignore
  }
}
