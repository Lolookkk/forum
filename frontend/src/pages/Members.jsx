import { useEffect, useState } from "react";
import MemberCard from "../components/forum/MemberCard"; // Ajuste le chemin si besoin
import { getMembers } from "../services/userService";   // Ajuste le chemin du service
import "./Members.css";

export default function Members() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMembers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Tous les membres</h1>

      {/* Affichage pendant le chargement */}
      {loading && (
        <div className="state-message">Chargement des membres...</div>
      )}

      {/* Affichage en cas d'erreur */}
      {error && (
        <div className="form-error form-error--inline">{error}</div>
      )}

      {/* Aucun membre */}
      {!loading && !error && users.length === 0 && (
        <div className="state-message">Aucun membre pour le moment.</div>
      )}

      {/* Grille de cartes membres */}
      {!loading && !error && users.length > 0 && (
        <div className="members-grid">
          {users.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}