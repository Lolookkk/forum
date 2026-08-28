import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getTopicBySlug, getTopicInformationById } from "../services/topicService";
import { getAllPostsWithAuthorByTopic } from "../services/postService";
import { useAuth } from "../hooks/useAuth";
import TopicMainPost from "../components/forum/TopicMainPost";
import ReplyCard from "../components/forum/ReplyCard";
import ReplyForm from "../components/forum/ReplyForm";
import "./Home.css";
import Sidebar from "../components/sidebar/Sidebar";
import { ServiceBannerWidget, CreateTopicButton }  from "../components/sidebar/Widgets";

export default function TopicDetail() {
  const { topicSlug } = useParams();
  const { user } = useAuth();
  const isUser = !!user; // 👈 Plus propre : vérifie simplement si l'utilisateur est connecté

  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour recharger uniquement la liste des réponses
  const loadReplies = useCallback((topicId) => {
    getAllPostsWithAuthorByTopic(topicId)
      .then((postsData) => setReplies(postsData))
      .catch((err) => console.error("Erreur rechargement réponses :", err));
  }, []);

  useEffect(() => {
    getTopicBySlug(topicSlug)
      .then((firstResult) => {
        const topicId = firstResult.id;
        return Promise.all([
          getTopicInformationById(topicId),
          getAllPostsWithAuthorByTopic(topicId),
        ]);
      })
      .then(([fullTopicData, postsData]) => {
        setTopic(fullTopicData);
        setReplies(postsData);
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
        {topic && <h1 className="page-title">{topic.title}</h1>}
        {loading && <div className="state-message">Chargement du sujet...</div>}
        {error && <div className="form-error form-error--inline">{error}</div>}

        {!loading && !error && topic && (
          <div>
            <TopicMainPost topic={topic} />

            <section className="replies-section">
              <h3>Réponses ({replies.length})</h3>
              {replies.length > 0 ? (
                replies.map((reply) => (
                  <ReplyCard key={reply.id} reply={reply} />
                ))
              ) : (
                <p className="state-message">
                  Aucune réponse pour le moment. Soyez le premier à répondre !
                </p>
              )}
            </section>

            {/* Passe la fonction de rechargement au formulaire */}
            {isUser && (
              <ReplyForm
                topicId={topic.id}
                onReplyAdded={() => loadReplies(topic.id)}
              />
            )}
          </div>
        )}
      </main>

      <Sidebar>
                    <ServiceBannerWidget
                      title="SERVICE :"
                      description="DÉCOUVREZ NOS ATELIERS DE BIEN-ÊTRE MENTAL"
                      icon="🌻"
                      />
                     <CreateTopicButton />
                  </Sidebar>
    </div>
  );
}