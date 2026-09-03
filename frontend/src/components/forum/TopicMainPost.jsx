import "./TopicMainPost.css";
import {
  formatForumDateTime,
  hasBeenEdited,
} from "../../utils/dateUtils";

export default function TopicMainPost({ topic, canEdit, onEdit }) {
  if (!topic) return null;

  const wasEdited = hasBeenEdited(topic.created_at, topic.updated_at);

  return (
    <article className="topic-main-card">
      <header className="topic-header">
        <h1 className="topic-title">{topic.title}</h1>
        <div className="topic-meta">
          <span className="topic-author">
            Par <strong>{topic.author || "Anonyme"}</strong>
          </span>
          <span className="topic-separator">•</span>
          <time className="topic-date" dateTime={topic.created_at}>
            Publié le {formatForumDateTime(topic.created_at)}
          </time>
          {wasEdited && (
            <>
              <span className="topic-separator">•</span>
              <time className="topic-date" dateTime={topic.updated_at}>
                Modifié le {formatForumDateTime(topic.updated_at)}
              </time>
            </>
          )}
          {canEdit && (
            <button className="btn-edit-link" onClick={onEdit}>
              ✏️ Modifier
            </button>
          )}
        </div>
      </header>

      <div className="topic-content">{topic.content}</div>
    </article>
  );
}
