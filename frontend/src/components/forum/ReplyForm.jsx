import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { createPost } from "../../services/postService";
import "./ReplyForm.css";

export default function ReplyForm({ topicId, onReplyAdded }) { // 👈 Prop ajoutée
  const { token } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createPost(topicId, content, token);
      setContent("");
      if (onReplyAdded) onReplyAdded(); // 👈 Notifie le parent qu'il faut rafraîchir les réponses
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="reply-form" onSubmit={handleSubmit}>
      <h3 className="reply-form-title">Laisser une réponse</h3>

      {error && <div className="form-error form-error--inline">{error}</div>}

      <div className="reply-form-body">
        <textarea
          className="reply-form-textarea"
          rows="4"
          placeholder="Écris ta réponse ici..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
          required
        />
      </div>

      <div className="reply-form-footer">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !content.trim()}
        >
          {submitting ? "Envoi..." : "Publier la réponse"}
        </button>
      </div>
    </form>
  );
}