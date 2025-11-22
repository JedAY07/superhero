import { Schema, model, Document } from "mongoose";

export interface IHero extends Document {
  nom: string;
  alias?: string;
  univers: "Marvel" | "DC" | "Autre";
  pouvoirs: string[];
  description?: string;
  imageUrl?: string;
}

const heroSchema = new Schema<IHero>(
  {
    nom: { type: String, required: true },
    alias: { type: String },
    univers: { type: String, enum: ["Marvel", "DC", "Autre"], required: true },
    pouvoirs: { type: [String], default: [] },
    description: { type: String },
    imageUrl: { type: String }
  },
  { timestamps: true }
);

export const Hero = model<IHero>("Hero", heroSchema);
