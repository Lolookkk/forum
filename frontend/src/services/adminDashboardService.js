// src/services/adminDashboardService.js
const API_URL = "http://localhost:5000/api/stats/admin/dashboard";

export const getAdminDashboardData = async (token) => {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Impossible de charger le tableau de bord.");
  return result.data;
};