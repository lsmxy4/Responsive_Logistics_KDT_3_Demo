import { useEffect, useState } from "react"
import { DEFAULT_NOTIFICATION_SETTINGS, type SettingsState } from "../data/messages"

const STORAGE_KEY = "fresh-chain-notification-settings"

function readStoredSettings(): SettingsState {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_SETTINGS

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS

    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...(JSON.parse(raw) as Partial<SettingsState>),
    }
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS
  }
}

export function useNotificationSettings() {
  const [settings, setSettings] = useState<SettingsState>(() => readStoredSettings())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const toggleSetting = (key: keyof SettingsState) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return { settings, setSettings, toggleSetting }
}