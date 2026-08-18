import { NavLink } from "react-router-dom";
import "./LeftNav.css";

export default function LeftNav() {
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
      </nav>
    </aside>
  );
}