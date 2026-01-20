export type AppSettings = {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
};

const SETTINGS_KEY = "fw_settings_v1";

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
};

export function getSettings(): AppSettings {
  // Important: prevents SSR hydration mismatch
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(next: Partial<AppSettings>): AppSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS, ...next };

  const current = getSettings();
  const merged: AppSettings = { ...current, ...next };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  return merged;
}
