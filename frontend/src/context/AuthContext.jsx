import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { getMe } from "../services/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const isValidJwt = (token) => {
      if (!token || typeof token !== "string") return false;
      const parts = token.split(".");
      return parts.length === 3 && parts.every((p) => p.length > 0);
    };

    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        if (!isValidJwt(savedToken)) {
          localStorage.removeItem("token");
          setLoading(false);
          return;
        }

        try {
          const data = await getMe(savedToken);
          setUser(data.user);
          setToken(savedToken);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}