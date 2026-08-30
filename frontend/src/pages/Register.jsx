import { useState, useEffect } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../hooks/useSettings";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { settings, hydrated } = useSettings();

  useEffect(() => {
    if (hydrated && settings?.registration_open === false) {
      setError(
        "Les inscriptions sont temporairement fermées. Merci de revenir ultérieurement."
      );
    }
  }, [hydrated, settings?.registration_open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hydrated && settings?.registration_open === false) {
      setError(
        "Les inscriptions sont temporairement fermées. Merci de revenir ultérieurement."
      );
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      await registerUser(username, email, password);
      const loginData = await loginUser(email, password);
      login(loginData.user, loginData.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (hydrated && settings?.registration_open === false) {
    return (
      <div className="page-wrapper">
        <h1 className="page-title">Inscription fermée</h1>
        <div className="form-card form-card--md form-card--center">
          <div className="form-header form-header--yellow">
            <span aria-hidden="true" style={{ marginRight: 8 }}>🔒</span>
            Inscriptions désactivées
          </div>
          <div className="form-body" style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "var(--fs-base)",
                color: "var(--color-text-body)",
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              Les inscriptions ne sont pas disponibles pour le moment.
            </p>
            <p
              style={{
                fontSize: "var(--fs-base-sm)",
                color: "var(--color-text-subtle)",
                lineHeight: 1.5,
                marginBottom: 24,
              }}
            >
              L'administrateur de{" "}
              <strong style={{ color: "var(--color-primary-dark)" }}>
                {settings.forum_name}
              </strong>{" "}
              a temporairement fermé la création de nouveaux comptes. Merci de réessayer plus
              tard.
            </p>
            <Link to="/login" className="btn btn-primary btn--fit" style={{ display: "inline-block", width: "auto", minWidth: 220 }}>
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Inscription</h1>

      <div className="form-card form-card--md form-card--center">
        <h2 className="form-header form-header--sage">
          <span aria-hidden="true" style={{ fontSize: "1.2rem" }}>✨</span>
          Créer un compte
        </h2>
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
            {submitting ? "Création du compte..." : "S'inscrire"}
          </button>
        </form>

        <p className="form-footer">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
