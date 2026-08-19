

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Encadré d'information / Promotion */}
      <div className="sidebar-banner">
        <h3>SERVICE :</h3>
        <p>DÉCOUVREZ NOS ATELIERS DE BIEN-ÊTRE MENTAL</p>
        <span className="banner-icon">🌻</span>
      </div>

      {/* Bloc Statistiques */}
      <div className="sidebar-card">
        <div className="card-header">
          <h3>STATISTIQUES</h3>
          <span>📊</span>
        </div>
        <div className="stat-item">
          <span>Membres</span>
          <strong>16 673</strong>
        </div>
        <div className="stat-item">
          <span>Sujets</span>
          <strong>234</strong>
        </div>
        <div className="stat-item">
          <span>Messages</span>
          <strong>1 819</strong>
        </div>
        <div className="stat-item">
          <span>Utilisateurs en ligne</span>
          <strong>0</strong>
        </div>
      </div>

      {/* Bloc Nouveaux Membres */}
      <div className="sidebar-card">
        <h3>NOUVEAUX MEMBRES</h3>
      </div>


      {/* Bouton de création */}
      <button className="btn-create-topic">
        ✏️ CRÉER UN NOUVEAU SUJET
      </button>
    </aside>
  );
}