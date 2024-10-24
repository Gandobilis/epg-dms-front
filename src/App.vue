<script setup>
import MainLayout from "./layouts/MainLayout.vue";
import {useAuthStore} from '/src/stores/auth';
import {onMounted} from "vue";

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.restoreSession();
});
</script>

<template>
  <main-layout>
    <router-view/>
  </main-layout>
</template>