import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAnnouncements } from "../services/announcementService";
import AdminAddAnnonce from "../components/forum/AdminAddAnnounces";
import "./Announcements.css";
import { formatForumDate } from "../utils/dateUtils";

export default function Announcements() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAnnouncements = () => {
    getAnnouncements()
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return (
    <div className="announcements-page">
      <h1 className="page-title">Annonces officielles</h1>

      {/* Seul l'admin verra ce formulaire */}
      
      {isAdmin && <AdminAddAnnonce onAnnounceAdded={loadAnnouncements} />}

      {loading ? (
        <p>Chargement des annonces...</p>
      ) : (
        <div className="announcements-list">
          {announcements.map((item) => (
            <article key={item.id} className="announcement-card">
              <h2>{item.title}</h2>
              <p>{item.content}</p>
              <small>
                Publié par {item.author_name} le {formatForumDate(item.created_at)}
              </small>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}