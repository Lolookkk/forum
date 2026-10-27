import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getCharter, updateCharter } from "../services/adminsettingsService";

export default function CharterForm() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCharter()
      .then((data) => setContent(data?.content || ""))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await updateCharter(content, token);
      navigate("/charter");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <p className="state-message">Chargement de la charte...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Modifier la charte</h1>

      <div className="form-card">
        <div className="form-header form-header--sage">
          <span>Contenu de la charte</span>
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
                placeholder="# Règles de la communauté&#10;&#10;Rédigez la charte du forum en Markdown..."
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/charter")}
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
