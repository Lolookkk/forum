import { useState } from "react";
import { useAuth } from "../../hooks/useAuth"; // Ajuste le chemin si besoin
import { reportPost, reportTopic } from "../../services/reportService";

export default function ReportModal({ postId, topicId, onClose }) {
  const { token } = useAuth();
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Détection automatique : Sujet ou Message
  const isTopic = Boolean(topicId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError("Veuillez préciser la raison du signalement.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isTopic) {
        await reportTopic(topicId, reason, token);
      } else {
        await reportPost(postId, reason, token);
      }
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "Erreur lors du signalement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-box form-card form-card--md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête beige comme dans la gestion des catégories */}
        <div className="form-header form-header--beige">
          {isTopic ? "Signaler le sujet" : "Signaler le message"}
        </div>

        {error && <div className="form-error form-error--inline" style={{ margin: "20px 28px 0" }}>{error}</div>}

        {success ? (
          <div className="form-body">
            <p style={{ color: "var(--color-accent-sage)", fontWeight: "var(--fw-bold)", textAlign: "center", margin: "12px 0" }}>
              {isTopic ? "Sujet" : "Message"} signalé à l'équipe de modération.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-body">
            <div className="form-group">
              <label htmlFor="report-reason">Raison du signalement</label>
              <textarea
                id="report-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Décrivez le problème (spam, insultes, contenu inapproprié...)"
                rows="4"
                required
              />
            </div>

            {/* Boutons identiques à ta modale de catégories */}
            <div className="modal-buttons">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sage btn--fit"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || !reason.trim()}
                className="btn btn-primary btn--fit"
              >
                {loading ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}