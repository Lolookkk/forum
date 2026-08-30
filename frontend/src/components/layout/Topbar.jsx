import { NavLink, useLocation, Link } from "react-router-dom";
import "./Topbar.css";
import { useAuth } from "../../hooks/useAuth";
import { useCategories } from "../../hooks/useCategories";
import { useSettings } from "../../hooks/useSettings";

export default function Topbar() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { categories, loading: ctxLoading, error: ctxError } = useCategories();
  const { settings } = useSettings();
  const forumName = settings?.forum_name || "Espace Sécurisé";

  const isHomeSection = ["/", "/announcements", "/members"].includes(location.pathname);
  const isCategoriesSection = location.pathname.startsWith("/categories");
  const isAdminSection = location.pathname.startsWith("/admin");

  const isLoading = isCategoriesSection && ctxLoading;
  const error = isCategoriesSection ? ctxError : null;

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <Link to="/" className="topbar-brand-link" aria-label={`Aller à l'accueil de ${forumName}`}>
          <span className="topbar-brand-flower" aria-hidden="true">🌻</span>
          <span className="topbar-brand-name">{forumName}</span>
        </Link>
      </div>

      <div className="topbar-subnav">
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

        {isCategoriesSection && (
          <>
            <NavLink to="/categories" end className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}>
              Toutes
            </NavLink>

            {isLoading && <span className="subnav-loading">Chargement…</span>}
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

        {isAdminSection && (
          <>
            <NavLink to="/admin" end className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}>
              Tableau de bord
            </NavLink>
            <NavLink to="/admin/categories" className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}>
              Gestion des catégories
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}>
              Utilisateurs
            </NavLink>
            <NavLink to="/admin/settings" className={({ isActive }) => `subnav-link ${isActive ? "active" : ""}`}>
              Paramètres
            </NavLink>
          </>
        )}
      </div>

      <div className="topbar-actions">
        <input type="search" placeholder="Rechercher un sujet…" className="search-input" />

        {isAuthenticated ? (
          <>
            <Link to={`/profile/${user?.username}`}>
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
