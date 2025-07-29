import fs from "fs/promises";
import path from "path";
import { FavoriteBreed } from "../types";
import { DogApiService } from "./dogApi";

const FAVORITES_FILE_PATH = path.join(__dirname, "../../data/favorites.json");
const dogApiService = new DogApiService();

export class FavoritesService {
  /**
   * Ensure the data directory and favorites file exist
   */
  private async ensureDataFile(): Promise<void> {
    const dataDir = path.dirname(FAVORITES_FILE_PATH);

    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    try {
      await fs.access(FAVORITES_FILE_PATH);
    } catch {
      // Create empty favorites file if it doesn't exist
      await fs.writeFile(FAVORITES_FILE_PATH, JSON.stringify([], null, 2));
    }
  }

  /**
   * Read favorites from the JSON file
   */
  private async readFavorites(): Promise<FavoriteBreed[]> {
    await this.ensureDataFile();
    const data = await fs.readFile(FAVORITES_FILE_PATH, "utf-8");
    return JSON.parse(data);
  }

  /**
   * Write favorites to the JSON file
   */
  private async writeFavorites(favorites: FavoriteBreed[]): Promise<void> {
    await this.ensureDataFile();
    await fs.writeFile(FAVORITES_FILE_PATH, JSON.stringify(favorites, null, 2));
  }

  /**
   * Fetch breed image from Dog API
   */
  private async fetchBreedImage(breed: string): Promise<string | null> {
    try {
      const images = await dogApiService.getBreedImages(breed, 1);
      return images.length > 0 ? images[0] : null;
    } catch (error) {
      console.warn(`Failed to fetch image for breed ${breed}:`, error);
      return null;
    }
  }

  /**
   * Get all favorite breeds with images
   */
  async getFavorites(): Promise<FavoriteBreed[]> {
    try {
      const favorites = await this.readFavorites();

      // Fetch images for all favorites concurrently
      const favoritesWithImages = await Promise.all(
        favorites.map(async (favorite) => {
          try {
            const image = await this.fetchBreedImage(favorite.breed);
            return {
              ...favorite,
              image: image || undefined,
            };
          } catch (error) {
            console.warn(`Failed to fetch image for ${favorite.breed}:`, error);
            return favorite;
          }
        })
      );

      return favoritesWithImages;
    } catch (error) {
      console.error("Error reading favorites:", error);
      return [];
    }
  }

  /**
   * Add a breed to favorites
   */
  async addFavorite(breed: string): Promise<FavoriteBreed> {
    try {
      const favorites = await this.readFavorites();

      // Check if breed is already in favorites
      const existingFavorite = favorites.find(
        (fav) => fav.breed.toLowerCase() === breed.toLowerCase()
      );
      if (existingFavorite) {
        throw new Error(`Breed ${breed} is already in favorites`);
      }

      // Fetch breed image
      const image = await this.fetchBreedImage(breed);

      const newFavorite: FavoriteBreed = {
        breed: breed.toLowerCase(),
        addedAt: new Date().toISOString(),
        image: image || undefined,
      };

      favorites.push(newFavorite);
      await this.writeFavorites(favorites);

      return newFavorite;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  }

  /**
   * Remove a breed from favorites
   */
  async removeFavorite(breed: string): Promise<boolean> {
    try {
      const favorites = await this.readFavorites();
      const initialLength = favorites.length;

      const filteredFavorites = favorites.filter(
        (fav) => fav.breed.toLowerCase() !== breed.toLowerCase()
      );

      if (filteredFavorites.length === initialLength) {
        throw new Error(`Breed ${breed} not found in favorites`);
      }

      await this.writeFavorites(filteredFavorites);

      // Clear cache for this breed since it's no longer in favorites
      dogApiService.clearCache(breed);

      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  }

  /**
   * Check if a breed is in favorites
   */
  async isFavorite(breed: string): Promise<boolean> {
    try {
      const favorites = await this.readFavorites();
      return favorites.some(
        (fav) => fav.breed.toLowerCase() === breed.toLowerCase()
      );
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  }
}
