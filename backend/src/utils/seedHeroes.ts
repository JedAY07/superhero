import "dotenv/config";
import fs from "fs";
import path from "path";
import { connectDB } from "../config/db";
import { Hero } from "../models/Hero";

type RawHero = {
  id: number;
  name: string;
  slug: string;
  powerstats?: Record<string, number>;
  biography?: {
    fullName?: string;
    publisher?: string;
    firstAppearance?: string;
  };
};

const mapUnivers = (publisher?: string): "Marvel" | "DC" | "Autre" => {
  if (!publisher) return "Autre";
  if (publisher.toLowerCase().includes("marvel")) return "Marvel";
  if (publisher.toLowerCase().includes("dc")) return "DC";
  return "Autre";
};

const seed = async () => {
  try {
    await connectDB();

    const filePath = path.join(__dirname, "SuperHerosComplet.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(raw) as { superheros: RawHero[] } | RawHero[];

    const rawHeroes = Array.isArray(json)
      ? json
      : Array.isArray(json.superheros)
      ? json.superheros
      : [];

    const docs = rawHeroes.map((h) => {
      const pouvoirs =
        h.powerstats
          ? Object.entries(h.powerstats).map(
              ([k, v]) => `${k}: ${v}`
            )
          : [];

      return {
        nom: h.name,
        alias: h.biography?.fullName || undefined,
        univers: mapUnivers(h.biography?.publisher),
        pouvoirs,
        description: h.biography?.firstAppearance || "",
        // on laisse vide pour l'instant, les uploads d'images rempliront ça
        imageUrl: undefined
      };
    });

    await Hero.deleteMany({});
    await Hero.insertMany(docs);

    console.log("✅ Héros importés :", docs.length);
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur import:", error);
    process.exit(1);
  }
};

seed();
