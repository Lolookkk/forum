import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTopicBySlug, getTopicInformationById } from "../services/topicService";
import { getAllPostsWithAuthorByTopic } from "../services/postService";
import { useAuth } from "../hooks/useAuth";
import TopicMainPost from "../components/forum/TopicMainPost";
import ReplyCard from "../components/forum/ReplyCard";
import ReplyForm from "../components/forum/ReplyForm";
import EditTopicModal from "../components/modals/EditTopicModal";
import "./Home.css";
import Sidebar from "../components/sidebar/Sidebar";
import ReportModal from "../components/modals/ReportModal";
import { ServiceBannerWidget, CreateTopicButton }  from "../components/sidebar/Widgets";
import { isSameUser, isEditableWithinWindow } from "../utils/dateUtils";

export default function TopicDetail() {
  const { topicSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isUser = !!user;

  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEditTopicModal, setShowEditTopicModal] = useState(false);
  const [lastTopicSlug, setLastTopicSlug] = useState(topicSlug);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  if (lastTopicSlug !== topicSlug) {
    setLastTopicSlug(topicSlug);
    setTopic(null);
    setReplies([]);
    setLoading(true);
    setError(null);
    setShowReportModal(false);
    setShowEditTopicModal(false);
  }

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

  const canEditTopic =
    isSameUser(user, topic) &&
    isEditableWithinWindow(topic?.created_at, now) &&
    replies.length === 0;

  return (
    <div className="home-container">
      <main className="main-content">
        {topic && (
          <div className="topic-header-actions">
            <h1 className="page-title">{topic.title}</h1>
            {isUser && (
              <button 
                className="btn-report-link" 
                onClick={() => setShowReportModal(true)}
              >
                🚩 Signaler le sujet
              </button>
            )}
          </div>
        )}
        {loading && <div className="state-message">Chargement du sujet...</div>}
        {error && <div className="form-error form-error--inline">{error}</div>}

        {!loading && !error && topic && (
          <div>
            <TopicMainPost
              topic={topic}
              canEdit={canEditTopic}
              onEdit={() => setShowEditTopicModal(true)}
            />

            <section className="replies-section">
              <h3>Réponses ({replies.length})</h3>
              {replies.length > 0 ? (
                replies.map((reply) => (
                  <ReplyCard
                    key={reply.id}
                    reply={reply}
                    onPostUpdated={(updatedPost) => {
                      setReplies((prev) =>
                        prev.map((p) =>
                          String(p.id) === String(updatedPost.id)
                            ? { ...p, ...updatedPost }
                            : p
                        )
                      );
                    }}
                  />
                ))
              ) : (
                <p className="state-message">
                  Aucune réponse pour le moment. Soyez le premier à répondre !
                </p>
              )}
            </section>

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

      {showReportModal && topic && (
        <ReportModal 
          topicId={topic.id} 
          onClose={() => setShowReportModal(false)} 
        />
      )}

      {showEditTopicModal && topic && (
        <EditTopicModal
          topic={topic}
          onClose={() => setShowEditTopicModal(false)}
          onUpdated={(updatedTopic) => {
            setTopic((prev) => ({ ...prev, ...updatedTopic }));
            if (updatedTopic.slug && updatedTopic.slug !== topicSlug) {
              navigate(`/topics/${updatedTopic.slug}`, { replace: true });
            }
          }}
        />
      )}
    </div>
  );
}
