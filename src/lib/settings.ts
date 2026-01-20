export type AppSettings = {
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
};

const KEY = "fw_settings_v1";

const DEFAULTS: Required<AppSettings> = {
  soundEnabled: true,
  vibrationEnabled: true,
};

export function getSettings(): Required<AppSettings> {
  if (typeof window === "undefined") return DEFAULTS;

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as AppSettings;

    return {
      soundEnabled: parsed.soundEnabled ?? true,
      vibrationEnabled: parsed.vibrationEnabled ?? true,
    };
  } catch {
    return DEFAULTS;
  }
}

export function saveSettings(patch: AppSettings) {
  if (typeof window === "undefined") return;

  const prev = getSettings();
  const next = { ...prev, ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
}
