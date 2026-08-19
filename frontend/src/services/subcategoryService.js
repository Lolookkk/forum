const API_URL = "http://localhost:5000/api";

export const getSubcategoryBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/subcategories/${slug}`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer la sous-catégorie.");
  }

  const result = await response.json();
  return result.data;
};

export const getTopicsBySubcategory = async (subcategoryId) => {
  const response = await fetch(`${API_URL}/subcategories/${subcategoryId}/topics`);
  
  if (!response.ok) {
    throw new Error("Impossible de récupérer les topics.");
  }
  
  const result = await response.json();
  return result.data ; 
}

