import "./MemberCard.css";

export default function MemberCard({ member }) {
  // Formatage propre de la date d'inscription
  const joinedDate = member?.created_at
    ? new Date(member.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date inconnue";

  return (
    <div className="member-card">
      {/* Encart supérieur / Bannière */}
      <div className="member-card-banner">
        {/* Photo de profil (avec fallback si absente) */}
        <div className="member-avatar-wrapper">
          {member?.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="member-avatar"
            />
          ) : (
            <div className="member-avatar-placeholder">
              {member?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>

        {/* Informations du membre */}
        <div className="member-card-content">
          <h3 className="member-name">{member?.name || member?.username}</h3>
          
          <span className="member-role">
            {member?.role || "Membre"}
          </span>

          <p className="member-joined-date">
            Inscrit(e) le {joinedDate}
          </p>
        </div>
      </div>
    </div>
  );
}