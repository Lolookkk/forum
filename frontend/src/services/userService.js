const API_URL = "http://localhost:5000/api/users";

export const getMembers = async () => {
  const response = await fetch(API_URL);
  
  if (!response.ok) {
    throw new Error("Impossible de récupérer les membres.");
  }
  
  const result = await response.json(); //{Message,data : users}

  return result.data ;
};