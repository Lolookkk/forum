const API_URL = "http://localhost:5000/api/users";

export const getMembers = async () => {
  const response = await fetch(API_URL);
  
  if (!response.ok) {
    throw new Error("Impossible de récupérer les membres.");
  }
  
  const result = await response.json(); //{Message,data : users}

  return result.data ;
};

export const getPublicProfile = async (username) => {
  const response = await fetch(`${API_URL}/${username}`);
  console.log("réponse dans service", response);
  if (!response.ok) {
    throw new Error("Impossible de récupérer le profil.");
  }
  
  const result = await response.json(); 
  
  return result.data ;
};

// Changer le rôle d'un utilisateur
export const updateUserRole = async (userId, role, token) => {
  const response = await fetch(`${API_URL}/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
  if (!response.ok) {
    throw new Error("Impossible de modifier le rôle.");
  }
  const result = await response.json();
  return result.user;
};

// Bannir un utilisateur
export const banUser = async (userId, token) => {
  const response = await fetch(`${API_URL}/${userId}/ban`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isBanned: true }),
  });
  if (!response.ok) {
    throw new Error("Impossible de bannir l'utilisateur.");
  }
  const result = await response.json();
  return result.user;
};

// Supprimer un utilisateur (uniquement pour les bannis)
export const deleteUser = async (userId, token) => {
  const response = await fetch(`${API_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Impossible de supprimer l'utilisateur.");
  }
  return true;
};