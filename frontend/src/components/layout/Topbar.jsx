import { Link, useLocation } from "react-router-dom";
import "./Topbar.css";

export default function Topbar() {
  const location = useLocation();

  return (
    <header className="topbar">
      <div className="topbar-subnav">
        {/* Onglets affichés si on est sur la page Accueil */}
        {location.pathname === "/" && (
          <>
            <Link to="/" className="subnav-link active">Vie du forum</Link>
            <Link to="/announcements" className="subnav-link">Annonces</Link>
            <Link to="/presentations" className="subnav-link">Présentations</Link>
          </>
        )}

        {/* Onglets affichés si on est sur la page Catégories */}
        {location.pathname.startsWith("/categories") && (
          <>
            <span className="topbar-title">Toutes les catégories</span>
          </>
        )}
      </div>

      {/* Partie droite : Recherche et Profil */}
      <div className="topbar-actions">
        <input type="search" placeholder="Rechercher un sujet..." className="search-input" />
        <button className="btn btn-login">Connexion</button>
        <button className="btn btn-register">Inscription</button>
      </div>
    </header>
  );
}