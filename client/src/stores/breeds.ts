import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  breedsApi,
  favoritesApi,
  type DogBreed,
  type DogBreedImages,
  type FavoriteBreed,
} from '@/services/api'

export const useBreedsStore = defineStore('breeds', () => {
  // State
  const breeds = ref<DogBreed[]>([])
  const favorites = ref<FavoriteBreed[]>([])
  const breedImages = ref<Record<string, string[]>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const favoriteBreeds = computed(() => {
    return favorites.value.map((fav) => fav.breed)
  })

  const isFavorite = computed(() => {
    return (breedName: string) => favoriteBreeds.value.includes(breedName)
  })

  const breedsWithFavorites = computed(() => {
    return breeds.value.map((breed) => ({
      ...breed,
      isFavorite: isFavorite.value(breed.name),
    }))
  })

  // Actions
  const fetchBreeds = async () => {
    console.log('🔄 fetchBreeds: Starting to fetch breeds...')
    loading.value = true
    error.value = null

    try {
      console.log('🔄 fetchBreeds: Calling breedsApi.getAllBreeds()...')
      const result = await breedsApi.getAllBreeds()
      console.log('✅ fetchBreeds: Successfully fetched breeds:', result.length, 'breeds')
      breeds.value = result
    } catch (err) {
      console.error('❌ fetchBreeds: Error fetching breeds:', err)
      error.value = 'Failed to fetch dog breeds. Please try again.'
    } finally {
      console.log('🏁 fetchBreeds: Setting loading to false')
      loading.value = false
    }
  }

  const fetchBreedImages = async (breed: string) => {
    if (breedImages.value[breed]) {
      return breedImages.value[breed]
    }

    try {
      const response = await breedsApi.getBreedImages(breed)
      breedImages.value[breed] = response.images
      return response.images
    } catch (err) {
      error.value = `Failed to fetch images for ${breed}. Please try again.`
      console.error(`Error fetching images for ${breed}:`, err)
      throw err
    }
  }

  const fetchBreedImage = async (breed: string) => {
    try {
      const images = await fetchBreedImages(breed)
      return images && images.length > 0 ? images[0] : null
    } catch (err) {
      console.error(`Error fetching single image for ${breed}:`, err)
      return null
    }
  }

  const fetchFavorites = async () => {
    try {
      favorites.value = await favoritesApi.getFavorites()
    } catch (err) {
      error.value = 'Failed to fetch favorites. Please try again.'
      console.error('Error fetching favorites:', err)
    }
  }

  const addToFavorites = async (breed: string) => {
    console.log('🔍 addToFavorites called with breed:', breed)
    try {
      const newFavorite = await favoritesApi.addFavorite(breed)
      console.log('✅ addToFavorites success:', newFavorite)
      favorites.value.push(newFavorite)
    } catch (err) {
      error.value = `Failed to add ${breed} to favorites. Please try again.`
      console.error(`Error adding ${breed} to favorites:`, err)
      throw err
    }
  }

  const removeFromFavorites = async (breed: string) => {
    try {
      await favoritesApi.removeFavorite(breed)
      favorites.value = favorites.value.filter((fav) => fav.breed !== breed)
    } catch (err) {
      error.value = `Failed to remove ${breed} from favorites. Please try again.`
      console.error(`Error removing ${breed} from favorites:`, err)
      throw err
    }
  }

  const toggleFavorite = async (breed: string) => {
    try {
      if (isFavorite.value(breed)) {
        await removeFromFavorites(breed)
      } else {
        await addToFavorites(breed)
      }
    } catch (err) {
      // Error is already set in the individual methods
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearBreedImages = () => {
    breedImages.value = {}
  }

  return {
    // State
    breeds,
    favorites,
    breedImages,
    loading,
    error,

    // Getters
    favoriteBreeds,
    isFavorite,
    breedsWithFavorites,

    // Actions
    fetchBreeds,
    fetchBreedImages,
    fetchBreedImage,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearError,
    clearBreedImages,
  }
})
