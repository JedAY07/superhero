import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      email,
      password: hashed,
      role: role ?? "editor"
    });

    res.status(201).json({ id: user._id, email: user.email, role: user.role });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign({ id: user._id, role: user.role }, secret, {
      expiresIn: "1h"
    });

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
