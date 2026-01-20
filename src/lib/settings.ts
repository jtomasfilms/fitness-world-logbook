// src/lib/settings.ts

export type AppSettings = {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
};

const KEY = "app_settings_v1";

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
};

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<AppSettings>;

    return {
      soundEnabled:
        typeof parsed.soundEnabled === "boolean"
          ? parsed.soundEnabled
          : DEFAULT_SETTINGS.soundEnabled,
      vibrationEnabled:
        typeof parsed.vibrationEnabled === "boolean"
          ? parsed.vibrationEnabled
          : DEFAULT_SETTINGS.vibrationEnabled,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(next: AppSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(next));
}
