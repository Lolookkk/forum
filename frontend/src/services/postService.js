const API_URL = "http://localhost:5000/api";



export async function getAllPostsWithAuthorByTopic(topicId) {
  const response = await fetch(`${API_URL}/posts/infos/${topicId}`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du post.");
  }
  const result = await response.json();
  return result.data; 
}