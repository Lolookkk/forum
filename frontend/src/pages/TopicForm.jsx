import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCategories } from "../hooks/useCategories";
import { createTopic } from "../services/topicService";

export default function TopicForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultSubCategory = searchParams.get("subcategory") || "";

  const { token } = useAuth();
  const { forumCategories, loading: ctxLoading } = useCategories();

  const [title, setTitle] = useState("");
  const [subCategoryId, setSubCategoryId] = useState(defaultSubCategory);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!defaultSubCategory) return;
    setSubCategoryId(defaultSubCategory);
  }, [defaultSubCategory]);

  useEffect(() => {
    if (!ctxLoading) setHydrated(true);
  }, [ctxLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const newTopic = await createTopic(
        { subcategory_id: subCategoryId, title, content },
        token
      );
      navigate(`/topics/${newTopic.slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="page-title">Créer un nouveau sujet</h1>

      {error && <p className="form-error form-error--inline mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="form-card form-card--md form-card--center">
        <div className="form-header form-header--sage">Nouveau sujet</div>
        <div className="form-body">
          <div className="form-group">
            <label>Titre du sujet *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Comment gérer l'anxiété au quotidien ?"
              required
            />
          </div>

          <div className="form-group">
            <label>Sous-catégorie *</label>
            <select
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              required
              disabled={ctxLoading && !hydrated}
            >
              <option value="">-- Choisir une sous-catégorie --</option>
              {forumCategories.map((cat) => (
                <optgroup key={cat.id} label={cat.name}>
                  {cat.subcategories?.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              rows="6"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Exprimez-vous ici…"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-sage btn--fit"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn--fit"
            >
              {submitting ? "Publication…" : "Publier le sujet"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
