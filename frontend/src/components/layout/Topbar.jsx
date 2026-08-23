import { useEffect, useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import "./Topbar.css";
import { getCategories } from "../../services/categoryService";
import { useAuth } from "../../hooks/useAuth";

export default function Topbar() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const isHomeSection = ["/", "/announcements", "/members"].includes(location.pathname);
  const isCategoriesSection = location.pathname.startsWith("/categories");

  // État dérivé : on est en chargement si on est sur la section catégories, 
  // qu'on n'a pas encore de données et qu'aucune erreur n'est survenue.
  const isLoading = isCategoriesSection && categories.length === 0 && !error;

  useEffect(() => {
    let isMounted = true;

    if (isCategoriesSection && categories.length === 0 && !error) {
      getCategories()
        .then((data) => {
          if (isMounted) {
            setCategories(Array.isArray(data) ? data : []);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message);
          }
        });
    }

    return () => {
      isMounted = false; // Nettoyage en cas de démontage du composant pendant le fetch
    };
  }, [isCategoriesSection, categories.length, error]);

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

            {isLoading && <span className="subnav-loading">Chargement...</span>}
            {error && <span className="subnav-error">Erreur</span>}

            {!isLoading &&
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
        
        {isAuthenticated ? (
          <>
          <Link to >
            <div className="user-greeting">
              <div className="user-avatar" aria-hidden="true">
                {user?.username?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="user-greeting-text">
                <span className="user-greeting-label">Mon profil</span>
                <span className="user-greeting-name">{user?.username}</span>
              </div>
            </div>
          </Link>
            <button onClick={logout} className="btn btn-logout">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-login">
              Connexion
            </Link>
            <Link to="/register" className="btn btn-register">
              Inscription
            </Link>
          </>
        )}


      </div>
    </header>
  );
}