import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import "./FichesCard.css";

export default function FichesCard({ item }) {
  if (!item) return null;
  // Normalisation des propriétés (compatible données statiques ET BDD)
  const title = item.title;
  const description = item.description;
  const buttonText = "Lire la fiche";
  const targetUrl = item.slug ? `/fiches/${item.slug}` : "#";
  const iconColorClass = item.iconColor || item.icon_color || "text-[#3B6978]";

  // Gestion dynamique de l'icône (composant ou chaîne provenant de la BDD)
  let IconComponent = LucideIcons.FileText; // Icône par défaut

  if (typeof item.icon === "string") {
    IconComponent = LucideIcons[item.icon] || LucideIcons.FileText;
  } else if (item.icon) {
    IconComponent = item.icon;
  }

  return (
    <article className="fiche-card">
      <div className="fiche-card__header">
        <div className="fiche-card__icon-wrapper">
          <IconComponent className={`fiche-card__icon ${iconColorClass}`} />
        </div>
      </div>

      <div className="fiche-card__body">
        <h3 className="fiche-card__title">{title}</h3>
        <p className="fiche-card__description">{description}</p>
      </div>

      <div className="fiche-card__footer">
        <Link to={targetUrl} className="btn btn-primary fiche-card__btn">
          {buttonText}
        </Link>
      </div>
    </article>
  );
}