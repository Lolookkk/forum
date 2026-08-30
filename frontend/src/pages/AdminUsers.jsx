import { useUser } from "../hooks/useUser";
import { useAuth } from "../hooks/useAuth";
import "./AdminUsers.css";

export default function AdminUsers() {
  const { token } = useAuth();
  const {
    admins,
    moderators,
    regularUsers,
    bannedUsers,
    loading,
    error,
    changeRole,
    ban,
    remove,
  } = useUser();

  // Action : Changer le rôle d'un utilisateur
  const handleRoleChange = async (userId, newRole) => {
    try {
      await changeRole(userId, newRole, token);
    } catch (err) {
      alert(err.message || "Erreur lors du changement de rôle.");
    }
  };

  // Action : Bannir un utilisateur
  const handleBan = async (userId, username) => {
    if (!window.confirm(`Bannir l'utilisateur « ${username} » ?`)) return;
    try {
      await ban(userId, token);
    } catch (err) {
      alert(err.message || "Erreur lors du bannissement.");
    }
  };

  // Action : Supprimer un utilisateur (uniquement pour les bannis)
  const handleDelete = async (userId, username) => {
    if (!window.confirm(`Supprimer définitivement l'utilisateur « ${username} » ?`)) return;
    try {
      await remove(userId, token);
    } catch (err) {
      alert(err.message || "Erreur lors de la suppression.");
    }
  };

  if (loading) return <div className="admin-status">Chargement des utilisateurs…</div>;
  if (error) return <div className="admin-status error">Erreur : {error}</div>;

  // Fonction générique pour afficher un tableau d'utilisateurs
  const renderUserTable = (userList, title, isBannedSection = false) => (
    <section className="user-section">
      <h2>{title} ({userList.length})</h2>
      {userList.length === 0 ? (
        <p className="empty-message">Aucun utilisateur dans cette catégorie.</p>
      ) : (
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pseudo / Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((u) => {
              const displayName = u.username || u.name || "Inconnu";
              return (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{displayName}</td>
                  <td>{u.email || "-"}</td>
                  <td>
                    {!isBannedSection ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="role-select"
                      >
                        <option value="admin">Administrateur</option>
                        <option value="moderateur">Modérateur</option>
                        <option value="membre">Utilisateur</option>
                      </select>
                    ) : (
                      <span className="badge-banned">Banni</span>
                    )}
                  </td>
                  <td>
                    {!isBannedSection ? (
                      <button
                        type="button"
                        onClick={() => handleBan(u.id, displayName)}
                        className="btn-action btn-ban"
                      >
                        Bannir
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDelete(u.id, displayName)}
                        className="btn-action btn-delete"
                      >
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );

  return (
    <div className="admin-users-container">
      <h1 className="page-title">Gestion des utilisateurs</h1>

      {/* 3 Tableaux pour les membres actifs */}
      {renderUserTable(admins, "Administrateurs")}
      {renderUserTable(moderators, "Modérateurs")}
      {renderUserTable(regularUsers, "Utilisateurs")}

      {/* Tableau du bas réservé aux utilisateurs bannis */}
      {renderUserTable(bannedUsers, "Utilisateurs bannis", true)}
    </div>
  );
}