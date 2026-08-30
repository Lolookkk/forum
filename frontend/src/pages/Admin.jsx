import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAdminDashboardData } from "../services/adminDashboardService";
import "./Admin.css";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAdminDashboardData(token)
      .then((data) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="admin-status">Chargement du tableau de bord…</div>;
  if (error) return <div className="form-error">{error}</div>;
  if (!stats) return <div className="admin-status">Aucune statistique disponible.</div>;

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Tableau de bord Administration</h1>

      {/* Cartes statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Membres inscrits</span>
          <span className="stat-value">{stats.total_users ?? 0}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Sujets publiés</span>
          <span className="stat-value">{stats.total_topics ?? 0}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Réponses au total</span>
          <span className="stat-value">{stats.total_posts ?? 0}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Statut du site</span>
          <span className={`stat-badge ${stats.maintenance_mode ? "badge-warning" : "badge-success"}`}>
            {stats.maintenance_mode ? "Maintenance" : "En ligne"}
          </span>
        </div>
      </div>

      {/* Raccourcis rapides */}
      <div className="dashboard-card">
        <h2>Actions rapides</h2>
        <div className="quick-links">
          <Link to="/admin/settings" className="btn btn-secondary">
            ⚙️ Paramètres du forum
          </Link>
          <Link to="/admin/users" className="btn btn-secondary">
            👥 Gérer les membres
          </Link>
        </div>
      </div>
    </div>
  );
}