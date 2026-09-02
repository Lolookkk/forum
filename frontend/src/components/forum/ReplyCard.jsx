
import "./ReplyCard.css";
import ReportModal from "../modals/ReportModal";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function ReplyCard({ reply }) {
  const { user } = useAuth();
  const isUser = !!user;
  // État local pour ouvrir/fermer la modale de signalement de CE message
  const [showReportModal, setShowReportModal] = useState(false);

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
          {/* Bouton pour signaler CE message spécifique */}
        {isUser && (
          <button 
            className="btn-report-link" 
            onClick={() => setShowReportModal(true)}
          >
            🚩 Signaler
          </button>
        )}
        </div>
      </header>

      <div className="reply-content">
        {reply.content}
      </div>

        {/* Modale de signalement déclenchée avec postId */}
      {showReportModal && (
        <ReportModal 
          postId={reply.id} 
          onClose={() => setShowReportModal(false)} 
        />
      )}

    </article>
  );
}