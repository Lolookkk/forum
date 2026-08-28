import { Link } from "react-router-dom";
import "./Widgets.css";

// Encadré Promo / Service
export function ServiceBannerWidget({ title, description, icon = "🌻" }) {
  return (
    <div className="sidebar-banner">
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="banner-icon">{icon}</span>
    </div>
  );
}

// Bloc Statistiques
export function StatsWidget({ stats }) {
  return (
    <div className="sidebar-card">
      <div className="card-header">
        <h3>STATISTIQUES</h3>
        <span>📊</span>
      </div>
      <div className="stat-item">
        <span>Membres</span>
        <strong>{stats?.members ?? 0}</strong>
      </div>
      <div className="stat-item">
        <span>Sujets</span>
        <strong>{stats?.topics ?? 0}</strong>
      </div>
      <div className="stat-item">
        <span>Messages</span>
        <strong>{stats?.posts ?? 0}</strong>
      </div>
      <div className="stat-item">
        <span>Utilisateurs en ligne</span>
        <strong>{stats?.online ?? 0}</strong>
      </div>
    </div>
  );
}

// Bloc Nouveaux Membres
export function NewMembersWidget({ members = [] }) {
  return (
    <div className="sidebar-card">
      <div className="card-header">
        <h3>NOUVEAUX MEMBRES</h3>
        <span>👋</span>
      </div>
      {members.length === 0 ? (
        <p className="stat-item">Aucun nouveau membre</p>
      ) : (
        members.map((member) => (
          <div key={member.id} className="stat-item">
            <span>{member.username}</span>
          </div>
        ))
      )}
    </div>
  );
}

// Bouton Créer un sujet
export function CreateTopicButton() {
  const target = "/topics/new";
  
  return (
    <Link to={target} className="btn-create-topic text-center block">
      ✏️ CRÉER UN NOUVEAU SUJET
    </Link>
  );
}

// NOUVEAU : Bloc Règles (Pour la page Catégorie)
export function CategoryRulesWidget({ categoryName }) {
  return (
    <div className="sidebar-card">
      <div className="card-header">
        <h3>CHARTE DE LA SECTION</h3>
        <span>📜</span>
      </div>
      <p className="stat-item" style={{ flexDirection: "column", gap: "6px" }}>
        <span>En publiant dans <strong>{categoryName}</strong>, veillez à rester bienveillant et à respecter les règles du forum.</span>
      </p>
    </div>
  );
}

// NOUVEAU : Bloc Info Discussion (Pour la page Topic)
export function TopicInfoWidget({ authorName, createdAt, viewsCount }) {
  return (
    <div className="sidebar-card">
      <div className="card-header">
        <h3>À PROPOS DU SUJET</h3>
        <span>ℹ️</span>
      </div>
      <div className="stat-item">
        <span>Auteur</span>
        <strong>{authorName}</strong>
      </div>
      <div className="stat-item">
        <span>Créé le</span>
        <strong>{createdAt}</strong>
      </div>
      <div className="stat-item">
        <span>Vues</span>
        <strong>{viewsCount}</strong>
      </div>
    </div>
  );
}