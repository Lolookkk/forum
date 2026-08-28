import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createTopic } from "../services/topicService";
import { getForumCategories } from "../services/categoryService";

export default function TopicForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultSubCategory = searchParams.get("subcategory") || "";

  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [subCategoryId, setSubCategoryId] = useState(defaultSubCategory);
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getForumCategories()
      .then((data) => {
        setCategories(data);
        console.log("Catégories reçues depuis l'API :", data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const newTopic = await createTopic(
        { subcategory_id: subCategoryId, title, content },
        token
      );
      navigate(`/topics/${newTopic.slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Créer un nouveau sujet</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Titre du sujet *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Comment gérer l'anxiété au quotidien ?"
            required
            className="p-3 border rounded-xl"
          />
        </div>

        {/* Menu unique regroupé par catégorie */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Sous-catégorie *</label>
          <select
            value={subCategoryId}
            onChange={(e) => setSubCategoryId(e.target.value)}
            required
            className="p-3 border rounded-xl bg-white"
          >
            <option value="">-- Choisir une sous-catégorie --</option>
            {categories.map((cat) => (
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

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Message *</label>
          <textarea
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Exprimez-vous ici..."
            required
            className="p-3 border rounded-xl"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-xl"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-xl disabled:opacity-50"
          >
            {loading ? "Publication..." : "Publier le sujet"}
          </button>
        </div>
      </form>
    </div>
  );
}