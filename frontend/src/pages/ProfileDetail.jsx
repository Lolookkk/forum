import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile } from "../services/userService";
import ActivityRow from "../components/forum/ActivityRow";
import "./ProfileDetail.css";

export default function ProfileDetail() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPublicProfile(username)
      .then((user) => {
        if (!user) {
          setError("Utilisateur non trouvé.");
        } else {
          setProfile(user);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <p className="state-message">Chargement du profil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="page-wrapper">
        <div className="form-error form-error--inline">
          {error || "Profil introuvable."}
        </div>
      </div>
    );
  }

  const joinedDate = new Date(profile.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalContributions = Number(profile.topics_count) + Number(profile.posts_count);

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Profil de {profile.username}</h1>

      {/* 1. Grille avec les 2 cartes du haut */}
      <div className="profile-grid">
        {/* Informations du membre */}
        <div className="form-card">
          <div className="form-header form-header--sage">
            <span>À propos du membre</span>
          </div>
          <div className="form-body">
            <div className="profile-field">
              <span className="profile-field-label">Rôle</span>
              <p className="profile-field-value profile-field-value--highlight">
                {profile.role}
              </p>
            </div>

            <div className="profile-field">
              <span className="profile-field-label">Membre depuis</span>
              <p className="profile-field-value">{joinedDate}</p>
            </div>

            <div className="profile-field">
              <span className="profile-field-label">Bio</span>
              <p className="profile-field-value">
                {profile.description || "Aucune description renseignée."}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques d'activité */}
        <div className="form-card">
          <div className="form-header form-header--yellow">
            <span>Activité du membre</span>
          </div>
          <div className="form-body">
            <div className="profile-stats-grid">
              <div className="profile-stat-box">
                <span className="profile-stat-number">{profile.topics_count}</span>
                <span className="profile-stat-label">Sujets créés</span>
              </div>

              <div className="profile-stat-box">
                <span className="profile-stat-number">{profile.posts_count}</span>
                <span className="profile-stat-label">Réponses publiées</span>
              </div>
            </div>

            <div className="profile-stat-total">
              <span className="profile-stat-label">Total des contributions</span>
              <p className="profile-stat-total-number">{totalContributions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Carte des publications (placée sous la grille) */}
      <div className="form-card" style={{ marginTop: "32px" }}>
        <div className="form-header form-header--beige">
          <span>Historique des publications</span>
        </div>
        <div className="form-body">
          {profile.activity && profile.activity.length > 0 ? (
            profile.activity.map((publication) => (
              <ActivityRow
                key={`${publication.type}-${publication.activity_id}`}
                publication={publication}
              />
            ))
          ) : (
            <p className="state-message">Aucune activité pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}