<script setup>
import useSheet from "../composables/useSheet.js";

const {} = useSheets();

const handleFileUpload = (event) => {
  file.value = event.target.files[0];
};
</script>

<template>
  <input type="file" ref="file" class="file-input w-full max-w-xs" />
</template>
