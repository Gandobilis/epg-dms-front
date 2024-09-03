<script setup>
import HeaderComponent from "../components/HeaderComponent.vue"
</script>

<template>
  <header-component/>
  <main class="px-5 py-2.5">
    <slot/>
  </main>
</template>