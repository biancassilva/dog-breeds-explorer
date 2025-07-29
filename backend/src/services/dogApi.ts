import axios from "axios";
import { DogAPIResponse, BreedsListResponse, DogBreed } from "../types";
import { cacheService } from "./cacheService";

const DOG_API_BASE_URL = process.env.DOG_API_BASE_URL;

// Configure axios with timeout
const apiClient = axios.create({
  timeout: 10000, // 10 second timeout
  headers: {
    "User-Agent": "Dog-Breeds-Explorer/1.0",
  },
});

// Cache TTL constants
const CACHE_TTL = {
  BREEDS_LIST: 60 * 60 * 1000, // 1 hour - breeds list doesn't change often
  BREED_IMAGES: 30 * 60 * 1000, // 30 minutes - images can be refreshed
  SINGLE_IMAGE: 15 * 60 * 1000, // 15 minutes - single images
};

export class DogApiService {
  /**
   * Fetch all dog breeds from the Dog CEO API with caching
   * @returns Promise<DogBreed[]> Array of breed objects
   */
  async getAllBreeds(): Promise<DogBreed[]> {
    const cacheKey = "all_breeds_with_images";

    // Try to get from cache first
    const cached = cacheService.get<DogBreed[]>(cacheKey);
    if (cached) {
      console.log("📦 Returning cached breeds data");
      return cached;
    }

    console.log("🔄 Fetching fresh breeds data from API");

    try {
      const response = await apiClient.get<BreedsListResponse>(
        `${DOG_API_BASE_URL}/breeds/list/all`
      );

      if (response.data.status !== "success") {
        throw new Error("Failed to fetch breeds from Dog CEO API");
      }

      // Extract breed names from the nested object structure
      const breeds: DogBreed[] = [];
      const breedsData = response.data.message;
      const breedPromises: Promise<void>[] = [];

      for (const [breed, subBreeds] of Object.entries(breedsData)) {
        // Get a default image for the main breed
        const mainBreedPromise = this.fetchBreedImage(breed)
          .then((imageUrl) => {
            breeds.push({ name: breed, image: imageUrl });
          })
          .catch(() => {
            breeds.push({ name: breed });
          });
        breedPromises.push(mainBreedPromise);

        // Add sub-breeds if they exist
        if (subBreeds && subBreeds.length > 0) {
          for (const subBreed of subBreeds) {
            const subBreedPromise = this.fetchBreedImage(`${breed}/${subBreed}`)
              .then((imageUrl) => {
                breeds.push({ name: `${breed}-${subBreed}`, image: imageUrl });
              })
              .catch(() => {
                breeds.push({ name: `${breed}-${subBreed}` });
              });
            breedPromises.push(subBreedPromise);
          }
        }
      }

      // Wait for all image requests to complete (with timeout)
      await Promise.allSettled(breedPromises);

      const sortedBreeds = breeds.sort((a, b) => a.name.localeCompare(b.name));

      // Cache the result
      cacheService.set(cacheKey, sortedBreeds, CACHE_TTL.BREEDS_LIST);
      console.log(
        `✅ Cached ${sortedBreeds.length} breeds for ${
          CACHE_TTL.BREEDS_LIST / 60000
        } minutes`
      );

      return sortedBreeds;
    } catch (error) {
      console.error("Error fetching breeds:", error);
      throw new Error("Failed to fetch dog breeds");
    }
  }

  /**
   * Fetch a single breed image with caching and error handling
   * @param breedPath The breed path (e.g., "labrador" or "labrador/golden")
   * @returns Promise<string> Image URL or empty string on error
   */
  private async fetchBreedImage(breedPath: string): Promise<string> {
    const cacheKey = `breed_image_${breedPath}`;

    // Try to get from cache first
    const cached = cacheService.get<string>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get<DogAPIResponse>(
        `${DOG_API_BASE_URL}/breed/${breedPath}/images/random/1`
      );

      if (response.data.status === "success") {
        const imageUrl = Array.isArray(response.data.message)
          ? response.data.message[0]
          : response.data.message;

        // Cache the result
        cacheService.set(cacheKey, imageUrl, CACHE_TTL.SINGLE_IMAGE);

        return imageUrl;
      }
      return "";
    } catch (error) {
      console.warn(`Failed to fetch image for breed ${breedPath}:`, error);
      return "";
    }
  }

  /**
   * Fetch random images for a specific breed with caching
   * @param breed The breed name
   * @param count Number of images to fetch (default: 3)
   * @returns Promise<string[]> Array of image URLs
   */
  async getBreedImages(breed: string, count: number = 3): Promise<string[]> {
    const cacheKey = `breed_images_${breed}_${count}`;

    // Try to get from cache first
    const cached = cacheService.get<string[]>(cacheKey);
    if (cached) {
      console.log(`📦 Returning cached images for ${breed} (${count} images)`);
      return cached;
    }

    console.log(`🔄 Fetching fresh images for ${breed} (${count} images)`);

    try {
      const response = await apiClient.get<DogAPIResponse>(
        `${DOG_API_BASE_URL}/breed/${breed}/images/random/${count}`
      );

      if (response.data.status !== "success") {
        throw new Error(`Failed to fetch images for breed: ${breed}`);
      }

      // Handle both single image and multiple images response
      const images = Array.isArray(response.data.message)
        ? response.data.message
        : [response.data.message];

      // Cache the result
      cacheService.set(cacheKey, images, CACHE_TTL.BREED_IMAGES);
      console.log(
        `✅ Cached ${images.length} images for ${breed} for ${
          CACHE_TTL.BREED_IMAGES / 60000
        } minutes`
      );

      return images;
    } catch (error) {
      console.error(`Error fetching images for breed ${breed}:`, error);
      throw new Error(`Failed to fetch images for breed: ${breed}`);
    }
  }

  /**
   * Clear cache for specific breed or all cache
   * @param breed Optional breed name to clear specific cache
   */
  clearCache(breed?: string): void {
    if (breed) {
      // Clear specific breed cache
      cacheService.delete(`breed_image_${breed}`);
      cacheService.delete(`breed_images_${breed}_3`);
      cacheService.delete(`breed_images_${breed}_1`);
      console.log(`🗑️ Cleared cache for breed: ${breed}`);
    } else {
      // Clear all cache
      cacheService.clear();
      console.log("🗑️ Cleared all cache");
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return cacheService.getStats();
  }
}
