import { MessageCircle } from "lucide-react";

const CATEGORY_STYLES = {
  "Urgences psy & crise": {
    cardBg: "bg-[#F9ECE8] hover:bg-[#F3DDD7]",
    badge: "bg-[#E6B8AE] text-[#5C2318]",
    title: "text-[#3F3F3E]",
  },
  "Santé mentale & Écoute": {
    cardBg: "bg-[#FCF4E4] hover:bg-[#F8E9C9]",
    badge: "bg-[#F1C16F] text-[#4A3611]",
    title: "text-[#3F3F3E]",
  },
  default: {
    cardBg: "bg-[#EAE3D6] hover:bg-[#DFD6C5]",
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
        {/* En-tête : Badge horaires à gauche & Icône chat à droite si disponible */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-xs font-bold px-4 py-1.5 rounded-full ${style.badge}`}
          >
            {item.badge}
          </span>

          {item.chat && (
            <div
              className="flex items-center gap-1.5 bg-white/80 border border-stone-200/60 rounded-full px-3 py-1.5 shadow-xs group relative"
              title={item.chat}
            >
              <MessageCircle className="w-4 h-4 text-[#3F3F3E]" />
              <span className="text-[11px] font-bold text-[#3F3F3E]">Chat</span>
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex items-center px-3 py-2 bg-[#3F3F3E] text-white text-[11px] font-medium rounded-lg whitespace-nowrap z-10 shadow-lg">
                {item.chat}
                <div className="absolute -bottom-1 right-4 w-2 h-2 bg-[#3F3F3E] rotate-45"></div>
              </div>
            </div>
          )}
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

        <div className="flex justify-end">
          <span className="text-slate-400 font-light text-xl">→</span>
        </div>
      </div>

      {/* Encart inférieur blanc : description + bouton centré */}
      <div className="px-4 py-5 flex flex-col items-center justify-center gap-4">
        <p className="text-xs text-slate-500 font-medium line-clamp-2 text-center">
          {item.description}
        </p>

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white text-sm font-bold px-8 py-3 rounded-full hover:bg-slate-800 active:bg-slate-950 transition-colors"
          >
            Visiter
          </a>
        )}
      </div>
    </div>
  );
}
