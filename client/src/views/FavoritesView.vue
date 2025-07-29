<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Your Favorite Breeds</h1>
            <p class="text-gray-600">Manage and explore your favorite dog breeds.</p>
          </div>

          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-sm text-gray-500">Total Favorites</p>
              <p class="text-2xl font-bold text-secondary-600">{{ favorites.length }}</p>
            </div>

            <button
              v-if="favorites.length > 0"
              @click="clearAllFavorites"
              class="btn-danger"
              :disabled="clearingAll"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {{ clearingAll ? 'Clearing...' : 'Clear All' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="mb-6">
        <div class="relative max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search your favorites..."
            class="input pl-10"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && favorites.length === 0" class="text-center py-12">
        <div class="loading-spinner mx-auto mb-4"></div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Loading favorites...</h3>
        <p class="text-gray-600">Please wait while we fetch your favorite breeds.</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error && favorites.length === 0" class="text-center py-12">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
        >
          <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Failed to load favorites</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="refreshFavorites" class="btn-primary">Try Again</button>
      </div>

      <!-- Favorites Grid -->
      <div
        v-else-if="filteredFavorites.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="favorite in filteredFavorites"
          :key="favorite.breed"
          class="card-hover group relative"
        >
          <!-- Breed Card -->
          <div class="relative">
            <!-- Breed Image -->
            <div class="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
              <img
                v-if="favorite.image"
                :src="favorite.image"
                :alt="favorite.breed"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
                <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <!-- Favorite Badge -->
            <div class="absolute top-3 left-3">
              <div class="bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                <svg class="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                Favorite
              </div>
            </div>

            <!-- Remove Button -->
            <button
              @click="removeFavorite(favorite.breed)"
              class="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              :disabled="removingBreeds.includes(favorite.breed)"
            >
              <svg
                v-if="removingBreeds.includes(favorite.breed)"
                class="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          <!-- Breed Info -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2 capitalize">
              {{ favorite.breed }}
            </h3>

            <p class="text-sm text-gray-500 mb-3">Added {{ formatDate(favorite.addedAt) }}</p>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
              <button @click="viewImages(favorite.breed)" class="btn-primary flex-1">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                View Images
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center"
        >
          <svg class="w-8 h-8 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
        <p class="text-gray-600 mb-4">
          {{
            searchQuery
              ? 'No favorites match your search criteria.'
              : 'Start exploring dog breeds and add your favorites!'
          }}
        </p>
        <div class="space-y-2">
          <router-link to="/" class="btn-primary inline-block">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Browse All Breeds
          </router-link>

          <button v-if="searchQuery" @click="clearSearch" class="btn-secondary block mx-auto">
            Clear Search
          </button>
        </div>
      </div>
    </main>

    <!-- Images Modal -->
    <BreedImagesModal
      :is-open="showImagesModal"
      :breed-name="selectedBreed"
      @close="closeImagesModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBreedsStore } from '@/stores/breeds'
import AppHeader from '@/components/Layout/AppHeader.vue'
import BreedImagesModal from '@/components/BreedImagesModal.vue'

const store = useBreedsStore()

// Reactive data
const searchQuery = ref('')
const showImagesModal = ref(false)
const selectedBreed = ref('')
const removingBreeds = ref<string[]>([])
const clearingAll = ref(false)

// Computed properties
const favorites = computed(() => store.favorites)
const loading = computed(() => store.loading)
const error = computed(() => store.error)

const filteredFavorites = computed(() => {
  if (!searchQuery.value.trim()) {
    return favorites.value
  }

  const query = searchQuery.value.toLowerCase()
  return favorites.value.filter((favorite) => favorite.breed.toLowerCase().includes(query))
})

// Methods
const refreshFavorites = async () => {
  await store.fetchFavorites()
}

const removeFavorite = async (breed: string) => {
  removingBreeds.value.push(breed)
  try {
    await store.removeFromFavorites(breed)
  } catch (error) {
    console.error('Failed to remove favorite:', error)
  } finally {
    removingBreeds.value = removingBreeds.value.filter((b) => b !== breed)
  }
}

const clearAllFavorites = async () => {
  if (!confirm('Are you sure you want to remove all favorites? This action cannot be undone.')) {
    return
  }

  clearingAll.value = true
  try {
    const promises = favorites.value.map((favorite) => store.removeFromFavorites(favorite.breed))
    await Promise.all(promises)
  } catch (error) {
    console.error('Failed to clear all favorites:', error)
  } finally {
    clearingAll.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const handleImageError = (event: Event) => {
  // Hide the image if it fails to load, showing the placeholder instead
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const viewImages = (breedName: string) => {
  selectedBreed.value = breedName
  showImagesModal.value = true
}

const closeImagesModal = () => {
  showImagesModal.value = false
  selectedBreed.value = ''
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return 'yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

// Lifecycle
onMounted(async () => {
  await refreshFavorites()
})
</script>
