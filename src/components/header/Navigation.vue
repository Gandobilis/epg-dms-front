<script setup>
import {useRouter} from "vue-router";
import cookies from "vue-cookies";
import {ref} from "vue";
const router = useRouter();

const checkCurrentRoute = (path) => router.currentRoute.value.path === path;
const accessToken = ref(cookies.get('access_token'))
</script>

<template>
  <div class="flex gap-x-5 items-center">
    <router-link class="btn" :class="{'btn-neutral': checkCurrentRoute('/')}" to="/" v-text="'ატვირთულები'"/>
    <router-link class="btn" :class="{'btn-neutral': checkCurrentRoute('/saved')}" to="/saved" v-text="'შენახულები'"/>
  </div>

  <div class="flex gap-x-5 items-center">
    <a href="https://capital-badly-imp.ngrok-free.app/api/v1/connection-fees/download" target="_blank"
       class="btn btn-success text-white" v-text="'ექსპორტი'"/>
    <router-link v-if="!accessToken" class="btn" :class="{'btn-neutral': checkCurrentRoute('/login')}" to="/login" v-text="'შესვლა'"/>
    <div class="avatar placeholder cursor-pointer items-center gap-x-2.5" v-else>
      <div class="bg-neutral text-neutral-content w-12 rounded-full">
        <span class="font-semibold text-sm">ლგ</span>
      </div>
      <button class="btn btn-error text-white btn-sm" @click="cookies.remove('access_token'); accessToken = cookies.get('access_token')">გასვლა</button>
    </div>
  </div>
</template>