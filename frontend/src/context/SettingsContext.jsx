import { useState, useEffect, useCallback } from "react";
import { SettingsContext } from "./SettingsContext";
import {
  getSettings as fetchSettingsFromApi,
  updateSettings as updateSettingsViaApi,
} from "../services/adminsettingsService";

export const DEFAULT_SETTINGS = {
  forum_name: "Espace Sécurisé",
  maintenance_mode: false,
  topics_per_page: 10,
  registration_open: true,
};

const coerceSettings = (raw) => ({
  ...DEFAULT_SETTINGS,
  ...(raw || {}),
  maintenance_mode: Boolean(raw?.maintenance_mode),
  registration_open: Boolean(raw?.registration_open),
  topics_per_page: parseInt(raw?.topics_per_page, 10) || DEFAULT_SETTINGS.topics_per_page,
  forum_name: String(raw?.forum_name || DEFAULT_SETTINGS.forum_name).trim() || DEFAULT_SETTINGS.forum_name,
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchSettingsFromApi();
        if (cancelled) return;
        setSettings(coerceSettings(data));
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setSettings(DEFAULT_SETTINGS);
          setError(err.message || "Erreur de chargement des paramètres.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setHydrated(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = settings.forum_name;
  }, [settings.forum_name]);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await fetchSettingsFromApi();
      setSettings(coerceSettings(data));
      setError(null);
    } catch (err) {
      setError(err.message || "Erreur de mise à jour des paramètres.");
    }
  }, []);

  const saveSettings = useCallback(async (rawValues, token) => {
    const payload = coerceSettings(rawValues);
    const saved = await updateSettingsViaApi(payload, token);
    const normalized = coerceSettings(saved);
    setSettings(normalized);
    setError(null);
    return normalized;
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        hydrated,
        refreshSettings,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
