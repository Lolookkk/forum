import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCategories } from "../hooks/useCategories";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../services/subcategoryService";
import "./AdminCategories.css";

export default function AdminCategories() {
  const { token } = useAuth();
  const { categoriesTree, loading, error, refreshCategories } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("CATEGORY");
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category_id: "",
  });

  const categories = categoriesTree || [];

  const openCategoryModal = (category = null) => {
    setModalType("CATEGORY");
    setEditingItem(category);
    setFormData({
      name: category?.name || category?.title || "",
      slug: category?.slug || "",
      description: category?.description || "",
      category_id: "",
    });
    setIsModalOpen(true);
  };

  const openSubcategoryModal = (subcategory = null, parentCategoryId = "") => {
    setModalType("SUBCATEGORY");
    setEditingItem(subcategory);
    setFormData({
      name: subcategory?.name || subcategory?.title || "",
      slug: subcategory?.slug || "",
      description: subcategory?.description || "",
      category_id:
        subcategory?.category_id ||
        subcategory?.parent_id ||
        parentCategoryId ||
        "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ name: "", slug: "", description: "", category_id: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === "CATEGORY") {
        const payload = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
        };
        if (editingItem) {
          await updateCategory(editingItem.id, payload, token);
        } else {
          await createCategory(payload, token);
        }
      } else {
        const payload = {
          title: formData.name,
          slug: formData.slug,
          description: formData.description,
          category_id: formData.category_id,
        };
        if (editingItem) {
          await updateSubcategory(editingItem.id, payload, token);
        } else {
          await createSubcategory(payload, token);
        }
      }

      closeModal();
      await refreshCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Supprimer la catégorie « ${name} » ?`)) return;

    try {
      await deleteCategory(id, token);
      await refreshCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSubcategory = async (id, name) => {
    if (!window.confirm(`Supprimer la sous-catégorie « ${name} » ?`)) return;

    try {
      await deleteSubcategory(id, token);
      await refreshCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return <div className="admin-status">Chargement des catégories…</div>;
  if (error) return <div className="admin-status error">Erreur : {error}</div>;

  return (
    <div className="admin-categories-container">
      <div className="page-wrapper" style={{ padding: 0, margin: 0, maxWidth: "none" }}>
        <h1 className="page-title">Gestion des catégories</h1>

        <div className="admin-top-bar">
          <div />
          <button
            onClick={() => openCategoryModal()}
            className="btn btn-primary btn--fit"
          >
            + Nouvelle catégorie
          </button>
        </div>

        <div className="categories-tree">
          {categories.map((cat) => (
            <div key={cat.id} className="cat-card form-card">
              <div className="cat-card-header">
                <div className="cat-info">
                  <h3>{cat.name || cat.title}</h3>
                  {cat.slug && (
                    <span className="cat-slug-badge">Slug : {cat.slug}</span>
                  )}
                  {cat.description && (
                    <p className="cat-desc">{cat.description}</p>
                  )}
                </div>

                <div className="cat-actions">
                  <button
                    type="button"
                    onClick={() => openSubcategoryModal(null, cat.id)}
                    className="btn btn-yellow btn--fit"
                  >
                    + Sous-catégorie
                  </button>
                  <button
                    type="button"
                    onClick={() => openCategoryModal(cat)}
                    className="btn btn-sage btn--fit"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteCategory(cat.id, cat.name || cat.title)
                    }
                    className="btn btn-delete btn--fit"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="subcat-list">
                {cat.subcategories.length === 0 ? (
                  <div className="subcat-empty">Aucune sous-catégorie</div>
                ) : (
                  cat.subcategories.map((sub) => {
                    const subName = sub.name || sub.title || "Sans nom";
                    return (
                      <div key={sub.id} className="subcat-item">
                        <div className="subcat-info">
                          <span className="subcat-name">↳ {subName}</span>
                          {sub.slug && (
                            <small className="subcat-slug"> ({sub.slug})</small>
                          )}
                        </div>
                        <div className="subcat-actions">
                          <button
                            type="button"
                            onClick={() =>
                              openSubcategoryModal(sub, cat.id)
                            }
                            className="btn btn-sage btn--fit"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteSubcategory(sub.id, subName)
                            }
                            className="btn btn-delete btn--fit"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="admin-modal-backdrop" onClick={closeModal}>
            <div
              className="admin-modal-box form-card form-card--md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="form-header form-header--beige">
                {editingItem
                  ? modalType === "CATEGORY"
                    ? "Modifier la catégorie"
                    : "Modifier la sous-catégorie"
                  : modalType === "CATEGORY"
                  ? "Créer une catégorie"
                  : "Créer une sous-catégorie"}
              </div>

              <form onSubmit={handleSubmit} className="form-body">
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Slug</label>
                  <input
                    type="text"
                    placeholder="ex: ma-categorie-explication"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                {modalType === "SUBCATEGORY" && (
                  <div className="form-group">
                    <label>Catégorie parente</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name || c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="modal-buttons">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-sage btn--fit"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary btn--fit">
                    {editingItem ? "Enregistrer" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
