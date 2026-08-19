import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CategoryDetail() {
  // 1. Récupère la valeur réelle du :slug dans l'URL (ex: "anxiete")
  const { slug } = useParams(); 
  
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Recharge les données à chaque fois que le slug change dans l'URL
    const fetchCategoryTopics = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/categories/${slug}`);
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error("Erreur de chargement", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryTopics();
  }, [slug]); // Se déclenche quand l'utilisateur change d'onglet/catégorie

  if (loading) return <p>Chargement des sujets...</p>;

  return (
    <div>
    <h1 style={{ textTransform: "capitalize" }}>{slug}</h1>

    {/* On utilise enfin la variable 'topics' ici */}
    <div className="topics-list">
      {topics.map((topic) => (
        <article key={topic.id} className="topic-card">
          <h3>{topic.title}</h3>
        </article>
      ))}
    </div>
  </div>
  );
}