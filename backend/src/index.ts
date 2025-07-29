import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import breedsRoutes from "./routes/breeds";
import favoritesRoutes from "./routes/favorites";
import cacheRoutes from "./routes/cache";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://dog-breeds-explorer.vercel.app"]
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

// Logging middleware
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Set timeout for all requests (30 seconds)
app.use((req, res, next) => {
  req.setTimeout(30000);
  res.setTimeout(30000);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use("/api/breeds", breedsRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/cache", cacheRoutes);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dog Breeds API server running on port ${PORT}`);
  console.log(`📖 API Documentation:`);
  console.log(`   GET  /api/breeds - Get all dog breeds`);
  console.log(`   GET  /api/breeds/:breed/images - Get images for a breed`);
  console.log(`   GET  /api/favorites - Get favorite breeds`);
  console.log(`   POST /api/favorites - Add a breed to favorites`);
  console.log(
    `   DELETE /api/favorites/:breed - Remove a breed from favorites`
  );
  console.log(`   GET  /api/cache/stats - Get cache statistics`);
  console.log(`   POST /api/cache/clear - Clear cache`);
  console.log(`   POST /api/cache/cleanup - Clean up expired cache entries`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

export default app;
