import React from "react";
import TopicRow from "../components/forum/TopicRow";
import Sidebar from "../components/layout/Sidebar";
import "./Home.css";

export default function Home() {
  const dummyTopics = [
    {
      id: 1,
      icon: "🌱",
      title: "Conseils pour l'anxiété sociale au travail",
      author: "Claire",
      category: "Psychologie",
      replies: 15,
      views: 234,
    },
    {
      id: 2,
      icon: "🐦",
      title: "Timidité et premières rencontres amoureuses",
      author: "Claire",
      category: "Relations",
      replies: 15,
      views: 234,
    },
    {
      id: 3,
      icon: "🪴",
      title: "Ateliers de peinture pour se détendre",
      author: "Claire",
      category: "Loisirs",
      replies: 8,
      views: 234,
    },
    {
      id: 4,
      icon: "🪴",
      title: "Gérer une attaque de panique en public",
      author: "Claire",
      category: "Bien-être",
      replies: 12,
      views: 234,
    },
    {
      id: 5,
      icon: "🐞",
      title: "Affirmation de soi : mes petits pas de la semaine",
      author: "Claire",
      category: "Psychologie",
      replies: 3,
      views: 256,
    },
  ];

  return (
    <div className="home-container">
      {/* Colonne Gauche : Flux principal */}
      <main className="main-content">
        <h2>DERNIERS SUJETS CRÉÉS</h2>

        <div className="topics-card">
          <div className="table-header">
            <span>Sujet</span>
            <span>Catégorie</span>
            <span>Statistiques</span>
          </div>

          {/* Injection de chaque sujet via le composant TopicRow */}
          {dummyTopics.map((topic) => (
            <TopicRow key={topic.id} topic={topic} />
          ))}
        </div>
      </main>

      {/* Colonne Droite : Sidebar */}
      <Sidebar />
    </div>
  );
}