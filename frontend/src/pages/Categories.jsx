import { Link } from "react-router-dom";
import "./Home.css";
import { ServiceBannerWidget, CreateTopicButton }  from "../components/sidebar/Widgets";
import Sidebar from "../components/sidebar/Sidebar";
import { useCategories } from "../hooks/useCategories";

export default function Categories() {
  const { categoriesTree, loading, error } = useCategories();
  const categories = categoriesTree || [];

  return (
    <div className="home-container">
      <main className="main-content">
        <h1 className="page-title">Catégories</h1>

        {loading && <div className="state-message">Chargement des catégories…</div>}

        {error && <div className="state-message error">{error}</div>}

        {!loading && !error && categories.length === 0 && (
          <div className="state-message">Aucune catégorie disponible.</div>
        )}

        {!loading &&
          !error &&
          categories.map((cat) => (
            <div key={cat.id} className="topics-card" style={{ marginBottom: "2rem" }}>
              <div className="table-header">
                <Link to={`/categories/${cat.slug}`}>
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
