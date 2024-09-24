<script setup>
import ThemeSwitcher from "./header/ThemeSwitcher.vue";
import Navigation from "./header/Navigation.vue";
</script>

<template>
  <header class="flex gap-x-5 p-5 items-center justify-between">
    <navigation/>

    <div class="flex items-center gap-x-5">
      <a href="https://capital-badly-imp.ngrok-free.app/api/v1/connection-fees/download" target="_blank" class="btn btn-success text-white">ექსპორტი</a>
      <theme-switcher/>
    </div>
  </header>
</template>