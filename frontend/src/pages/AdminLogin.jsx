import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const loginData = await loginUser(email, password);
      if (loginData.user.role !== "admin") {
        setError("Accès refusé : vous n'êtes pas un administrateur.");
        setSubmitting(false);
        return;
      }
      //si admin on valide la session
      login(loginData.user, loginData.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Connexion</h1>

      <div className="form-card form-card--md form-card--center">
        <h2 className="form-header form-header--sage">
          <span aria-hidden="true" style={{ fontSize: "1.2rem" }}>🔐</span>
          Se connecter
        </h2>
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-body">

          <div className="form-group">
            <label>Adresse e-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Connexion au compte..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
