import { useState } from "react";
import "./ReplyForm.css";

export default function ReplyForm({ topicId, onReplyAdded }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_id: topicId,
          content: content.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de l'envoi de la réponse.");
      }

      setContent("");
      if (onReplyAdded) {
        onReplyAdded(result.post || result.data || result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="reply-form" onSubmit={handleSubmit}>
      <h3 className="reply-form-title">Laisser une réponse</h3>

      {error && <div className="reply-form-error">{error}</div>}

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
          className="reply-form-submit"
          disabled={submitting || !content.trim()}
        >
          {submitting ? "Envoi..." : "Publier la réponse"}
        </button>
      </div>
    </form>
  );
}