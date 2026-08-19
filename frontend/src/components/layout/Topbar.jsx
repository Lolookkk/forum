import { NavLink, useLocation } from "react-router-dom";
import "./Topbar.css";

export default function Topbar() {
  const location = useLocation();
  // Les routes qui partagent les onglets de l'accueil
  const isHomeSection = ["/", "/announcements", "/members"].includes(location.pathname);

  return (
    <header className="topbar">
      <div className="topbar-subnav">
        {/* Onglets affichés si on est sur la page Accueil */}
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

        {/* Onglets affichés si on est sur la page Events */}
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

        {/* Onglets affichés si on est sur la page Ressources */}
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

      {/* Partie droite : Recherche et Profil */}
      <div className="topbar-actions">
        <input type="search" placeholder="Rechercher un sujet..." className="search-input" />
        <button className="btn btn-login">Connexion</button>
        <button className="btn btn-register">Inscription</button>
      </div>
    </header>
  );
}