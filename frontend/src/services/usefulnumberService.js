const API_URL = "http://localhost:5000/api/usefulnumbers";

// ==========================================
// NUMÉROS UTILES
// ==========================================

export const getUsefulNumbers = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les numéros.");
  }

  const result = await response.json();
  return result.data;
};

export const getUsefulNumberById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer le numéro.");
  }

  const result = await response.json();
  return result.data;
};

export const createUsefulNumber = async (numberData, token) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(numberData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de créer le numéro.");
  }

  return result.data;
};

export const updateUsefulNumber = async (id, numberData, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(numberData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de modifier le numéro.");
  }

  return result.data;
};

export const deleteUsefulNumber = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de supprimer le numéro.");
  }

  return result;
};

// ==========================================
// CATÉGORIES DE NUMÉROS
// ==========================================

export const getUsefulNumberCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les catégories.");
  }

  const result = await response.json();
  return result.data;
};

export const createUsefulNumberCategory = async (name, token) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de créer la catégorie.");
  }

  return result.data;
};

export const updateUsefulNumberCategory = async (id, name, token) => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de modifier la catégorie.");
  }

  return result.data;
};

export const deleteUsefulNumberCategory = async (id, token) => {
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