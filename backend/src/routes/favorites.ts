import { Router, Request, Response } from "express";
import { FavoritesService } from "../services/favoritesService";

const router = Router();
const favoritesService = new FavoritesService();

/**
 * GET /api/favorites
 * Get all favorite breeds
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const favorites = await favoritesService.getFavorites();
    res.json(favorites);
  } catch (error) {
    console.error("Error in GET /api/favorites:", error);
    res.status(500).json({
      error: "Failed to fetch favorites",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/favorites
 * Add a breed to favorites
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { breed } = req.body;

    if (!breed || typeof breed !== "string" || breed.trim() === "") {
      return res.status(400).json({
        error: "Breed is required and must be a non-empty string",
      });
    }

    const favorite = await favoritesService.addFavorite(breed.trim());
    res.status(201).json(favorite);
  } catch (error) {
    console.error("Error in POST /api/favorites:", error);

    if (
      error instanceof Error &&
      error.message.includes("already in favorites")
    ) {
      return res.status(409).json({
        error: "Breed already in favorites",
        message: error.message,
      });
    }

    res.status(500).json({
      error: "Failed to add favorite",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * DELETE /api/favorites/:breed
 * Remove a breed from favorites
 */
router.delete("/:breed", async (req: Request, res: Response) => {
  try {
    const { breed } = req.params;

    if (!breed || breed.trim() === "") {
      return res.status(400).json({
        error: "Breed parameter is required",
      });
    }

    await favoritesService.removeFavorite(breed.trim());
    res.status(204).send();
  } catch (error) {
    console.error(`Error in DELETE /api/favorites/${req.params.breed}:`, error);

    if (
      error instanceof Error &&
      error.message.includes("not found in favorites")
    ) {
      return res.status(404).json({
        error: "Breed not found in favorites",
        message: error.message,
      });
    }

    res.status(500).json({
      error: "Failed to remove favorite",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
