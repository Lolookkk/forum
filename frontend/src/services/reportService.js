const API_URL = "http://localhost:5000/api";

// Signaler un SUJET
export const reportTopic = async (topicId, reason, token) => {
  const res = await fetch(`${API_URL}/topics/${topicId}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Erreur lors du signalement.");
  return result.report;
};

// Signaler un MESSAGE (Post)
export const reportPost = async (postId, reason, token) => {
  const res = await fetch(`${API_URL}/posts/${postId}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Erreur lors du signalement.");
  return result.report;
};

export const getPendingReports = async (token) => {
  const res = await fetch(`${API_URL}/reports/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Impossible de charger les signalements.");
  return result.data;
};

export const processReport = async (reportId, { action, newContent, newTitle }, token) => {
  const res = await fetch(`${API_URL}/reports/${reportId}/process`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action, newContent, newTitle }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Erreur lors du traitement.");
  return result.report;
};