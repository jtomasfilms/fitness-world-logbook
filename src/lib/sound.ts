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
    if (!ctx) return;

    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.06;

    o.connect(g);
    g.connect(ctx.destination);

    const now = ctx.currentTime;
    o.start(now);
    o.stop(now + 0.2);
  } catch {
    // ignore
  }
}
