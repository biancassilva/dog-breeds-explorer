<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click="closeModal">
      <!-- Backdrop -->
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          @click="closeModal"
        ></div>

        <!-- Modal -->
        <div
          class="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 capitalize">{{ breedName }} Images</h3>
              <p class="text-gray-600 mt-1">{{ images.length }} beautiful photos</p>
            </div>
            <button
              @click="closeModal"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="loading-spinner mx-auto mb-4"></div>
              <p class="text-gray-600">Loading beautiful images...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12">
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
            <h3 class="text-lg font-medium text-gray-900 mb-2">Failed to load images</h3>
            <p class="text-gray-600 mb-4">{{ error }}</p>
            <button @click="loadImages" class="btn-primary">Try Again</button>
          </div>

          <!-- Images Grid -->
          <div
            v-else-if="images.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div
              v-for="(image, index) in images"
              :key="index"
              class="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden"
            >
              <img
                :src="image"
                :alt="`${breedName} image ${index + 1}`"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                @error="handleImageError"
              />

              <!-- Image overlay -->
              <div
                class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
              >
                <button
                  @click="openImageModal(image)"
                  class="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-300 hover:bg-white"
                >
                  <svg
                    class="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <div
              class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No images found</h3>
            <p class="text-gray-600">Sorry, we couldn't find any images for this breed.</p>
          </div>

          <!-- Footer -->
          <div class="mt-6 flex justify-end space-x-3">
            <button @click="closeModal" class="btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Full Image Modal -->
  <Transition name="modal">
    <div v-if="showFullImage" class="fixed inset-0 z-60 overflow-y-auto" @click="closeFullImage">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div
          class="fixed inset-0 transition-opacity bg-black bg-opacity-90"
          @click="closeFullImage"
        ></div>

        <div class="relative max-w-4xl max-h-full">
          <img
            :src="selectedImage"
            :alt="`${breedName} full image`"
            class="max-w-full max-h-full object-contain rounded-lg"
          />

          <button
            @click="closeFullImage"
            class="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBreedsStore } from '@/stores/breeds'

interface Props {
  isOpen: boolean
  breedName: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const store = useBreedsStore()
const loading = ref(false)
const error = ref<string | null>(null)
const images = ref<string[]>([])
const showFullImage = ref(false)
const selectedImage = ref('')

const closeModal = () => {
  emit('close')
}

const closeFullImage = () => {
  showFullImage.value = false
  selectedImage.value = ''
}

const openImageModal = (image: string) => {
  selectedImage.value = image
  showFullImage.value = true
}

const loadImages = async () => {
  if (!props.breedName) return

  loading.value = true
  error.value = null

  try {
    const breedImages = await store.fetchBreedImages(props.breedName)
    images.value = breedImages
  } catch (err) {
    error.value = 'Failed to load images. Please try again.'
    console.error('Error loading images:', err)
  } finally {
    loading.value = false
  }
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

// Watch for breed name changes and load images
watch(
  () => props.breedName,
  (newBreedName) => {
    if (newBreedName && props.isOpen) {
      loadImages()
    }
  },
  { immediate: true },
)

// Watch for modal open state
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.breedName) {
      loadImages()
    } else {
      images.value = []
      error.value = null
    }
  },
)
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
