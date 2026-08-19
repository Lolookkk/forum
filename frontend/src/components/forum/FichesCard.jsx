

const COLOR_PALETTE = [
  { cardBg: "bg-[#EAE3D6] hover:bg-[#DFD6C5]", iconBg: "bg-white/80" },
  { cardBg: "bg-[#F9ECE8] hover:bg-[#F3DDD7]", iconBg: "bg-white/80" },
  { cardBg: "bg-[#FCF4E4] hover:bg-[#F8E9C9]", iconBg: "bg-white/80" },
  { cardBg: "bg-[#E5EEED] hover:bg-[#CFDEDD]", iconBg: "bg-white/80" },
];

export default function FichesCard({ item, index = 0 }) {
  const style = COLOR_PALETTE[index % COLOR_PALETTE.length];
  const IconComponent = item?.icon;
  const linkUrl = item?.actionUrl || item?.url;

  return (
    <div className="bg-white rounded-[28px] p-2 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Encart supérieur BLANC avec icône et titre */}
      <div className="rounded-[22px] p-5 flex flex-col justify-between min-h-[190px] bg-white">
        {/* En-tête : Icône à gauche */}
        <div className="flex items-center justify-between gap-2">
          {IconComponent && (
            <div className={`w-11 h-11 rounded-full ${style.iconBg} border border-stone-200/60 flex items-center justify-center shadow-xs`}>
              <IconComponent className={`w-6 h-6 ${item.iconColor || "text-stone-800"}`} />
            </div>
          )}
        </div>

        {/* Titre de la fiche centré */}
        <div className="my-3 text-center">
          <h3 className="text-2xl font-bold tracking-tight text-[#3F3F3E]">
            {item?.title}
          </h3>
        </div>

        {/* Flèche indicative */}
        <div className="flex justify-end">
          <span className="text-slate-400 font-light text-xl">→</span>
        </div>
      </div>

      {/* Encart central COULEUR avec description */}
      <div className={`${style.cardBg} rounded-[22px] p-5 my-2 flex items-center justify-center transition-colors flex-1`}>
        <p className="text-sm text-[#3F3F3E] font-medium leading-relaxed text-center">
          {item?.description}
        </p>
      </div>

      {/* Bouton centré en bas */}
      <div className="px-4 pb-5 pt-2 flex items-center justify-center">
        {linkUrl ? (
          <a
            href={linkUrl}
            className="bg-[#F1C16F] text-[#FAF7F0] text-sm font-bold px-8 py-3 rounded-full hover:bg-slate-800 active:bg-slate-950 transition-colors"
          >
            Lire la fiche
          </a>
        ) : item?.onClick ? (
          <button
            onClick={item.onClick}
            className="bg-black text-white text-sm font-bold px-8 py-3 rounded-full hover:bg-slate-800 active:bg-slate-950 transition-colors"
          >
            Lire la fiche
          </button>
        ) : null}
      </div>
    </div>
  );
}
