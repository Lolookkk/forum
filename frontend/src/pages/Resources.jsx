import FichesCard from "../components/forum/FichesCard";
import { useEffect, useState } from "react";
import { getFiches } from "../services/ficheService";


export default function Resources() {
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFiches = () => {
      getFiches()
        .then((data) => setFiches(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    };
  
    useEffect(() => {
      loadFiches();
    }, []);

    if (loading) return <p className="text-center py-8">Chargement des fiches...</p>;
    if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <h1 className="page-title">
        Toutes les fiches
      </h1>
      {!loading && !error && fiches.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {fiches.map((fiche) => (
          <FichesCard key={fiche.id} item={fiche} />
        ))}
      </div>
      )}
    </div>
  );
}