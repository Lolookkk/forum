const API_URL = "http://localhost:5000/api";

const NO_CACHE_OPTIONS = {
  cache: "no-store",
  headers: { "Cache-Control": "no-cache, no-store, must-revalidate", Pragma: "no-cache" },
};

export const getSubcategoryBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/subcategories/${slug}`, NO_CACHE_OPTIONS);

  if (!response.ok) {
    throw new Error("Impossible de récupérer la sous-catégorie.");
  }

  const result = await response.json();
  return result.data;
};

export const getTopicsBySubcategory = async (subcategoryId) => {
  const response = await fetch(
    `${API_URL}/subcategories/${subcategoryId}/topics`,
    NO_CACHE_OPTIONS
  );

  if (!response.ok) {
    throw new Error("Impossible de récupérer les topics.");
  }

  const result = await response.json();
  return result.data;
}

// ==========================================
// ACTIONS ADMIN (CRÉATION, MODIFICATION, SUPPRESSION)
// ==========================================

export const createSubcategory = async (subcategoryData, token) => {
  const response = await fetch(`${API_URL}/subcategories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subcategoryData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de créer la sous-catégorie.");
  }

  return result.subCategory;
};

export const updateSubcategory = async (id, subcategoryData, token) => {
  const response = await fetch(`${API_URL}/subcategories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subcategoryData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de modifier la sous-catégorie.");
  }

  return result.subcategory;
};

export const deleteSubcategory = async (id, token) => {
  const response = await fetch(`${API_URL}/subcategories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de supprimer la sous-catégorie.");
  }

  return result;
};
