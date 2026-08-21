const API_URL = "http://localhost:5000/api/auth";

export async function registerUser(username, email, password) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, email, password}),
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error("Erreur lors de la création de compte.");
    }
    
    return result.user ; // car result est {message, user} 
}


export async function loginUser(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email, password}),
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error("Erreur lors de la connexion.");
    }
    
    return result ; // car result est {token, user} 
}

export async function getMe(token) {
  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Session expirée.");
  return data; // Renvoie { user }
}


