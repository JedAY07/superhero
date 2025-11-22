import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Hero } from "../types/hero";
import { createHero, deleteHero, fetchHeroes, updateHero } from "../api/heroesApi";
import HeroForm from "../components/HeroForm";

export default function AdminPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const loadHeroes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHeroes();
      setHeroes(data);
    } catch (err) {
      setError("Erreur lors du chargement des héros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeroes();
  }, []);

  if (!token || !user) {
    return <p>Redirection vers la page de connexion...</p>;
  }

  const handleCreate = async (fd: FormData) => {
    if (!token) return;
    await createHero(fd, token);
    await loadHeroes();
  };

  const handleUpdate = async (fd: FormData) => {
    if (!token || !selectedHero) return;
    await updateHero(selectedHero._id, fd, token);
    setSelectedHero(null);
    await loadHeroes();
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Supprimer ce héros ?")) return;
    await deleteHero(id, token);
    await loadHeroes();
  };

  return (
    <div>
      <h1>Administration des héros</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          alignItems: "flex-start"
        }}
      >
        <div>
          <HeroForm
            initialHero={selectedHero}
            onSubmit={selectedHero ? handleUpdate : handleCreate}
            onCancel={() => setSelectedHero(null)}
          />
        </div>
        <div>
          <h3>Liste des héros ({heroes.length})</h3>
          {loading && <p>Chargement...</p>}
          <ul style={{ listStyle: "none", padding: 0, maxHeight: "500px", overflowY: "auto" }}>
            {heroes.map((h) => (
              <li
                key={h._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.25rem 0",
                  borderBottom: "1px solid #eee"
                }}
              >
                <span>
                  <strong>{h.nom}</strong> {h.alias && `(${h.alias})`} - {h.univers}
                </span>
                <span style={{ display: "flex", gap: "0.25rem" }}>
                  <button type="button" onClick={() => setSelectedHero(h)}>
                    Modifier
                  </button>
                  <button type="button" onClick={() => handleDelete(h._id)}>
                    Supprimer
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
