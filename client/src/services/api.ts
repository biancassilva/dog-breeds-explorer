import axios from 'axios'

// Types matching the backend
export interface DogBreed {
  name: string
  image?: string
}

export interface DogImage {
  url: string
}

export interface DogBreedImages {
  breed: string
  images: string[]
}

export interface FavoriteBreed {
  breed: string
  addedAt: string
  image?: string
}

export interface ApiError {
  message: string
  status: number
}

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

// Breeds API
export const breedsApi = {
  // Get all dog breeds
  async getAllBreeds(): Promise<DogBreed[]> {
    try {
      console.log('🔄 getAllBreeds: Making API request...')
      const response = await api.get('/breeds')
      console.log('✅ getAllBreeds: Received response:', response.data)

      // Handle new response structure with breeds, count, and duration
      if (response.data.breeds) {
        console.log(
          '✅ getAllBreeds: Using new response structure, returning',
          response.data.breeds.length,
          'breeds',
        )
        return response.data.breeds
      }
      // Fallback to old structure for backward compatibility
      console.log(
        '✅ getAllBreeds: Using old response structure, returning',
        response.data.length,
        'breeds',
      )
      return response.data
    } catch (error) {
      console.error('❌ getAllBreeds: Failed to fetch breeds:', error)
      throw error
    }
  },

  // Get images for a specific breed
  async getBreedImages(breed: string): Promise<DogBreedImages> {
    try {
      const response = await api.get(`/breeds/${encodeURIComponent(breed)}/images`)
      // The backend returns an array of image URLs directly
      const images = Array.isArray(response.data) ? response.data : [response.data]
      return {
        breed,
        images,
      }
    } catch (error) {
      console.error(`Failed to fetch images for breed ${breed}:`, error)
      throw error
    }
  },
}

// Favorites API
export const favoritesApi = {
  // Get all favorite breeds
  async getFavorites(): Promise<FavoriteBreed[]> {
    try {
      const response = await api.get('/favorites')
      return response.data
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
      throw error
    }
  },

  // Add a breed to favorites
  async addFavorite(breed: string): Promise<FavoriteBreed> {
    try {
      console.log('🔍 addFavorite called with breed:', breed)
      console.log('🔍 Request payload:', { breed })
      const response = await api.post('/favorites', { breed })
      console.log('✅ addFavorite response:', response.data)
      return response.data
    } catch (error) {
      console.error(`Failed to add ${breed} to favorites:`, error)
      throw error
    }
  },

  // Remove a breed from favorites
  async removeFavorite(breed: string): Promise<void> {
    try {
      await api.delete(`/favorites/${encodeURIComponent(breed)}`)
    } catch (error) {
      console.error(`Failed to remove ${breed} from favorites:`, error)
      throw error
    }
  },
}

export default api
