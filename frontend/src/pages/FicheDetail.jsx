import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFicheBySlug } from "../services/ficheService";

export default function FicheDetail() {
  const { slug } = useParams();
  const [fiche, setFiche] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    getFicheBySlug(slug)
      .then((data) => {
        if (isMounted) setFiche(data);
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
  }, [slug]);

  if (loading) return <p className="text-center py-8">Chargement de la fiche...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;
  if (!fiche) return <p className="text-center py-8">Fiche introuvable.</p>;
  
  return (
    <div className="w-full max-w-full mx-auto px-6 md:px-12 py-8">
      <article className="prose prose-stone prose-headings:text-[var(--color-primary-dark)] prose-a:text-[var(--color-accent-sage)] prose-strong:text-[var(--color-primary-dark)] max-w-none">
        <ReactMarkdown>{fiche.content || ""}</ReactMarkdown>
      </article>
    </div>
  );
}