import { useState, useEffect } from "react";
import TopicRow from "../components/forum/TopicRow";
import Sidebar from "../components/sidebar/Sidebar";
import { ServiceBannerWidget, StatsWidget, NewMembersWidget, CreateTopicButton }  from "../components/sidebar/Widgets";
import { getTopics } from "../services/topicService";
import { getNewMembers } from "../services/userService";
import "./Home.css";

export default function Home() {
  const stats = {
  members: 16673,
  topics: 234,
  posts: 1819,
  online: 12,
};

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newMembers, setNewMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState(null);

  useEffect(() => {
    getNewMembers()
      .then((data) => {
        console.log("Données reçues de l'API :", data);
        setNewMembers(data);
        setMembersLoading(false);
      })
      .catch((err) => {
        setMembersError(err.message);
        setMembersLoading(false);
      });
  }, []);


  useEffect(() => {
    getTopics()
      .then((data) => {
        console.log("Données reçues de l'API :", data); // 👈 Regarde ce qui s'affiche dans ta console !
        setTopics(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-container">
      {/* Colonne Gauche : Flux principal */}
      <main className="main-content">
        <h1 className="page-title">Accueil</h1>
        <h2>DERNIERS SUJETS CRÉÉS</h2>

        <div className="topics-card">
          <div className="table-header">
            <span>Sujet</span>
            <span>Catégorie</span>
            <span>Statistiques</span>
          </div>

          {/* Affichage pendant le chargement */}
          {loading && <div className="state-message">Chargement des sujets...</div>}

          {/* Affichage en cas d'erreur backend */}
          {error && <div className="state-message error">{error}</div>}

          {/* Affichage de la liste une fois chargée */}
          {!loading && !error && topics.length === 0 && (
            <div className="state-message">Aucun sujet pour le moment.</div>
          )}

          {!loading && !error && topics.map((topic) => (
            <TopicRow key={topic.id} topic={topic} />
          ))}
        </div>
      </main>

      {/* Colonne Droite : Sidebar */}
      <Sidebar>
        <ServiceBannerWidget
          title="SERVICE :"
          description="DÉCOUVREZ NOS ATELIERS DE BIEN-ÊTRE MENTAL"
          icon="🌻"
        />
        <StatsWidget stats={stats} />
        {membersLoading ? (
          <div className="state-message">Chargement des nouveaux membres...</div>
        ) : membersError ? (
          <div className="state-message error">{membersError}</div>
        ) : (
          <NewMembersWidget members={newMembers} />
        )}
        
        <CreateTopicButton />
       </Sidebar>
    </div>
  );
}