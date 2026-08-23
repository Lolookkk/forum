import { Link } from "react-router-dom";

export default function TopicRow({ topic }) {
  return (
    <div className="topic-row">
      {/* Icône + Titre + Auteur */}
      <div className="topic-left">
        <div className="topic-icon">{topic.icon}</div>
        <div className="topic-details">
          <Link to = {`/topics/${topic.slug}`} >
            <span className="topic-title">{topic.title}</span>
          </Link>
          <Link to = {`/profile/${topic.author}`}>
            <span className="topic-author">{topic.author}</span>
          </Link>
          
        </div>
      </div>

      {/* Badge de catégorie */}
      <Link to={`/categories/${topic.category_slug}/${topic.subcategory_slug}`}>
        <div className="category-badge">{topic.subcategory}</div>
      </Link>
      

      {/* Statistiques (Réponses & Vues) */}
      <div className="topic-stats">
        <div>{topic.replies} Réponses</div>
        <div className="views-count">/ {topic.views} Vues</div>
      </div>
    </div>
  );
}