const API_URL = "http://localhost:5000/api/announcements";


export const getAnnouncements = async () => {
  const response = await fetch(API_URL);
  
  if (!response.ok) {
    throw new Error("Impossible de récupérer catégories.");
  }
  
  const result = await response.json();

  return result.data ; 
};

export const createAnnounce = async (title, content, token) => {
  const response = await fetch(API_URL, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({title, content}),
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error("Erreur lors de la création de l'annonce.");
    }
    
    return result.announce ; // car result est {message, announce} 
};
