import "./ReplyCard.css";
import ReportModal from "../modals/ReportModal";
import EditPostModal from "../modals/EditPostModal";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

const formatForumDateTime = (value) => {
  if (!value) return "Date inconnue";

  return new Date(value).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const hasBeenEdited = (createdAt, updatedAt) => {
  if (!createdAt || !updatedAt) return false;
  return new Date(updatedAt).getTime() > new Date(createdAt).getTime();
};

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

    const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
    const diff = now - createdTime;

    return diff >= 0 && diff < FIFTEEN_MINUTES_IN_MS;
  };

  const canEdit = isAuthor && isEditableWithinWindow();
  const wasEdited = hasBeenEdited(reply?.created_at, reply?.updated_at);

  if (!reply) return null;

  return (
    <article className="reply-card">
      <header className="reply-header">
        <div className="reply-meta">
          <span className="reply-author">
            Par <strong>{reply.author || "Anonyme"}</strong>
          </span>
          <span className="reply-separator">•</span>
          <time className="reply-date" dateTime={reply.created_at}>
            Publié le {formatForumDateTime(reply.created_at)}
          </time>
          {wasEdited && (
            <>
              <span className="reply-separator">•</span>
              <time className="reply-date" dateTime={reply.updated_at}>
                Modifié le {formatForumDateTime(reply.updated_at)}
              </time>
            </>
          )}

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
