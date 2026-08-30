import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../hooks/useSettings";
import { getSettings } from "../services/adminsettingsService";
import "./AdminSettings.css";

export default function AdminSettings() {
  const { token } = useAuth();
  const { settings, loading: ctxLoading, error: ctxError, saveSettings, refreshSettings } =
    useSettings();

  const [formData, setFormData] = useState(settings);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...settings,
    }));
  }, [settings]);

  useEffect(() => {
    if (!ctxLoading) return;
    getSettings()
      .then((data) => {
        if (data) setFormData(data);
      })
      .catch(() => {});
  }, [ctxLoading]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSubmitting(true);

    try {
      await saveSettings(formData, token);
      setMessage("Paramètres mis à jour avec succès !");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (ctxLoading && !formData?.forum_name) {
    return <div className="admin-status">Chargement des paramètres…</div>;
  }

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Paramètres généraux</h1>

      <div className="form-card form-card--md form-card--center">
        <div className="form-header form-header--yellow">Configuration du forum</div>

        <form onSubmit={handleSubmit} className="form-body">
          {message && <div className="status-success">{message}</div>}
          {error && <div className="form-error form-error--inline">{error}</div>}
          {ctxError && !error && (
            <div className="form-error form-error--inline">{ctxError}</div>
          )}

          {/* Nom du forum */}
          <div className="form-group">
            <label htmlFor="forum_name">Nom du forum</label>
            <input
              type="text"
              id="forum_name"
              name="forum_name"
              value={formData.forum_name || ""}
              onChange={handleChange}
              required
              maxLength={60}
            />
          </div>

          {/* Sujets par page */}
          <div className="form-group">
            <label htmlFor="topics_per_page">Sujets affichés par page</label>
            <input
              type="number"
              id="topics_per_page"
              name="topics_per_page"
              min="1"
              max="100"
              value={formData.topics_per_page ?? 10}
              onChange={handleChange}
              required
            />
          </div>

          {/* Interrupteur : Inscriptions ouvertes */}
          <div className="setting-toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                name="registration_open"
                checked={Boolean(formData.registration_open)}
                onChange={handleChange}
              />
              <span>
                <strong>Autoriser les nouvelles inscriptions</strong>
                <small>Désactiver cette option empêche toute création de compte.</small>
              </span>
            </label>
          </div>

          {/* Interrupteur : Mode maintenance */}
          <div className="setting-toggle-group">
            <label className="toggle-label toggle-danger">
              <input
                type="checkbox"
                name="maintenance_mode"
                checked={Boolean(formData.maintenance_mode)}
                onChange={handleChange}
              />
              <span>
                <strong>Activer le mode maintenance</strong>
                <small>
                  Affiche un bandeau global et masque le contenu aux utilisateurs non
                  administrateurs.
                </small>
              </span>
            </label>
          </div>

          <div className="settings-actions">
            <button
              type="button"
              onClick={() => {
                setMessage(null);
                setError(null);
                refreshSettings();
              }}
              className="btn btn-sage btn--fit"
              disabled={submitting}
            >
              Annuler / Réactualiser
            </button>
            <button
              type="submit"
              className="btn btn-primary btn--fit"
              disabled={submitting}
            >
              {submitting ? "Enregistrement…" : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
