const API_URL = "http://localhost:5000/api";

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  
  if (!response.ok) {
    throw new Error("Impossible de récupérer catégories.");
  }
  
  const result = await response.json();

  return result.data ; 
};

export const getSubcategoriesByCategory = async (categoryId) => {
  const response = await fetch(`${API_URL}/categories/${categoryId}/subcategories`);
  
  if (!response.ok) {
    throw new Error("Impossible de récupérer les sous-catégories.");
  }
  
  const result = await response.json();
  return result.data ; 
}

export const getCategoryBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/categories/${slug}`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer la catégorie.");
  }

  const result = await response.json();
  return result.data;
};

