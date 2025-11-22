export interface Hero {
  _id: string;
  nom: string;
  alias?: string;
  univers: "Marvel" | "DC" | "Autre";
  pouvoirs: string[];
  description?: string;
  imageUrl?: string;
}
