import { useState } from "react";

export default function CensorModal({ report, onClose, onSubmit }) {
  const isTopic = Boolean(report.topic_id && !report.post_id);
  const target = report.targetData;

  const [newTitle, setNewTitle] = useState(target?.title || report.topic_title || "");
  const [newContent, setNewContent] = useState(
    target?.content || report.post_content || report.topic_content || "[Contenu censuré par la modération]"
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      newTitle: isTopic ? newTitle : undefined,
      newContent,
    });
    setLoading(false);
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-box form-card form-card--md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="form-header form-header--beige">
          Censurer {isTopic ? "le sujet" : "le message"}
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <p style={{ margin: "0 0 16px", color: "var(--color-text-muted, #666)", fontSize: "0.9rem" }}>
            Modifiez le contenu pour masquer les propos inappropriés.
          </p>

          {isTopic && (
            <div className="form-group">
              <label htmlFor="newTitle">Nouveau titre</label>
              <input
                type="text"
                id="newTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="newContent">Contenu modéré</label>
            <textarea
              id="newContent"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sage btn--fit"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-warning btn--fit"
              disabled={loading}
            >
              {loading ? "Application…" : "Valider la censure"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}