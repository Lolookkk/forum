const API_URL = "http://localhost:5000/api";

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  
  if (!response.ok) {
    throw new Error("Impossible de récupérer catégories.");
  }
  
  const result = await response.json();

  return result.data ; 
};