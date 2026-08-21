import FichesCard from "../components/forum/FichesCard";
import { FICHES_DATA } from "../data/fichesData";

export default function Resources() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="page-title">
        Toutes les fiches
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {FICHES_DATA.map((fiche, index) => (
          <FichesCard key={fiche.id} item={fiche} index={index} />
        ))}
      </div>
    </div>
  );
}