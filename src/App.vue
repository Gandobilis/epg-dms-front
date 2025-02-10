<script setup>
import {useAuthStore} from '/src/stores/auth';
import {onMounted} from "vue";
import MainLayout from "./layouts/MainLayout.vue";
import NotificationPopup from "./components/NotificationPopup.vue";

const authStore = useAuthStore();

onMounted(async () => {
  try {
    await authStore.restoreSession();
  } catch (error) {
    console.error("Error restoring session:", error);
  }
});
</script>

<template>
  <NotificationPopup />
  <main-layout>
    <router-view/>
  </main-layout>
</template>
