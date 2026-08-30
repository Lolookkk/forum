const API_URL = "http://localhost:5000/api";

const NO_CACHE_OPTIONS = {
  cache: "no-store",
  headers: { "Cache-Control": "no-cache, no-store, must-revalidate", Pragma: "no-cache" },
};

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`, NO_CACHE_OPTIONS);

  if (!response.ok) {
    throw new Error("Impossible de récupérer catégories.");
  }

  const result = await response.json();

  return result.data;
};

export const getSubcategoriesByCategory = async (categoryId) => {
  const response = await fetch(
    `${API_URL}/categories/${categoryId}/subcategories`,
    NO_CACHE_OPTIONS
  );

  if (!response.ok) {
    throw new Error("Impossible de récupérer les sous-catégories.");
  }

  const result = await response.json();
  return result.data;
};

export const getCategoryBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/categories/${slug}`, NO_CACHE_OPTIONS);

  if (!response.ok) {
    throw new Error("Impossible de récupérer la catégorie.");
  }

  const result = await response.json();
  return result.data;
};

export const getForumCategories = async () => {
  const response = await fetch(`${API_URL}/categories/tree`, NO_CACHE_OPTIONS);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les catégories du forum.");
  }

  const result = await response.json();
  return result.data;
};

// ==========================================
// ACTIONS ADMIN (CRÉATION, MODIFICATION, SUPPRESSION)
// ==========================================

export const createCategory = async (categoryData, token) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de créer la catégorie.");
  }

  return result.category;
};

export const updateCategory = async (id, categoryData, token) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de modifier la catégorie.");
  }

  return result.category;
};

export const deleteCategory = async (id, token) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de supprimer la catégorie.");
  }

  return result;
};

export const reorderCategories = async (categoriesOrder, token) => {
  const response = await fetch(`${API_URL}/categories/reorder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ categories: categoriesOrder }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de réordonner les catégories.");
  }

  return result.categories;
};