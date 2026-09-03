import "./ReplyCard.css";
import ReportModal from "../modals/ReportModal";
import EditPostModal from "../modals/EditPostModal";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  formatForumDateTime,
  hasBeenEdited,
  isEditableWithinWindow,
  isSameUser,
} from "../../utils/dateUtils";

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

  const isAuthor = isSameUser(user, reply);
  const canEdit = isAuthor && isEditableWithinWindow(reply?.created_at, now);
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
