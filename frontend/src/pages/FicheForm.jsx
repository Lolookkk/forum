import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createFiche,
  getFicheBySlug,
  updateTitleFiche,
  updateDescriptionFiche,
  updateContentFiche,
} from "../services/ficheService";
import { useAuth } from "../hooks/useAuth";

export default function FicheForm() {
  const { slug } = useParams();
  const isEditMode = Boolean(slug);
  const navigate = useNavigate();
  const { token } = useAuth();

  const [ficheId, setFicheId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    icon: "file-text",
    icon_color: "#3B6978",
    content: "",
  });

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
  if (!isEditMode) return;

  let ignore = false;

  getFicheBySlug(slug)
    .then((data) => {
      if (ignore) return;
      setFicheId(data.id);
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        description: data.description || "",
        icon: data.icon || "file-text",
        icon_color: data.icon_color || "#3B6978",
        content: data.content || "",
      });
    })
    .catch((err) => {
      if (!ignore) setError(err.message);
    })
    .finally(() => {
      if (!ignore) setLoading(false);
    });

  return () => {
    ignore = true;
  };
}, [slug, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEditMode) {
        await Promise.all([
          updateTitleFiche(ficheId, formData.title, token),
          updateDescriptionFiche(ficheId, formData.description, token),
          updateContentFiche(ficheId, formData.content, token),
        ]);
        navigate(`/resources/${formData.slug}`);
      } else {
        const newFiche = await createFiche(formData, token);
        navigate(`/resources/${newFiche.slug || formData.slug}`);
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.title) {
    return <div className="loading-state">Chargement de la fiche...</div>;
  }

  return (
    <div className="fiche-form-container">
      <div className="fiche-form-header">
        <h1>{isEditMode ? "Modifier la fiche" : "Créer une nouvelle fiche"}</h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-cancel-top"
        >
          ← Annuler
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="fiche-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="title">Titre de la fiche *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="ex: Comprendre l'anxiété"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">Slug (URL)</label>
            <input
              id="slug"
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="comprendre-anxiete (auto-généré si vide)"
              disabled={isEditMode}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description courte</label>
            <input
              id="description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Un résumé rapide qui apparaîtra sur la carte..."
            />
          </div>

          {!isEditMode && (
            <>
              <div className="form-group">
                <label htmlFor="icon">Nom de l'icône</label>
                <input
                  id="icon"
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="ex: book, heart, shield"
                />
              </div>

              <div className="form-group">
                <label htmlFor="icon_color">Couleur de l'icône</label>
                <div className="color-picker-group">
                  <input
                    type="color"
                    name="icon_color"
                    value={formData.icon_color}
                    onChange={handleChange}
                  />
                  <input
                    id="icon_color"
                    type="text"
                    name="icon_color"
                    value={formData.icon_color}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="form-section">
          <div className="form-group full-width">
            <label htmlFor="content">Contenu Markdown *</label>
            <textarea
              id="content"
              name="content"
              rows={16}
              value={formData.content}
              onChange={handleChange}
              placeholder="# Votre titre&#10;&#10;Écrivez le contenu en Markdown ici..."
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading
              ? "Enregistrement..."
              : isEditMode
              ? "Enregistrer les modifications"
              : "Publier la fiche"}
          </button>
        </div>
      </form>
    </div>
  );
}