<script setup>
import {useRouter} from "vue-router";

const router = useRouter();
</script>

<template>
  <div class="flex gap-x-5">
    <router-link class="btn" :class="{'btn-neutral': router.currentRoute.value.path === '/'}" to="/">ატვირთულები
    </router-link>
    <router-link class="btn" :class="{'btn-neutral': router.currentRoute.value.path === '/records'}" to="/records">
      შენახულები
    </router-link>
  </div>
</template>