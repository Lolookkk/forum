import "./ReplyCard.css";
import ReportModal from "../modals/ReportModal";
import EditPostModal from "../modals/EditPostModal";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function ReplyCard({ reply, onPostUpdated }) {
  const { user } = useAuth();
  const isUser = !!user;
  const [showReportModal, setShowReportModal] = useState(false);
  const [editOwnPostModal, setEditOwnPostModal] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const isAuthor = Boolean(
    user &&
      reply &&
      ((user.id != null &&
        reply.user_id != null &&
        String(user.id) === String(reply.user_id)) ||
        (user.username &&
          reply.author &&
          String(user.username).toLowerCase() ===
            String(reply.author).toLowerCase()))
  );

  const isEditableWithinWindow = () => {
    if (!reply?.created_at) return false;

    let createdDate = reply.created_at;
    if (typeof createdDate === "string") {
      createdDate = createdDate.replace(" ", "T");
      if (!/Z|[+-]\d{2}:\d{2}$/.test(createdDate)) {
        createdDate += "Z";
      }
    }

    const createdTime = new Date(createdDate).getTime();
    if (isNaN(createdTime)) return false;

    const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;
    const diff = now - createdTime;

    return diff >= 0 && diff < TWENTY_FOUR_HOURS_IN_MS;
  };

  const canEdit = isAuthor && isEditableWithinWindow();

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

          {isUser && (
            <button
              className="btn-report-link"
              onClick={() => setShowReportModal(true)}
            >
              🚩 Signaler
            </button>
          )}

          {canEdit && (
            <button
              className="btn-edit-link"
              onClick={() => setEditOwnPostModal(true)}
            >
              ✏️ Modifier
            </button>
          )}
        </div>
      </header>

      <div className="reply-content">{reply.content}</div>

      {showReportModal && (
        <ReportModal postId={reply.id} onClose={() => setShowReportModal(false)} />
      )}

      {editOwnPostModal && (
        <EditPostModal
          post={reply}
          onClose={() => setEditOwnPostModal(false)}
          onUpdated={(updatedPost) => onPostUpdated?.(updatedPost)}
        />
      )}
    </article>
  );
}
