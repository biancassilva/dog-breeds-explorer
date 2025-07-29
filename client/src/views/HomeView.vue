<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBreedsStore } from '@/stores/breeds'
import AppHeader from '@/components/Layout/AppHeader.vue'
import BreedCard from '@/components/BreedCard.vue'
import BreedImagesModal from '@/components/BreedImagesModal.vue'

const store = useBreedsStore()

// Reactive data
const searchQuery = ref('')
const showFavoritesOnly = ref(false)
const showImagesModal = ref(false)
const selectedBreed = ref('')

// Computed properties
const breeds = computed(() => store.breedsWithFavorites)
const favorites = computed(() => store.favorites)
const loading = computed(() => store.loading)
const error = computed(() => store.error)

const filteredBreeds = computed(() => {
  let filtered = breeds.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((breed) => breed.name.toLowerCase().includes(query))
  }

  // Filter by favorites only
  if (showFavoritesOnly.value) {
    filtered = filtered.filter((breed) => breed.isFavorite)
  }

  return filtered
})

const displayBreeds = computed(() => {
  return filteredBreeds.value
})

// Methods
const refreshBreeds = async () => {
  await store.fetchBreeds()
  await store.fetchFavorites()
}

const clearSearch = () => {
  searchQuery.value = ''
  showFavoritesOnly.value = false
}

const openImagesModal = (breedName: string) => {
  selectedBreed.value = breedName
  showImagesModal.value = true
}

const closeImagesModal = () => {
  showImagesModal.value = false
  selectedBreed.value = ''
}

// Lifecycle
onMounted(async () => {
  await refreshBreeds()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Discover Dog Breeds</h1>
        <p class="text-gray-600">
          Explore our collection of beautiful dog breeds and find your perfect companion.
        </p>
      </div>

      <!-- Search and Filter -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
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
                placeholder="Search breeds..."
                class="input pl-10"
              />
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click="showFavoritesOnly = !showFavoritesOnly"
              class="btn-secondary"
              :class="{
                'bg-secondary-100 text-secondary-700 border-secondary-300': showFavoritesOnly,
              }"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              {{ showFavoritesOnly ? 'Show All' : 'Favorites Only' }}
            </button>

            <button @click="refreshBreeds" class="btn-secondary" :disabled="loading">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Breeds</p>
              <p class="text-2xl font-semibold text-gray-900">{{ filteredBreeds.length }}</p>
            </div>
          </div>
        </div>

        <div class="card p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Favorites</p>
              <p class="text-2xl font-semibold text-gray-900">{{ favorites.length }}</p>
            </div>
          </div>
        </div>

        <div class="card p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Showing</p>
              <p class="text-2xl font-semibold text-gray-900">{{ displayBreeds.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="loading-spinner mx-auto mb-4"></div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Loading breeds...</h3>
        <p class="text-gray-600">Please wait while we fetch the latest dog breeds.</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error && breeds.length === 0" class="text-center py-12">
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
        <h3 class="text-lg font-medium text-gray-900 mb-2">Failed to load breeds</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="refreshBreeds" class="btn-primary">Try Again</button>
      </div>

      <!-- Breeds Grid -->
      <div
        v-else-if="displayBreeds.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <BreedCard
          v-for="breed in displayBreeds"
          :key="breed.name"
          :breed="breed"
          @view-images="openImagesModal"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
        >
          <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No breeds found</h3>
        <p class="text-gray-600">
          {{
            showFavoritesOnly
              ? "You haven't added any breeds to your favorites yet."
              : 'No breeds match your search criteria.'
          }}
        </p>
        <div class="mt-4">
          <button v-if="showFavoritesOnly" @click="showFavoritesOnly = false" class="btn-primary">
            Browse All Breeds
          </button>
          <button v-else @click="clearSearch" class="btn-secondary">Clear Search</button>
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
