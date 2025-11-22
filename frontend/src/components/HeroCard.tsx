import { Link } from "react-router-dom";
import { Hero } from "../types/hero";

interface Props {
  hero: Hero;
}

export default function HeroCard({ hero }: Props) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "0.75rem",
        width: "220px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      {hero.imageUrl && (
        <img
          src={`http://localhost:4000${hero.imageUrl}`}
          alt={hero.nom}
          style={{ width: "100%", borderRadius: "4px", marginBottom: "0.5rem" }}
        />
      )}
      <h3 style={{ margin: "0 0 0.25rem" }}>{hero.nom}</h3>
      {hero.alias && <p style={{ margin: "0 0 0.25rem", fontStyle: "italic" }}>{hero.alias}</p>}
      <p style={{ margin: 0, fontSize: "0.9rem" }}>Univers : {hero.univers}</p>
      <Link to={`/hero/${hero._id}`} style={{ fontSize: "0.9rem" }}>
        Voir le détail
      </Link>
    </div>
  );
}
