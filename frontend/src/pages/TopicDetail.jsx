import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/forum/HomeSidebar";
import { getTopicBySlug, getTopicInformationById } from "../services/topicService";
import "./Home.css";

export default function TopicDetail() {
  const { topicSlug } = useParams();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTopicBySlug(topicSlug)
      .then((firstResult) => {
        return getTopicInformationById(firstResult.id);
      })
      .then((fullTopicData) => {
        setTopic(fullTopicData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [topicSlug]);

  return (
    <div className="home-container">
      <main className="main-content">
        {loading && <div className="state-message">Chargement du sujet...</div>}
        {error && <div className="state-message error">{error}</div>}

        {!loading && !error && topic && (
          <article>
            {/* Titre du sujet */}
            <h1>{topic.title}</h1>

            {/* Auteur et date */}
            <div>
              <span>
                Par <strong>{topic.author || "Anonyme"}</strong>
              </span>
              <span>•</span>
              <span>
                {topic.created_at
                  ? new Date(topic.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Date inconnue"}
              </span>
            </div>

            {/* Contenu principal */}
            <div>{topic.content}</div>
          </article>
        )}
      </main>

      <Sidebar />
    </div>
  );
}