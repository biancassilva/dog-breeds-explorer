<template>
  <div class="card-hover group">
    <div class="relative">
      <!-- Breed Image -->
      <div class="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
        <img
          v-if="breed.image"
          :src="breed.image"
          :alt="breed.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

      <!-- Favorite Button -->
      <button
        @click="toggleFavorite"
        class="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-200 group/fav"
        :class="{ 'bg-secondary-100': breed.isFavorite }"
      >
        <svg
          v-if="breed.isFavorite"
          class="w-5 h-5 text-secondary-600 group-hover/fav:scale-110 transition-transform duration-200"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5 text-gray-400 group-hover/fav:text-secondary-500 group-hover/fav:scale-110 transition-all duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </button>

      <!-- Loading overlay -->
      <div
        v-if="loading"
        class="absolute inset-0 bg-white/50 flex items-center justify-center rounded-t-lg"
      >
        <div class="loading-spinner"></div>
      </div>
    </div>

    <!-- Breed Info -->
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-2 capitalize">
        {{ breed.name }}
      </h3>

      <!-- Action Buttons -->
      <div class="flex space-x-2">
        <button @click="viewImages" class="btn-primary flex-1" :disabled="loading">
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBreedsStore } from '@/stores/breeds'

interface Breed {
  name: string
  image?: string
  isFavorite?: boolean
}

interface Props {
  breed: Breed
}

const props = defineProps<Props>()
const emit = defineEmits<{
  viewImages: [breed: string]
}>()

const store = useBreedsStore()
const loading = ref(false)

const toggleFavorite = async () => {
  console.log('🔍 toggleFavorite called for breed:', props.breed.name)
  loading.value = true
  try {
    await store.toggleFavorite(props.breed.name)
    console.log('✅ toggleFavorite success')
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
  } finally {
    loading.value = false
  }
}

const viewImages = () => {
  emit('viewImages', props.breed.name)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
  // Optionally, you could set a fallback image here
  // target.src = '/path/to/fallback-image.jpg'
}
</script>
