const API_URL = "http://localhost:5000/api/fiches";

export const getFiches = async () => {
  const response = await fetch(API_URL);
  
  if (!response.ok) {
    throw new Error("Impossible de récupérer les fiches.");
  }
  
  const result = await response.json();

  return result.data ; 
};


export const getFicheBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/${slug}`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer la fiche.");
  }

  const result = await response.json();
  return result.data;
};