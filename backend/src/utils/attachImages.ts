import "dotenv/config";
import fs from "fs";
import path from "path";
import { connectDB } from "../config/db";
import { Hero } from "../models/Hero";

type RawHero = {
  name: string;
  slug?: string;
  images?: {
    lg?: string;
    md?: string;
    sm?: string;
    xs?: string;
  };
};

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const run = async () => {
  try {
    await connectDB();

    const jsonPath = path.join(__dirname, "SuperHerosComplet.json");
    const raw = fs.readFileSync(jsonPath, "utf-8");
    const parsed = JSON.parse(raw) as { superheros?: RawHero[] } | RawHero[];
    const rawHeroes = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.superheros)
      ? parsed.superheros
      : [];

    // IMAGE_SOURCES can be set in .env as comma-separated list, e.g. "lg,md,sm,xs"
    // Default priority: lg -> md -> sm -> xs
    const envSources = process.env.IMAGE_SOURCES;
    const defaultSources = ["lg", "md", "sm", "xs"];
    const sources = envSources ? envSources.split(",").map((s) => s.trim()) : defaultSources;

    const backendRoot = path.join(__dirname, "..", "..");
    const repoRoot = path.join(__dirname, "..", "..", "..");

    // prefer to find image source folders at repo root (project root) if present,
    // otherwise look in backend root. Uploads always go into backend/uploads.
    const baseRoot = fs.existsSync(path.join(repoRoot, sources[0])) ? repoRoot : backendRoot;
    const uploadsRoot = path.join(backendRoot, "uploads");

    let updated = 0;
    let copied = 0;
    let triedNoFile = 0;

    for (const h of rawHeroes) {
      const heroName = h.name;
      const imgRel = h.images?.lg || h.images?.md || h.images?.sm || h.images?.xs;
      if (!imgRel) continue;

      let found = false;
      const filename = path.basename(imgRel);
      for (const srcFolder of sources) {
        // try two candidate locations to be flexible with folder layouts:
        // 1) folder + full relative (e.g. lg/lg/1-a-bomb.jpg or images/lg/1-a-bomb.jpg)
        // 2) folder + basename (e.g. lg/1-a-bomb.jpg)
        const candidates = [
          path.join(baseRoot, srcFolder, imgRel),
          path.join(baseRoot, srcFolder, filename)
        ];

        let selectedSrc: string | null = null;
        let destRel: string | null = null;
        for (const cand of candidates) {
          if (fs.existsSync(cand)) {
            selectedSrc = cand;
            // decide destination relative path inside uploads
            // if candidate used the subfolder (contains path.sep + filename), preserve that segment if possible
            if (cand.endsWith(filename)) {
              // dest relative should be srcFolder/filename if candidate was folder/filename,
              // or preserve original imgRel if we used that.
              if (cand === path.join(baseRoot, srcFolder, imgRel)) {
                destRel = imgRel;
              } else {
                destRel = path.join(srcFolder, filename);
              }
            } else {
              destRel = path.join(srcFolder, filename);
            }
            break;
          }
        }

        if (selectedSrc && destRel) {
          const dest = path.join(uploadsRoot, destRel);
          const destDir = path.dirname(dest);
          if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
          fs.copyFileSync(selectedSrc, dest);
          copied++;

          const imageUrl = `/${path.posix.join("uploads", destRel.replace(/\\/g, "/"))}`;

          // try to find hero by exact name, then case-insensitive
          let res = await Hero.findOneAndUpdate({ nom: heroName }, { imageUrl }, { new: true });
          if (!res) {
            const regex = new RegExp(`^${escapeRegex(heroName)}$`, "i");
            res = await Hero.findOneAndUpdate({ nom: regex }, { imageUrl }, { new: true });
          }

          if (res) updated++;
          found = true;
          break; // stop searching sources for this hero
        }
      }

      if (!found) triedNoFile++;
    }

    console.log(`✅ Images copiées: ${copied}, héros mis à jour: ${updated}, sans fichier trouvé: ${triedNoFile}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur:", err);
    process.exit(1);
  }
};

run();
