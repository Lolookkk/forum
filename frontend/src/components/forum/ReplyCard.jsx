
import "./ReplyCard.css";

export default function ReplyCard({ reply }) {
  if (!reply) return null;

  return (
    <article className="reply-card">
      <header className="reply-header">
        <div className="reply-meta">
          <span className="reply-author">
            Par <strong>{reply.author || "Anonyme"}</strong>
          </span>
          <span className="reply-separator">•</span>
          <time className="reply-date">
            {reply.created_at
              ? new Date(reply.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Date inconnue"}
          </time>
        </div>
      </header>

      <div className="reply-content">
        {reply.content}
      </div>
    </article>
  );
}