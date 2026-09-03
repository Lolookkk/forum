import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicProfile, updateOwnProfile } from "../services/userService";
import ActivityRow from "../components/forum/ActivityRow";
import { useAuth } from "../hooks/useAuth";
import "./ProfileDetail.css";
import { formatForumDate } from "../utils/dateUtils";

export default function ProfileDetail() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, token, updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastLoadedUsername, setLastLoadedUsername] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [draftUsername, setDraftUsername] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [lastProfileVersion, setLastProfileVersion] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (lastLoadedUsername !== username) {
    setLastLoadedUsername(username);
    setLoading(true);
    setError(null);
    setIsEditing(false);
    setSubmitError(null);
    setSuccessMessage(null);
  }

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

  if (
    profile &&
    (!lastProfileVersion ||
      lastProfileVersion.username !== profile.username ||
      lastProfileVersion.description !== profile.description)
  ) {
    setDraftUsername(profile.username || "");
    setDraftDescription(profile.description || "");
    setLastProfileVersion({
      username: profile.username,
      description: profile.description,
    });
  }

  const isOwnProfile =
    !!currentUser &&
    currentUser.username &&
    profile?.username &&
    currentUser.username === profile.username;

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

  const joinedDate = formatForumDate(profile.created_at);

  const totalContributions = Number(profile.topics_count) + Number(profile.posts_count);

  const cancelEdit = () => {
    setDraftUsername(profile.username || "");
    setDraftDescription(profile.description || "");
    setIsEditing(false);
    setSubmitError(null);
    setSuccessMessage(null);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    if (!draftUsername.trim()) {
      setSubmitError("Le nom d'utilisateur ne peut pas être vide.");
      return;
    }

    setSubmitting(true);
    try {
      const updatedUser = await updateOwnProfile(
        {
          username: draftUsername.trim(),
          description: draftDescription,
        },
        token
      );

      updateUser({
        username: updatedUser.username,
        description: updatedUser.description,
      });

      setSuccessMessage("Profil mis à jour avec succès.");
      setIsEditing(false);

      if (updatedUser.username !== profile.username) {
        setProfile((prev) => ({
          ...prev,
          username: updatedUser.username,
          description: updatedUser.description ?? prev.description,
        }));
        navigate(`/profile/${encodeURIComponent(updatedUser.username)}`, {
          replace: true,
        });
      } else {
        setProfile((prev) => ({
          ...prev,
          username: updatedUser.username,
          description: updatedUser.description ?? prev.description,
        }));
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Profil de {profile.username}</h1>

      <div className="profile-grid">
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

            {!isEditing ? (
              <>
                <div className="profile-field">
                  <span className="profile-field-label">Nom d'utilisateur</span>
                  <p className="profile-field-value">{profile.username}</p>
                </div>

                <div className="profile-field">
                  <span className="profile-field-label">Bio</span>
                  <p className="profile-field-value">
                    {profile.description || "Aucune description renseignée."}
                  </p>
                </div>

                {isOwnProfile && (
                  <div style={{ marginTop: "12px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setSubmitError(null);
                        setSuccessMessage(null);
                      }}
                      className="btn btn-primary btn--fit"
                    >
                      ✏️ Modifier mon profil
                    </button>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={submitEdit}>
                {successMessage && (
                  <div className="status-success">{successMessage}</div>
                )}
                {submitError && (
                  <div className="form-error form-error--inline">{submitError}</div>
                )}

                <div className="form-group">
                  <label htmlFor="editUsername">Nom d'utilisateur</label>
                  <input
                    id="editUsername"
                    type="text"
                    value={draftUsername}
                    onChange={(e) => setDraftUsername(e.target.value)}
                    maxLength={32}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editDescription">Bio</label>
                  <textarea
                    id="editDescription"
                    rows={5}
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                    placeholder="Parlez de vous..."
                  />
                </div>

                <div className="settings-actions">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="btn btn-sage btn--fit"
                    disabled={submitting}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn--fit"
                    disabled={submitting}
                  >
                    {submitting ? "Enregistrement…" : "Enregistrer"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

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
