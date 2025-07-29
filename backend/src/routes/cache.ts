import { Router, Request, Response } from "express";
import { DogApiService } from "../services/dogApi";
import { cacheService } from "../services/cacheService";

const router = Router();
const dogApiService = new DogApiService();

/**
 * GET /api/cache/stats
 * Get cache statistics
 */
router.get("/stats", (req: Request, res: Response) => {
  try {
    const stats = cacheService.getStats();
    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting cache stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get cache statistics",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/cache/clear
 * Clear all cache
 */
router.post("/clear", (req: Request, res: Response) => {
  try {
    const { breed } = req.body;
    
    if (breed) {
      dogApiService.clearCache(breed);
      res.json({
        success: true,
        message: `Cache cleared for breed: ${breed}`,
        timestamp: new Date().toISOString(),
      });
    } else {
      dogApiService.clearCache();
      res.json({
        success: true,
        message: "All cache cleared",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error clearing cache:", error);
    res.status(500).json({
      success: false,
      error: "Failed to clear cache",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/cache/cleanup
 * Clean up expired cache entries
 */
router.post("/cleanup", (req: Request, res: Response) => {
  try {
    const deletedCount = cacheService.cleanup();
    res.json({
      success: true,
      message: `Cleaned up ${deletedCount} expired cache entries`,
      deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error cleaning up cache:", error);
    res.status(500).json({
      success: false,
      error: "Failed to cleanup cache",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router; 