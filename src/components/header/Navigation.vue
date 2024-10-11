<script setup>
import {useRouter} from "vue-router";

const router = useRouter();

const checkCurrentRoute = (path) => router.currentRoute.value.path === path;
</script>

<template>
  <div class="flex gap-x-5 items-center">
    <router-link class="btn" :class="{'btn-neutral': checkCurrentRoute('/')}" to="/" v-text="'ატვირთულები'"/>
    <router-link class="btn" :class="{'btn-neutral': checkCurrentRoute('/saved')}" to="/saved" v-text="'შენახულები'"/>
  </div>

  <div class="flex gap-x-5 items-center">
    <a href="https://capital-badly-imp.ngrok-free.app/api/v1/connection-fees/download" target="_blank"
       class="btn btn-success text-white" v-text="'ექსპორტი'"/>
    <router-link class="btn" :class="{'btn-neutral': checkCurrentRoute('/login')}" to="/login" v-text="'შესვლა'"/>
  </div>
</template>