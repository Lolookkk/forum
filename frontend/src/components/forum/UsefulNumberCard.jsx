import { MessageCircle } from "lucide-react";
import "./UsefulNumberCard.css";

export default function UsefulNumberCard({ item, categoryName }) {
  if (!item) return null;

  // Association de la classe de thème selon la catégorie
  const themeClass =
    categoryName === "Urgences psy & crise"
      ? "useful-card--urgence"
      : categoryName === "Santé mentale & Écoute"
      ? "useful-card--sante"
      : "useful-card--default";

  return (
    <article className={`useful-card ${themeClass}`}>
      {/* Encart supérieur pastel */}
      <div className="useful-card__top">
        {/* En-tête : Badge horaires & Chat */}
        <div className="useful-card__header">
          <span className="useful-card__badge">{item.badge}</span>

          {item.chat && (
            <div className="useful-card__chat" title={item.chat}>
              <MessageCircle className="useful-card__chat-icon" />
              <span className="useful-card__chat-label">Chat</span>

              {/* Tooltip au survol */}
              <div className="useful-card__tooltip">
                {item.chat}
                <div className="useful-card__tooltip-arrow" />
              </div>
            </div>
          )}
        </div>

        {/* Titre du service & Numéro */}
        <div className="useful-card__main">
          <h3 className="useful-card__title">{item.name}</h3>
          <p className="useful-card__number">{item.number}</p>
        </div>

        {/* Flèche d'indication */}
        <div className="useful-card__arrow">→</div>
      </div>

      {/* Encart inférieur blanc : Description + Bouton */}
      <div className="useful-card__bottom">
        <p className="useful-card__description">{item.description}</p>

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="useful-card__btn"
          >
            Visiter
          </a>
        )}
      </div>
    </article>
  );
}