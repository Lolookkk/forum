import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { updatePost } from "../../services/postService";

export default function EditPostModal({ post, onClose, onUpdated }) {
  const { token } = useAuth();
  const [content, setContent] = useState(post?.content || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!post) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Le contenu ne peut pas être vide.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const updated = await updatePost(post.id, content.trim(), token);
      onUpdated?.(updated);
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
        className="admin-modal-box form-card form-card--md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="form-header form-header--sage">Modifier mon message</div>

        <form onSubmit={handleSubmit} className="form-body">
          <p
            style={{
              margin: "0 0 16px",
              color: "var(--color-text-muted, #666)",
              fontSize: "0.9rem",
            }}
          >
            Modifiez le contenu ci-dessous, puis enregistrez.
          </p>

          {error && <div className="form-error form-error--inline">{error}</div>}

          <div className="form-group">
            <label htmlFor="editContent">Contenu</label>
            <textarea
              id="editContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
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
