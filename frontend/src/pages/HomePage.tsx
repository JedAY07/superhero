import { useEffect, useState } from "react";
import { fetchHeroes } from "../api/heroesApi";
import { Hero } from "../types/hero";
import HeroCard from "../components/HeroCard";

export default function HomePage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [search, setSearch] = useState("");
  const [univers, setUnivers] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHeroes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHeroes({
        q: search || undefined,
        univers: univers || undefined
      });
      setHeroes(data);
    } catch (err: any) {
      setError("Erreur lors du chargement des héros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeroes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadHeroes();
  };

  return (
    <div>
      <h1>Catalogue des super-héros</h1>
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}
      >
        <input
          placeholder="Rechercher par nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={univers} onChange={(e) => setUnivers(e.target.value)}>
          <option value="">Tous les univers</option>
          <option value="Marvel">Marvel</option>
          <option value="DC">DC</option>
          <option value="Autre">Autre</option>
        </select>
        <button type="submit">Rechercher</button>
      </form>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        {heroes.map((hero) => (
          <HeroCard key={hero._id} hero={hero} />
        ))}
      </div>
    </div>
  );
}
