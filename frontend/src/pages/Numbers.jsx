import UsefulNumberCard from "../components/forum/UsefulNumberCard";
import { useEffect, useState } from "react";
import { getUsefulnumbers } from "../services/usefulnumberService";

// Couleurs des bandeaux de catégories (assorties aux cartes)
const HEADER_STYLES = {
  "Urgences psy & crise": {
    bg: "bg-[#E6B8AE]",       // Terracotta / Brique doux
    text: "text-[#5C2318]",   // Brique foncé pour la lisibilité
  },
  "Santé mentale & Écoute": {
    bg: "bg-[#F1C16F]",       // Jaune Moutarde
    text: "text-[#4A3611]",   // Marron chaud
  },
  default: {
    bg: "bg-[#EAE3D6]",       // Beige-Gris neutre
    text: "text-[#3F3F3E]",
  },
};

export default function Numbers() {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNumbers = () => {
    getUsefulnumbers()
      .then((data) => setNumbers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNumbers();
  }, []);

  // Regroupement des numéros par nom de catégorie
  const groupedNumbers = numbers.reduce((acc, item) => {
    const categoryName = item.category_name || "Autres";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {});

  if (loading) return <p className="text-center py-8">Chargement des numéros...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="max-w-full mx-auto px-4 py-8 flex flex-col gap-16">
      <h1 className="page-title">
        Tous les numéros utiles
      </h1>

      {Object.entries(groupedNumbers).map(([categoryName, items]) => {
        // Sélectionne le style du titre selon le nom de la catégorie
        const style = HEADER_STYLES[categoryName] || HEADER_STYLES.default;

        return (
          <section key={categoryName} className="flex flex-col gap-6">
            {/* Titre dynamique unique par catégorie */}
            <h2 className={`${style.bg} ${style.text} p-4 text-2xl md:text-3xl font-bold text-center rounded-2xl shadow-sm transition-colors`}>
              {categoryName}
            </h2>

            {/* Grille des cartes appartenant à cette catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {items.map((item) => (
                <UsefulNumberCard
                  key={item.id}
                  item={item}
                  categoryName={categoryName}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}