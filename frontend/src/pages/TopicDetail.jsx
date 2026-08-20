import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/forum/HomeSidebar";
import { getTopicBySlug, getTopicInformationById } from "../services/topicService";
import "./Home.css";
import { getAllPostsWithAuthorByTopic } from "../services/postService";
import TopicMainPost from "../components/forum/TopicMainPost";
import ReplyCard from "../components/forum/ReplyCard";
import ReplyForm from "../components/forum/ReplyForm";

export default function TopicDetail() {
  const { topicSlug } = useParams();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    getTopicBySlug(topicSlug)
      .then((firstResult) => {
        const topicId = firstResult.id;
        return Promise.all([
            getTopicInformationById(topicId),
            getAllPostsWithAuthorByTopic(topicId)
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
        {loading && <div className="state-message">Chargement du sujet...</div>}
        {error && <div className="state-message error">{error}</div>}

        {!loading && !error && topic && (
          <div>
            <TopicMainPost topic={topic} />
            <section>
                <h3>Réponses ({replies.length})</h3>
                {replies.length > 0 ? (
                replies.map((reply) => (
                  <ReplyCard key={reply.id} reply={reply} />
                ))
              ) : (
                <p>Aucune réponse pour le moment. Soyez le premier à répondre !</p>
              )}
            </section>
            <ReplyForm topicId={topic.id} onReplyAdded={(newReply) => setReplies([...replies, newReply])} />
          </div>
        )}
      </main>

      <Sidebar />
    </div>
  );
}