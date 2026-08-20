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