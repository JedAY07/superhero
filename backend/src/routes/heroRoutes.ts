import { Router } from "express";
import {
  getHeroes,
  getHeroById,
  createHero,
  updateHero,
  deleteHero
} from "../controllers/heroController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import { uploadMiddleware } from "../middleware/uploadMiddleware";

const router = Router();

// Public
router.get("/", getHeroes);
router.get("/:id", getHeroById);

// Protégé
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  uploadMiddleware.single("image"),
  createHero
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  uploadMiddleware.single("image"),
  updateHero
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteHero
);

export default router;
