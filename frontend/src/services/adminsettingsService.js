const API_URL = "http://localhost:5000/api/settings";

const NO_CACHE_OPTIONS = {
  cache: "no-store",
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
  },
};

export const getSettings = async () => {
  const res = await fetch(API_URL, NO_CACHE_OPTIONS);
  const result = await res.json();
  if (!res.ok) throw new Error("Impossible de charger les paramètres.");
  return result.data;
};

export const updateSettings = async (formData, token) => {
  const payload = {
    ...formData,
    topics_per_page: Number(formData.topics_per_page),
    maintenance_mode: Boolean(formData.maintenance_mode),
    registration_open: Boolean(formData.registration_open),
  };

  const res = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Erreur lors de la sauvegarde.");
  return result.data;
};