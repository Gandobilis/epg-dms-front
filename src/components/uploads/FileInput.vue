<script setup>
import {ref} from "vue";

const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const emit = defineEmits(['createSheet'])

const model = defineModel()

const handleFileChange = async (event) => {
  model.value = event.target.files[0]
  emit('createSheet')
  event.target.value = '';
  model.value = ''
};
</script>

<template>
  <div class="flex items-center justify-between mb-3.5">
    <div class="flex items-center gap-x-2.5">
      <input
          ref="fileInput"
          type="file"
          @change="handleFileChange"
          class="hidden"
      />
      <button
          @click="triggerFileInput"
          class="btn btn-sm"
      >
        აირჩიეთ ფაილი
      </button>
      <p class="text-sm">{{ 'ფაილი არჩეული არ არის' }}</p>
    </div>
  </div>
</template>