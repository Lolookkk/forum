import { NavLink } from "react-router-dom";
import "./LeftNav.css";
import { useAuth } from "../../hooks/useAuth"; 

export default function LeftNav() {
  const { user } = useAuth();
  return (
    <aside className="left-nav">

      <nav className="nav-menu">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          Accueil
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          Catégories
        </NavLink>
        <NavLink to="/events" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          Événements
        </NavLink>
        <NavLink to="/resources" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          Ressources
        </NavLink>
        {/* 3. Bouton visible uniquement pour les admins */}
        {user?.role === "admin" && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Admin
          </NavLink>
        )}
        {/* 3. Bouton visible uniquement pour les admins et modos*/}
        {user?.role === "admin" || user?.role === "moderator" ? (
          <NavLink to="/moderation" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Modération
          </NavLink>
        ) : null}
      </nav>
    </aside>
  );
}