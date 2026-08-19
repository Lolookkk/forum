import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Topbar.css";
import { getCategories } from "../../services/categoryService";

export default function Topbar() {
  const location = useLocation();
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isHomeSection = ["/", "/announcements", "/members"].includes(location.pathname);
  const isCategoriesSection = location.pathname.startsWith("/categories");

  useEffect(() => {
    // Exécute l'appel API uniquement sur la section catégories et si on n'a pas encore de données
    if (isCategoriesSection && categories == null) {
      getCategories()
        .then((data) => {
          setCategories(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [isCategoriesSection, categories]);

  return (
    <header className="topbar">
      <div className="topbar-subnav">
        {/* Onglets Accueil */}
        {isHomeSection && (
          <>
            <NavLink to="/" end className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}>
              Vie du forum
            </NavLink>
            <NavLink to="/announcements" className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}>
              Annonces
            </NavLink>
            <NavLink to="/members" className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}>
              Membres
            </NavLink>
          </>
        )}

        {/* Onglets Catégories dynamiques */}
        {isCategoriesSection && (
          <>
            <NavLink to="/categories" end className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}>
              Toutes
            </NavLink>

            {loading && <span className="subnav-loading">Chargement...</span>}
            {error && <span className="subnav-error">Erreur</span>}

            {!loading &&
              !error &&
              categories.map((cat) => (
                <NavLink
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}
                >
                  {cat.name}
                </NavLink>
              ))}
          </>
        )}

        {/* Onglets Événements */}
        {location.pathname.startsWith("/events") && (
          <>
            <NavLink to="/events" end className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}>
              À venir
            </NavLink>
            <NavLink to="/events/past" className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}>
              Passés
            </NavLink>
          </>
        )}

        {/* Onglets Ressources */}
        {location.pathname.startsWith("/resources") && (
          <>
            <NavLink to="/resources" end className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}>
              Fiches pratiques
            </NavLink>
            <NavLink to="/resources/numbers" className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}>
              Numéros utiles
            </NavLink>
          </>
        )}
      </div>

      <div className="topbar-actions">
        <input type="search" placeholder="Rechercher un sujet..." className="search-input" />
        <button className="btn btn-login">Connexion</button>
        <button className="btn btn-register">Inscription</button>
      </div>
    </header>
  );
}