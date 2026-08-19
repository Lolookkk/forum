import UsefulNumberCard from "../components/forum/UsefulNumberCard";
import { USEFUL_NUMBERS } from "../data/usefulNumbers";

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
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-16">
      <h1 className="text-3xl font-extrabold text-[#3F3F3E]">
        Tous les numéros utiles
      </h1>

      {USEFUL_NUMBERS.map((group) => {
        // Sélectionne le style du titre selon le nom de la catégorie
        const style = HEADER_STYLES[group.category] || HEADER_STYLES.default;

        return (
          <section key={group.category} className="flex flex-col gap-6">
            
            {/* Titre dynamique avec couleur personnalisée */}
            <h2 className={`${style.bg} ${style.text} p-4 text-2xl md:text-3xl font-bold text-center rounded-2xl shadow-sm transition-colors`}>
              {group.category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {group.numbers.map((item) => (
                <UsefulNumberCard
                  key={item.number}
                  item={item}
                  categoryName={group.category}
                />
              ))}
            </div>

          </section>
        );
      })}
    </div>
  );
}