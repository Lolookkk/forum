import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUsefulNumberCategories,
  createUsefulNumberCategory,
  updateUsefulNumberCategory,
} from "../services/usefulnumberService";
import { useAuth } from "../hooks/useAuth";

export default function NumberCategoryForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditMode) return;

    let ignore = false;
    const fetchCategory = async () => {
      try {
        const categories = await getUsefulNumberCategories();
        if (ignore) return;
        const currentCat = categories.find((c) => String(c.id) === String(id));
        if (currentCat) {
          setName(currentCat.name);
        } else {
          setError("Catégorie introuvable.");
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setFetching(false);
      }
    };

    fetchCategory();
    return () => {
      ignore = true;
    };
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEditMode) {
        // Signature : (id, name, token)
        await updateUsefulNumberCategory(id, name, token);
      } else {
        // Signature : (name, token)
        await createUsefulNumberCategory(name, token);
      }
      navigate("/resources/numbers");
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-8">Chargement de la catégorie...</div>;
  }

  return (
    <div className="number-form-container max-w-lg mx-auto py-8 px-4">
      <div className="number-form-header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Modifier la catégorie" : "Ajouter une catégorie"}
        </h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-cancel-top text-sm text-gray-500 hover:underline"
        >
          ← Annuler
        </button>
      </div>

      {error && <div className="error-message text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="form-group flex flex-col gap-2">
          <label htmlFor="name" className="font-semibold">
            Nom de la catégorie *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Santé mentale & Écoute"
            required
            className="p-3 border rounded-xl"
          />
        </div>

        <div className="form-actions flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary px-4 py-2 border rounded-xl"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-4 py-2 bg-black text-white rounded-xl disabled:opacity-50"
          >
            {loading
              ? "Enregistrement..."
              : isEditMode
              ? "Mettre à jour"
              : "Créer la catégorie"}
          </button>
        </div>
      </form>
    </div>
  );
}