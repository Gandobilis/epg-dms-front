<script setup>
import { ref } from 'vue';
import { useAuthStore } from '/src/stores/auth';
import {useRouter} from "vue-router";
const router = useRouter()

const email = ref('');
const password = ref('');
const authError = ref(false);

// Using the Pinia store
const authStore = useAuthStore();

// Function to handle login
const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
    authError.value = false;
    await router.push('/');
  } catch (error) {
    authError.value = true;
  }
};
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
      <h2 class="text-2xl font-bold text-center text-gray-900">ავტორიზაცია</h2>
      <form @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">ემაილი</label>
            <input v-model="email" id="email" type="email"
                   class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-success">
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">პაროლი</label>
            <input v-model="password" id="password" type="password"
                   class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-success">
          </div>
        </div>
        <button type="submit"
                class="mt-7 w-full py-2 px-4 text-white font-semibold rounded-md hover:bg-success glass bg-neutral">
          შესვლა
        </button>
      </form>
    </div>
  </div>
</template>
