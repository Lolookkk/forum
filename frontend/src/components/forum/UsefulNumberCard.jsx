import { MessageCircle } from "lucide-react";
import "./UsefulNumberCard.css";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { deleteUsefulNumber } from "../../services/usefulnumberService";

export default function UsefulNumberCard({ item, categoryName, onDelete }) {
  const { user, token } = useAuth();
  if (!item) return null;

  const handleDelete = async () => {
    if (!window.confirm("Es-tu sûr de vouloir supprimer ce numéro ?")) return;

    try {
      await deleteUsefulNumber(item.id, token);
      if (onDelete) onDelete(item.id); // Notifie le parent avec l'ID supprimé
    } catch (err) {
      alert(err.message);
    }
  };

  const themeClass =
    categoryName === "Urgences psy & crise"
      ? "useful-card--urgence"
      : categoryName === "Santé mentale & Écoute"
      ? "useful-card--sante"
      : "useful-card--default";

  return (
    <article className={`useful-card ${themeClass}`}>
      <div className="useful-card__top">
        <div className="useful-card__header">
          <span className="useful-card__badge">{item.badge}</span>

          {item.chat && (
            <div className="useful-card__chat" title={item.chat}>
              <MessageCircle className="useful-card__chat-icon" />
              <span className="useful-card__chat-label">Chat</span>

              <div className="useful-card__tooltip">
                {item.chat}
                <div className="useful-card__tooltip-arrow" />
              </div>
            </div>
          )}
        </div>

        <div className="useful-card__main">
          <h3 className="useful-card__title">{item.name}</h3>
          <p className="useful-card__number">{item.number}</p>
        </div>

        <div className="useful-card__arrow">→</div>
      </div>

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

        {user?.role === "admin" && (
          <div className="admin-actions-bar">
            <Link to={`/numbers/edit/${item.id}`} className="btn-admin-edit">
              ✏️ Modifier
            </Link>
            <button onClick={handleDelete} className="btn-admin-delete">
              🗑️ Supprimer
            </button>
          </div>
        )}
      </div>
    </article>
  );
}