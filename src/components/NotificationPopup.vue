<template>
  <Transition name="fade">
    <div v-if="notification.visible"
         class="z-50 fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white shadow-lg transition-opacity duration-300"
         :class="{
           'bg-green-500': notification.type === 'success',
           'bg-red-500': notification.type === 'error'
         }">
      {{ notification.message }}
    </div>
  </Transition>
</template>

<script setup>
import { useNotificationStore } from '/src/stores/notification.js';

const notification = useNotificationStore();
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
