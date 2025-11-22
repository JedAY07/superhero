import React, { useState } from "react";
import { Hero } from "../types/hero";

interface HeroFormProps {
  initialHero?: Hero | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
}

const HeroForm: React.FC<HeroFormProps> = ({ initialHero, onSubmit, onCancel }) => {
  const [nom, setNom] = useState(initialHero?.nom ?? "");
  const [alias, setAlias] = useState(initialHero?.alias ?? "");
  const [univers, setUnivers] = useState<"Marvel" | "DC" | "Autre">(initialHero?.univers ?? "Marvel");
  const [pouvoirs, setPouvoirs] = useState((initialHero?.pouvoirs ?? []).join(", "));
  const [description, setDescription] = useState(initialHero?.description ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("nom", nom);
      fd.append("alias", alias);
      fd.append("univers", univers);
      fd.append("pouvoirs", pouvoirs);
      fd.append("description", description);
      if (imageFile) {
        fd.append("image", imageFile);
      }
      await onSubmit(fd);
      if (!initialHero) {
        // reset only when creating
        setNom("");
        setAlias("");
        setUnivers("Marvel");
        setPouvoirs("");
        setDescription("");
        setImageFile(null);
      }
    } catch (err: any) {
      setError(err?.message ?? "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <h3>{initialHero ? "Modifier un héros" : "Créer un héros"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label>
        Nom :
        <input value={nom} onChange={(e) => setNom(e.target.value)} required />
      </label>
      <label>
        Alias :
        <input value={alias} onChange={(e) => setAlias(e.target.value)} />
      </label>
      <label>
        Univers :
        <select value={univers} onChange={(e) => setUnivers(e.target.value as any)}>
          <option value="Marvel">Marvel</option>
          <option value="DC">DC</option>
          <option value="Autre">Autre</option>
        </select>
      </label>
      <label>
        Pouvoirs (séparés par des virgules) :
        <input
          value={pouvoirs}
          onChange={(e) => setPouvoirs(e.target.value)}
          placeholder="force, vitesse, intelligence"
        />
      </label>
      <label>
        Description :
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </label>
      <label>
        Image :
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit" disabled={loading}>
          {loading ? "En cours..." : "Enregistrer"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default HeroForm;
