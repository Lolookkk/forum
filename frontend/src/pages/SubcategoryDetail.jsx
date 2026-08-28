import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSubcategoryBySlug, getTopicsBySubcategory } from "../services/subcategoryService";
import "./Home.css"; // Réutilise les mêmes styles que Home.jsx
import Sidebar from "../components/sidebar/Sidebar";
import { ServiceBannerWidget, CreateTopicButton }  from "../components/sidebar/Widgets";

export default function SubcategoryDetail() {
  const { slug } = useParams();

  const [subcategory, setSubcategory] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Récupération de la catégorie via le slug
    getSubcategoryBySlug(slug)
      .then((subcatData) => {
        setSubcategory(subcatData);
        // 2. Récupération des sous-catégories via l'ID de la catégorie
        return getTopicsBySubcategory(subcatData.id);
      })
      .then((topData) => {
        setTopics(topData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="home-container">
      {/* Colonne Gauche : Flux principal */}
      <main className="main-content">
        <h1 className="page-title">{subcategory?.title || slug}</h1>
        <h2 style={{ textTransform: "uppercase" }}>
          {subcategory?.title || slug}
        </h2>

        <div className="topics-card">
          <div className="table-header">
            <span>Sujets</span>
            <span>Description</span>
          </div>

          {/* Affichage pendant le chargement */}
          {loading && (
            <div className="state-message">Chargement des sujets...</div>
          )}

          {/* Affichage en cas d'erreur backend */}
          {error && <div className="state-message error">{error}</div>}

          {/* Affichage si la liste est vide */}
          {!loading && !error && topics.length === 0 && (
            <div className="state-message">Aucun sujet pour le moment.</div>
          )}

          {/* Affichage de la liste des sous-catégories */}
          {!loading &&
            !error &&
            topics.map((topic) => (
              <div key={topic.id} className="topic-row">
                <div className="topic-info">
                  <Link to={`/topics/${topic.slug}`}>
                    <span className="topic-title">{topic.title}</span>
                  </Link>
                </div>
                <div className="topic-stats">
                  {topic.responses_count ?? 0} réponses
                </div>
              </div>
            ))}
        </div>
      </main>

      <Sidebar>
              <ServiceBannerWidget
                title="SERVICE :"
                description="DÉCOUVREZ NOS ATELIERS DE BIEN-ÊTRE MENTAL"
                icon="🌻"
                />
               <CreateTopicButton />
            </Sidebar>
    </div>
  );
}