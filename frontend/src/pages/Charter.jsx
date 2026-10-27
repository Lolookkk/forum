import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../hooks/useAuth";
import { getCharter } from "../services/adminsettingsService";

export default function Charter() {
  const { user } = useAuth();
  const [charter, setCharter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getCharter()
      .then((data) => {
        if (isMounted) setCharter(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper">
        <p className="state-message">Chargement de la charte...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="form-error form-error--inline">{error}</div>
      </div>
    );
  }

  const content = charter?.content?.trim() || "";

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Charte</h1>

      {user?.role === "admin" && (
        <div className="admin-actions-bar">
          <Link to="/charter/edit" className="btn-admin-edit">
            ✏️ Modifier
          </Link>
        </div>
      )}

      <div className="form-card">
        <div className="form-header form-header--sage">
          <span>La charte du forum</span>
        </div>
        <div className="form-body">
          {content ? (
            <article className="prose prose-stone prose-headings:text-[var(--color-primary-dark)] prose-a:text-[var(--color-accent-sage)] prose-strong:text-[var(--color-primary-dark)] max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </article>
          ) : (
            <p className="state-message">
              Aucune charte n&apos;a encore été publiée.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
