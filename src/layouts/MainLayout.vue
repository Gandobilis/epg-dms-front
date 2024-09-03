<script setup>
import HeaderComponent from "../components/HeaderComponent.vue"
</script>

<template>
  <header-component/>
  <main class="p-5">
    <slot/>
  </main>
</template>