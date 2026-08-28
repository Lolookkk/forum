import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories, getSubcategoriesByCategory } from "../services/categoryService";
import "./Home.css";
import { ServiceBannerWidget, CreateTopicButton }  from "../components/sidebar/Widgets";
import Sidebar from "../components/sidebar/Sidebar";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // On lance la requête directement sans setState synchrone au démarrage
    getCategories()
      .then(async (cats) => {
        const categoriesWithSubs = await Promise.all(
          cats.map(async (cat) => {
            try {
              const subcategories = await getSubcategoriesByCategory(cat.id);
              return { ...cat, subcategories };
            } catch {
              return { ...cat, subcategories: [] };
            }
          })
        );

        if (isMounted) {
          setCategories(categoriesWithSubs);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-container">
      {/* Colonne Gauche : Liste globale des catégories */}
      <main className="main-content">
        <h1 className="page-title">Catégories</h1>

        {/* Message de chargement */}
        {loading && <div className="state-message">Chargement des catégories...</div>}

        {/* Message d'erreur */}
        {error && <div className="state-message error">{error}</div>}

        {/* Si aucune catégorie n'est trouvée */}
        {!loading && !error && categories.length === 0 && (
          <div className="state-message">Aucune catégorie disponible.</div>
        )}

        {/* Cartes de catégories avec leurs sous-catégories */}
        {!loading &&
          !error &&
          categories.map((cat) => (
            <div key={cat.id} className="topics-card" style={{ marginBottom: "2rem" }}>
              <div className="table-header">
                <Link to={`/categories/${cat.slug}`} >
                  {cat.name}
                </Link>
                <span>{cat.subcategories.length} sous-catégories</span>
              </div>

              {cat.subcategories.length === 0 ? (
                <div className="state-message">Aucune sous-catégorie pour le moment.</div>
              ) : (
                cat.subcategories.map((subCat) => (
                  <div key={subCat.id} className="topic-row">
                    <div className="topic-info">
                      <Link to={`/categories/${cat.slug}/${subCat.slug}`}>
                        <span>{subCat.title}</span>
                      </Link>
                    </div>
                    <div className="topic-stats">
                      {subCat.topics_count ?? 0} sujets
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
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