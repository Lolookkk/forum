const API_URL = "http://localhost:5000/api";

export const getTopics = async () => {
  const response = await fetch(`${API_URL}/topics`);
  
  if (!response.ok) {
    throw new Error("Impossible de récupérer les derniers sujets.");
  }
  
  const result = await response.json();

  return result.data ; // Attend un format { success: true, data: [...] }
};