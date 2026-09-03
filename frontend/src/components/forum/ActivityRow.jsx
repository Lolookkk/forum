import { Link } from "react-router-dom";
import "./ActivityRow.css";
import { parseUTCDate } from "../../utils/dateUtils";

export default function ActivityRow({ publication }) {
  const d = parseUTCDate(publication?.created_at);
  const formattedDate = d
    ? d.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Date inconnue";

  const isTopic = publication.type === "topic";

  return (
    <article className={`activity-card ${isTopic ? "activity-card--topic" : "activity-card--post"}`}>
      {/* En-tête de la carte */}
      <div className="activity-header">
        <div className="activity-header-left">
          {/* Type de publication */}
          <span className={`activity-badge ${isTopic ? "activity-badge--yellow" : "activity-badge--sage"}`}>
            {isTopic ? "Sujet" : "Réponse"}
          </span>

          {/* Lien vers la sous-catégorie */}
          <Link to={`/categories/${publication.category_slug}/${publication.subcategory_slug}`} className="activity-subcategory">
            {publication.subcategory_title}
          </Link>
        </div>
        

        {/* Date de création */}
        <time className="activity-date" dateTime={publication.created_at}>
          {formattedDate}
        </time>
      </div>

      {/* Corps de la carte */}
      <div className="activity-body">
        {/* Titre du topic lié */}
        <h4 className="activity-title">
          <Link to={`/topics/${publication.topic_slug}`}>
            {publication.topic_title}
          </Link>
        </h4>

        {/* Extrait du contenu */}
        <p className="activity-content">{publication.content}</p>
      </div>
    </article>
  );
}