<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
    <p class="text-lg text-gray-600 mb-8">ასეთი გვერდი არ არსებობს.</p>
    <router-link
        to="/transactions"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
      მთავარ გვერდზე დაბრუნება
    </router-link>
  </div>
</template>