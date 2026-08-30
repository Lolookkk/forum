import { useState, useEffect, useCallback, useMemo } from "react";
import { UserContext } from "./UserContext";
import {
  getMembers,
  updateUserRole,
  banUser as banUserService,
  deleteUser as deleteUserService,
} from "../services/userService";

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const doFetchAll = useCallback(async ({ withLoadingState }) => {
    try {
      if (withLoadingState) setLoading(true);

      const data = await getMembers();
      const flatUsers = Array.isArray(data) ? data : data?.users || [];
      setUsers(flatUsers);

      setError(null);
    } catch (err) {
      setError(err.message || "Erreur de chargement des utilisateurs.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    await doFetchAll({ withLoadingState: true });
  }, [doFetchAll]);

  useEffect(() => {
    (async () => {
      await doFetchAll({ withLoadingState: false });
    })();
  }, [doFetchAll]);

  // Séparation automatique des utilisateurs par rôle / état
  // Adapte les propriétés 'role' et 'is_banned' selon les noms renvoyés par ton API
  const { admins, moderators, regularUsers, bannedUsers } = useMemo(() => {
    const activeUsers = users.filter((u) => !u.is_banned);
    const banned = users.filter((u) => u.is_banned);

    return {
      admins: activeUsers.filter((u) => u.role === "admin"),
      moderators: activeUsers.filter((u) => u.role === "moderateur"),
      regularUsers: activeUsers.filter((u) => u.role === "membre"),
      bannedUsers: banned,
    };
  }, [users]);

  // Action : Changer de rôle
  const changeRole = async (userId, newRole, token) => {
    await updateUserRole(userId, newRole, token);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  // Action : Bannir
  const ban = async (userId, token) => {
    await banUserService(userId, token);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_banned: true } : u))
    );
  };

  // Action : Supprimer définitivement
  const remove = async (userId, token) => {
    await deleteUserService(userId, token);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <UserContext.Provider
      value={{
        users,
        admins,
        moderators,
        regularUsers,
        bannedUsers,
        loading,
        error,
        refreshUsers,
        changeRole,
        ban,
        remove,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}