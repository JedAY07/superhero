import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchHeroById } from "../api/heroesApi";
import { Hero } from "../types/hero";

export default function HeroDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await fetchHeroById(id);
        setHero(data);
      } catch (err) {
        setError("Erreur lors du chargement du héros");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!hero) return <p>Héros introuvable</p>;

  return (
    <div>
      <h1>{hero.nom}</h1>
      {hero.alias && <h3>{hero.alias}</h3>}
      {hero.imageUrl && (
        <img
          src={`http://localhost:4000${hero.imageUrl}`}
          alt={hero.nom}
          style={{ maxWidth: "300px", borderRadius: "8px" }}
        />
      )}
      <p>
        <strong>Univers :</strong> {hero.univers}
      </p>
      {hero.description && (
        <p>
          <strong>Description :</strong> {hero.description}
        </p>
      )}
      {hero.pouvoirs?.length > 0 && (
        <div>
          <strong>Pouvoirs :</strong>
          <ul>
            {hero.pouvoirs.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
