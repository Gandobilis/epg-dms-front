<script setup>
import {ref} from 'vue';
import useLogin from "../composables/useLogin.js";

const {email, password, remember, error, isLoading, toggleRemember, login} = useLogin();
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
      <h2 class="text-2xl font-bold text-center text-gray-900">ავტორიზაცია</h2>
      <form @submit.prevent="login">
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
        <div class="flex justify-between items-center my-2.5">
          <label class="flex items-center">
            <input type="checkbox" @change="toggleRemember" :checked="remember" class="checkbox checkbox-sm"/>
            <span class="ml-2 text-sm text-gray-700">დამახსოვრება</span>
          </label>
        </div>
        <div class="mb-2.5 flex items-center">
          <span class="text-error text-sm" v-text="error"/>
        </div>
        <button type="submit"
                class="w-full py-2 px-4 text-white font-semibold rounded-md hover:bg-success glass bg-neutral">
          შესვლა
        </button>
      </form>
    </div>
  </div>
</template>
