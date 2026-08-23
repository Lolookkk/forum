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