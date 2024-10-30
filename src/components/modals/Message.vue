<script setup>
import {ref} from 'vue';

defineProps({
  message: {
    type: String,
    required: true
  }
});

const show = ref(true);

function hideRequest() {
  show.value = false;
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade" mode="out-in">
      <div v-if="show" class="fixed bottom-4 right-10 bg-gray-100 p-4 rounded-lg shadow-md max-w-sm">
        <p>{{ message }}</p>
        <button @click="hideRequest" class="mt-2 text-blue-500 hover:underline">დახურვა</button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
