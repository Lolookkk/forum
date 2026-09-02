const API_URL = "http://localhost:5000/api/posts";



export async function getAllPostsWithAuthorByTopic(topicId) {
  const response = await fetch(`${API_URL}/infos/${topicId}`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du post.");
  }
  const result = await response.json();
  return result.data; 
}

export async function getPostById(postId) {
  const response = await fetch(`${API_URL}/${postId}`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du post.");
  }
  const result = await response.json();
  return result.data;
}

export const createPost = async (topic_id, content, token) => {
  const response = await fetch(API_URL, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({topic_id, content}),
    });
    const result = await response.json();

    if (!response.ok) {
        throw new Error("Erreur lors de la création du post.");
    }
    
    return result.post ; // car result est {message, post} 
};