import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { updateTopic } from "../../services/topicService";

export default function EditTopicModal({ topic, onClose, onUpdated }) {
  const { token } = useAuth();
  const [title, setTitle] = useState(topic?.title || "");
  const [content, setContent] = useState(topic?.content || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!topic) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Le titre et le contenu sont requis.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const updatedTopic = await updateTopic(
        topic.id,
        {
          title: title.trim(),
          content: content.trim(),
        },
        token,
      );
      onUpdated?.(updatedTopic);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-box form-card form-card--lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="form-header form-header--yellow">Modifier mon sujet</div>

        <form onSubmit={handleSubmit} className="form-body">
          <p
            style={{
              margin: "0 0 16px",
              color: "var(--color-text-muted)",
              fontSize: "0.9rem",
            }}
          >
            Vous pouvez modifier votre sujet tant qu&apos;il a moins de 15 minutes
            et qu&apos;il n&apos;a pas encore de réponse.
          </p>

          {error && <div className="form-error form-error--inline">{error}</div>}

          <div className="form-group">
            <label htmlFor="editTopicTitle">Titre</label>
            <input
              id="editTopicTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editTopicContent">Contenu</label>
            <textarea
              id="editTopicContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              required
            />
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              onClick={onClose}
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
      </div>
    </div>
  );
}
