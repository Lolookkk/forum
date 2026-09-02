const API_URL = "http://localhost:5000/api";

export const getTopics = async () => {
  const response = await fetch(`${API_URL}/topics`);
  
  if (!response.ok) {
    throw new Error("Impossible de récupérer les derniers sujets.");
  }
  
  const result = await response.json();
  return result.data;
};

export async function getTopicBySlug(slug) {
  const response = await fetch(`${API_URL}/topics/${slug}`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du sujet.");
  }
  const result = await response.json();
  return result.data; // Extraction de data
}

export async function getTopicInformationById(topicId) {
  const response = await fetch(`${API_URL}/topics/infos/${topicId}`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du sujet.");
  }
  const result = await response.json();
  return result.data; // Extraction de data
}

export const createTopic = async (topicData, token) => {
  const response = await fetch(`${API_URL}/topics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(topicData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de créer le sujet.");
  }

  return result.topic;
};

export const updateTopic = async (topicId, topicData, token) => {
  const response = await fetch(`${API_URL}/topics/${topicId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-store",
      Pragma: "no-cache",
    },
    body: JSON.stringify(topicData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de modifier le sujet.");
  }

  return result.topic;
};
