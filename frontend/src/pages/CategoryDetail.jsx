import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/forum/HomeSidebar";
import { getCategoryBySlug, getSubcategoriesByCategory } from "../services/categoryService";
import "./Home.css"; // Réutilise les mêmes styles que Home.jsx

export default function CategoryDetail() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Récupération de la catégorie via le slug
    getCategoryBySlug(slug)
      .then((catData) => {
        setCategory(catData);
        // 2. Récupération des sous-catégories via l'ID de la catégorie
        return getSubcategoriesByCategory(catData.id);
      })
      .then((subData) => {
        setSubcategories(subData);
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
        <h2 style={{ textTransform: "uppercase" }}>
          {category?.name || slug}
        </h2>

        <div className="topics-card">
          <div className="table-header">
            <span>Sous-catégorie</span>
            <span>Description</span>
            <span>Sujets</span>
          </div>

          {/* Affichage pendant le chargement */}
          {loading && (
            <div className="state-message">Chargement des sous-catégories...</div>
          )}

          {/* Affichage en cas d'erreur backend */}
          {error && <div className="state-message error">{error}</div>}

          {/* Affichage si la liste est vide */}
          {!loading && !error && subcategories.length === 0 && (
            <div className="state-message">Aucune sous-catégorie pour le moment.</div>
          )}

          {/* Affichage de la liste des sous-catégories */}
          {!loading &&
            !error &&
            subcategories.map((subCat) => (
              <div key={subCat.id} className="topic-row">
                <div className="topic-info">
                  <span className="topic-title">{subCat.name}</span>
                </div>
                <div className="topic-category">
                  {subCat.description || "Aucune description"}
                </div>
                <div className="topic-stats">
                  {subCat.topics_count ?? 0} sujets
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* Colonne Droite : Sidebar */}
      <Sidebar />
    </div>
  );
}