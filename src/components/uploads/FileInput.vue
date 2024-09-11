<script setup>
import {ref} from "vue";
import useUploads from "../../composables/useUploads.js";

const {selectedSheet, createSheet} = useUploads()

const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = async (event) => {
  selectedSheet.value = event.target.files[0]
  createSheet().then(() => {
    event.target.value = '';
    selectedSheet.value = ''
  });
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
      <p class="text-sm">{{ selectedSheet ? selectedSheet.name : 'ფაილი არჩეული არ არის' }}</p>
    </div>
  </div>
</template>