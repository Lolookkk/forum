import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { createAnnounce } from "../../services/announcementService";
import "./AdminAddAnnounces.css";

export default function AdminAddAnnonce({ onAnnounceAdded }) {
  const { user, token } = useAuth();

  const isAdmin = user?.role === "admin";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isAdmin) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createAnnounce(title, content, token);
      setTitle("");
      setContent("");
      if (onAnnounceAdded) onAnnounceAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="announce-card">
      <h2 className="announce-title">Créer une annonce</h2>
      {error && <div className="announce-error">{error}</div>}

      <form onSubmit={handleSubmit} className="announce-form">
        <div className="announce-form-group">
          <label>Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="announce-form-group">
          <label>Contenu</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="4"
          />
        </div>

        <button type="submit" className="announce-submit" disabled={submitting}>
          {submitting ? "Création..." : "Publier l'annonce"}
        </button>
      </form>
    </div>
  );
}