

// Thèmes de couleurs pastel par catégorie (librement personnalisables)
const CATEGORY_STYLES = {
  "Urgences psy & crise": {
    cardBg: "bg-[#F9ECE8] hover:bg-[#F3DDD7]", // Brique / Terracotta très poudré
    badge: "bg-[#E6B8AE] text-[#5C2318]",
    title: "text-[#3F3F3E]",
  },
  "Santé mentale & Écoute": {
    cardBg: "bg-[#FCF4E4] hover:bg-[#F8E9C9]", // Moutarde pastel (décliné de ton #F1C16F)
    badge: "bg-[#F1C16F] text-[#4A3611]",
    title: "text-[#3F3F3E]",
  },
  default: {
    cardBg: "bg-[#EAE3D6] hover:bg-[#DFD6C5]", // Ton Beige-Gris de ta palette
    badge: "bg-[#A09D8B] text-[#FFFFFF]",
    title: "text-[#3F3F3E]",
  },
};

export default function UsefulNumberCard({ item, categoryName }) {
  const style = CATEGORY_STYLES[categoryName] || CATEGORY_STYLES.default;

  return (
    <div className="bg-white rounded-[28px] p-2 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Encart supérieur pastel */}
      <div
        className={`${style.cardBg} rounded-[22px] p-5 flex flex-col justify-between min-h-[190px] transition-colors`}
      >
        {/* En-tête : Badge à gauche & Numéro principal à droite */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full ${style.badge}`}
          >
            {item.badge}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {item.urgent ? "🚨 Urgent" : "Gratuit"}
          </span>
        </div>

        {/* Titre du service & Numéro en grand */}
        <div className="my-3 text-center">
          <h3 className={`text-2xl font-bold tracking-tight ${style.title}`}>
            {item.name}
          </h3>
          <p className="text-3xl font-black text-slate-900 mt-1">
            {item.number}
          </p>
        </div>

        {/* Flèche indicative en bas à droite */}
        <div className="flex justify-end">
          <span className="text-slate-400 font-light text-xl">→</span>
        </div>
      </div>

      {/* Encart inférieur blanc */}
      <div className="px-4 py-5 min-h-[30px] flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500 font-medium line-clamp-2 flex-1 text-center">
          {item.description}
        </p>

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-slate-800 active:bg-slate-950 transition-colors shrink-0"
          >
            Visiter
          </a>
        )}
      </div>
    </div>
  );
}