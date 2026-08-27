import UsefulNumberCard from "../components/forum/UsefulNumberCard";
import { useEffect, useState } from "react";
import {
  getUsefulNumbers,
  deleteUsefulNumberCategory,
} from "../services/usefulnumberService";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const HEADER_STYLES = {
  "Urgences psy & crise": {
    bg: "bg-[#E6B8AE]",
    text: "text-[#5C2318]",
  },
  "Santé mentale & Écoute": {
    bg: "bg-[#F1C16F]",
    text: "text-[#4A3611]",
  },
  default: {
    bg: "bg-[#EAE3D6]",
    text: "text-[#3F3F3E]",
  },
};

export default function Numbers() {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  const loadNumbers = () => {
    getUsefulNumbers()
      .then((data) => setNumbers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNumbers();
  }, []);

  const handleDeleteNumber = (deletedId) => {
    setNumbers((prev) => prev.filter((item) => item.id !== deletedId));
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (
      !window.confirm(
        `Supprimer la catégorie « ${categoryName} » ? Attention, assure-toi qu'elle ne contient plus de numéros.`
      )
    )
      return;

    try {
      // Signature : deleteUsefulNumberCategory(id, token)
      await deleteUsefulNumberCategory(categoryId, token);
      setNumbers((prev) => prev.filter((item) => item.category_id !== categoryId));
    } catch (err) {
      alert(err.message);
    }
  };

  const groupedCategories = numbers.reduce((acc, item) => {
    const catName = item.category_name || "Autres";
    if (!acc[catName]) {
      acc[catName] = {
        id: item.category_id,
        name: catName,
        items: [],
      };
    }
    acc[catName].items.push(item);
    return acc;
  }, {});

  if (loading) return <p className="text-center py-8">Chargement des numéros...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="max-w-full mx-auto px-4 py-8 flex flex-col gap-12">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="page-title">Tous les numéros utiles</h1>

        {user?.role === "admin" && (
          <div className="flex items-center gap-3">
            <Link to="/numbers/categories/new" className="btn-admin-create-outline border p-2 rounded-xl">
              + Nouvelle catégorie
            </Link>
            <Link to="/numbers/new" className="btn-admin-create bg-black text-white p-2 rounded-xl">
              + Nouveau numéro
            </Link>
          </div>
        )}
      </div>

      {Object.values(groupedCategories).map((category) => {
        const style = HEADER_STYLES[category.name] || HEADER_STYLES.default;

        return (
          <section key={category.name} className="flex flex-col gap-6">
            <div className={`flex items-center justify-between p-4 rounded-2xl shadow-sm ${style.bg} ${style.text}`}>
              <h2 className="text-2xl md:text-3xl font-bold flex-1 text-center">
                {category.name}
              </h2>

              {user?.role === "admin" && category.id && (
                <div className="flex gap-2">
                  <Link
                    to={`/numbers/categories/edit/${category.id}`}
                    className="text-sm px-2 py-1 bg-white/70 rounded-lg hover:bg-white"
                    title="Modifier la catégorie"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="text-sm px-2 py-1 bg-white/70 rounded-lg hover:bg-white text-red-600"
                    title="Supprimer la catégorie"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {category.items.map((item) => (
                <UsefulNumberCard
                  key={item.id}
                  item={item}
                  categoryName={category.name}
                  onDelete={handleDeleteNumber}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}