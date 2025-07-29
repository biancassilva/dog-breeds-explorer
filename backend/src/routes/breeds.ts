import { Router, Request, Response } from "express";
import { DogApiService } from "../services/dogApi";

const router = Router();
const dogApiService = new DogApiService();

/**
 * GET /api/breeds
 * Get all dog breeds
 */
router.get("/", async (req: Request, res: Response) => {
  console.log("🔄 Starting to fetch all dog breeds...");
  const startTime = Date.now();

  try {
    const breeds = await dogApiService.getAllBreeds();
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(
      `✅ Successfully fetched ${breeds.length} breeds in ${duration}ms`
    );

    res.json({
      breeds,
      count: breeds.length,
      duration: `${duration}ms`,
    });
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.error(`❌ Error in GET /api/breeds after ${duration}ms:`, error);
    res.status(500).json({
      error: "Failed to fetch dog breeds",
      message: error instanceof Error ? error.message : "Unknown error",
      duration: `${duration}ms`,
    });
  }
});

/**
 * GET /api/breeds/:breed/images
 * Get images for a specific breed
 */
router.get("/:breed/images", async (req: Request, res: Response) => {
  try {
    const { breed } = req.params;
    const count = req.query.count ? parseInt(req.query.count as string) : 3;

    // Validate count parameter
    if (isNaN(count) || count < 1 || count > 10) {
      return res.status(400).json({
        error: "Invalid count parameter. Must be a number between 1 and 10.",
      });
    }

    const images = await dogApiService.getBreedImages(breed, count);
    res.json(images);
  } catch (error) {
    console.error(
      `Error in GET /api/breeds/${req.params.breed}/images:`,
      error
    );
    res.status(500).json({
      error: "Failed to fetch breed images",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
