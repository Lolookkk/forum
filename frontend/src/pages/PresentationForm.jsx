import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getPresentation, updatePresentation } from "../services/adminsettingsService";

export default function PresentationForm() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPresentation()
      .then((data) => setContent(data?.content || ""))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await updatePresentation(content, token);
      navigate("/presentation");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <p className="state-message">Chargement de la présentation...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Modifier la présentation</h1>

      <div className="form-card">
        <div className="form-header form-header--sage">
          <span>Contenu de la présentation</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-body">
            {error && <div className="form-error form-error--inline">{error}</div>}

            <div className="form-group">
              <label htmlFor="content">Contenu (Markdown)</label>
              <textarea
                id="content"
                name="content"
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Titre&#10;&#10;Écrivez la présentation du forum en Markdown..."
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/presentation")}
                className="btn btn-secondary btn--fit"
                disabled={saving}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary btn--fit"
                disabled={saving}
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
