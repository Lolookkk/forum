import React from "react";

export default function TopicRow({ topic }) {
  return (
    <div className="topic-row">
      {/* Icône + Titre + Auteur */}
      <div className="topic-left">
        <div className="topic-icon">{topic.icon}</div>
        <div className="topic-details">
          <span className="topic-title">{topic.title}</span>
          <span className="topic-author">{topic.author}</span>
        </div>
      </div>

      {/* Badge de catégorie */}
      <div className="category-badge">{topic.category}</div>

      {/* Statistiques (Réponses & Vues) */}
      <div className="topic-stats">
        <div>{topic.replies} Réponses</div>
        <div className="views-count">/ {topic.views} Vues</div>
      </div>
    </div>
  );
}