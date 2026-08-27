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

export const createFiche = async (ficheData, token) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { 
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
            },
    body: JSON.stringify(ficheData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de créer la fiche.");
  }

  return result.data;
};

export const updateTitleFiche = async (id, title, token) => {
  const response = await fetch(`${API_URL}/${id}/title`, {
    method: "PATCH",
    headers: { 
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
            },
    body: JSON.stringify({ title }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de modifier le titre.");
  }

  return result.data;
};

export const updateDescriptionFiche = async (id, description, token) => {
  const response = await fetch(`${API_URL}/${id}/description`, {
    method: "PATCH",
    headers: { 
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
            },
    body: JSON.stringify({ description }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de modifier la description.");
  }

  return result.data;
};

export const updateContentFiche = async (id, content, token) => {
  const response = await fetch(`${API_URL}/${id}/content`, {
    method: "PATCH",
    headers: { 
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
            },
    body: JSON.stringify({ content }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de modifier le contenu.");
  }

  return result.data;
};

export const deleteFiche = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { 
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
            },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Impossible de supprimer la fiche.");
  }

  return result;
};