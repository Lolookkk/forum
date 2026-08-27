import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUsefulNumberCategories,
  getUsefulNumberById,
  createUsefulNumber,
  updateUsefulNumber,
} from "../services/usefulnumberService";
import { useAuth } from "../hooks/useAuth";

export default function UsefulNumberForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    number: "",
    description: "",
    badge: "24/7 • Gratuit",
    urgent: false,
    chat: "",
    url: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        // 1. Charge les catégories pour le menu déroulant
        const catList = await getUsefulNumberCategories();
        if (ignore) return;
        setCategories(catList);

        // 2. Si mode édition, charge les données du numéro via getNumberById
        if (isEditMode) {
          const data = await getUsefulNumberById(id);
          if (ignore) return;

          setFormData({
            category_id: data.category_id || "",
            name: data.name || "",
            number: data.number || "",
            description: data.description || "",
            badge: data.badge || "",
            urgent: Boolean(data.urgent),
            chat: data.chat || "",
            url: data.url || "",
          });
        } else if (catList.length > 0) {
          // Sélectionne la première catégorie par défaut lors d'une création
          setFormData((prev) => ({ ...prev, category_id: catList[0].id }));
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isEditMode) {
        await updateUsefulNumber(id, formData, token);
      } else {
        await createUsefulNumber(formData, token);
      }
      navigate("/resources/numbers");
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.name) {
    return <div className="loading-state">Chargement du numéro...</div>;
  }

  return (
    <div className="number-form-container">
      <div className="number-form-header">
        <h1>{isEditMode ? "Modifier le numéro" : "Ajouter un numéro utile"}</h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-cancel-top"
        >
          ← Annuler
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="number-form">
        <div className="form-section">
          {/* Menu déroulant des catégories (champs requis par le contrôleur) */}
          <div className="form-group">
            <label htmlFor="category_id">Catégorie *</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                -- Sélectionner une catégorie --
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nom (requis par le contrôleur) */}
          <div className="form-group">
            <label htmlFor="name">Nom du service *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ex: SAMU / SOS Amitié"
              required
            />
          </div>

          {/* Numéro (requis par le contrôleur) */}
          <div className="form-group">
            <label htmlFor="number">Numéro *</label>
            <input
              id="number"
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="ex: 15 ou 09 72 39 40 50"
              required
            />
          </div>

          {/* Badge d'information */}
          <div className="form-group">
            <label htmlFor="badge">Badge d'information</label>
            <input
              id="badge"
              type="text"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              placeholder="ex: 24/7 • Gratuit"
            />
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label htmlFor="description">Description courte</label>
            <input
              id="description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Service d'urgence médicale..."
            />
          </div>

          {/* Info Chat */}
          <div className="form-group">
            <label htmlFor="chat">Info Chat (optionnel)</label>
            <input
              id="chat"
              type="text"
              name="chat"
              value={formData.chat}
              onChange={handleChange}
              placeholder="ex: Disponible 13h-03h"
            />
          </div>

          {/* Site web URL */}
          <div className="form-group">
            <label htmlFor="url">Site web (URL)</label>
            <input
              id="url"
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.org"
            />
          </div>

          {/* Case à cocher Urgence */}
          <div className="form-group checkbox-group full-width">
            <label htmlFor="urgent" className="checkbox-label">
              <input
                id="urgent"
                type="checkbox"
                name="urgent"
                checked={formData.urgent}
                onChange={handleChange}
              />
              Marquer comme numéro d'urgence prioritaire
            </label>
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
              : "Ajouter le numéro"}
          </button>
        </div>
      </form>
    </div>
  );
}