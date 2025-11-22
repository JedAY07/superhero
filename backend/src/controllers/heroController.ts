import { Request, Response } from "express";
import { Hero } from "../models/Hero";

export const getHeroes = async (req: Request, res: Response) => {
  try {
    const { univers, q } = req.query;

    const filter: any = {};
    if (univers && typeof univers === "string") {
      filter.univers = univers;
    }
    if (q && typeof q === "string") {
      filter.nom = { $regex: q, $options: "i" };
    }

    const heroes = await Hero.find(filter).sort({ nom: 1 });
    res.json(heroes);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getHeroById = async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: "Héros non trouvé" });
    }
    res.json(hero);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const createHero = async (req: Request, res: Response) => {
  try {
    const { nom, alias, univers, pouvoirs, description } = req.body;

    const imageUrl = req.file
      ? `/${process.env.UPLOAD_DIR}/${req.file.filename}`
      : undefined;

    const hero = await Hero.create({
      nom,
      alias,
      univers,
      pouvoirs: Array.isArray(pouvoirs)
        ? pouvoirs
        : typeof pouvoirs === "string"
        ? pouvoirs.split(",").map((p) => p.trim())
        : [],
      description,
      imageUrl
    });

    res.status(201).json(hero);
  } catch {
    res.status(400).json({ message: "Données invalides" });
  }
};

export const updateHero = async (req: Request, res: Response) => {
  try {
    const { nom, alias, univers, pouvoirs, description } = req.body;

    const updates: any = {
      nom,
      alias,
      univers,
      description
    };

    if (pouvoirs) {
      updates.pouvoirs = Array.isArray(pouvoirs)
        ? pouvoirs
        : typeof pouvoirs === "string"
        ? pouvoirs.split(",").map((p) => p.trim())
        : [];
    }

    if (req.file) {
      updates.imageUrl = `/${process.env.UPLOAD_DIR}/${req.file.filename}`;
    }

    const hero = await Hero.findByIdAndUpdate(req.params.id, updates, {
      new: true
    });

    if (!hero) {
      return res.status(404).json({ message: "Héros non trouvé" });
    }

    res.json(hero);
  } catch {
    res.status(400).json({ message: "Données invalides" });
  }
};

export const deleteHero = async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: "Héros non trouvé" });
    }
    res.json({ message: "Héros supprimé" });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
