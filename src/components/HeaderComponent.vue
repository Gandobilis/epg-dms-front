<script setup>
import ThemeSwitcher from "./header/ThemeSwitcher.vue";
import Navigation from "./header/Navigation.vue";
</script>

<template>
  <header class="flex gap-x-5 p-5 items-center justify-between">
    <navigation/>

    <theme-switcher/>
  </header>
</template>