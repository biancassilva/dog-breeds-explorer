<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Title -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 class="text-xl font-bold text-gray-900">Dog Breeds Explorer</h1>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex space-x-8">
          <router-link
            to="/"
            class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === '/' }"
          >
            All Breeds
          </router-link>
          <router-link
            to="/favorites"
            class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === '/favorites' }"
          >
            Favorites
            <span
              v-if="favoritesCount > 0"
              class="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ favoritesCount }}
            </span>
          </router-link>
        </nav>

        <!-- Status indicator -->
        <div class="flex items-center space-x-4" v-if="error">
        
          <div v-if="error" class="flex items-center space-x-2 text-sm text-red-600">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ error }}</span>
            <button @click="clearError" class="text-red-400 hover:text-red-600">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBreedsStore } from '@/stores/breeds'

const store = useBreedsStore()

const loading = computed(() => store.loading)
const error = computed(() => store.error)
const favoritesCount = computed(() => store.favorites.length)

const clearError = () => {
  store.clearError()
}
</script>
