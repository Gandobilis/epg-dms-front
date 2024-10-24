<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-6xl font-bold text-red-600 mb-4">403</h1>
    <p class="text-lg text-gray-600 mb-8">You are not authorized to access this page.</p>
    <router-link
        to="/"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
      Go back to Home
    </router-link>
  </div>
</template>
