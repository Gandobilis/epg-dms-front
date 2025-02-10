<script setup>
import useLogin from "/src/composables/useLogin.js";

const {email, password, error, login} = useLogin();
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="w-full max-w-md p-8 space-y-6 shadow-lg rounded-lg">
      <h2 class="text-2xl font-bold text-center text-gray-900">ავტორიზაცია</h2>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">ემაილი</label>
          <input
              v-model="email"
              type="text"
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-success"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">პაროლი</label>
          <input
              v-model="password"
              type="password"
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-success"
          />
        </div>

        <p v-if="error" class="text-sm text-error mt-4" v-text="error"></p>

        <button
            type="submit"
            aria-label="Login"
            class="w-full py-2 px-4 text-white font-semibold rounded-md hover:bg-success glass bg-neutral"
            :class="{ 'mt-4': error, 'mt-7': !error }"
        >
          შესვლა
        </button>
      </form>
    </div>
  </div>
</template>
