import "./TopicMainPost.css";

export default function TopicMainPost({ topic }) {
  if (!topic) return null;

  return (
    <article className="topic-main-card">
      <header className="topic-header">
        <h1 className="topic-title">{topic.title}</h1>
        <div className="topic-meta">
          <span className="topic-author">
            Par <strong>{topic.author || "Anonyme"}</strong>
          </span>
          <span className="topic-separator">•</span>
          <time className="topic-date">
            {topic.created_at
              ? new Date(topic.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Date inconnue"}
          </time>
        </div>
      </header>

      <div className="topic-content">
        {topic.content}
      </div>
    </article>
  );
}