<script setup>
import {useRouter} from "vue-router";
import {useAuthStore} from "/src/stores/auth.js";

const router = useRouter();
const authStore = useAuthStore();

const checkCurrentRoute = (path) => router.currentRoute.value.path === path;
</script>

<template>
  <div class="flex items-center gap-x-5">
    <router-link class="btn" :class="{'btn-neutral': checkCurrentRoute('/')}" to="/" v-text="'ატვირთულები'"/>

    <router-link class="btn" :class="{'btn-neutral': checkCurrentRoute('/saved')}" to="/saved" v-text="'შენახულები'"/>
  </div>

  <div class="flex items-center gap-x-5">
    <a v-if="checkCurrentRoute('/saved')"
       href="https://capital-badly-imp.ngrok-free.app/api/v1/connection-fees/download" target="_blank"
       class="text-white btn btn-success" v-text="'ექსპორტი'"/>

    <router-link v-if="authStore.user?.role === 'ROLE_ADMIN'" class="btn"
                 :class="{'btn-neutral': checkCurrentRoute('/users')}"
                 to="/users" v-text="'მომხმარებლები'"/>

    <router-link v-if="!authStore.isAuthenticated" class="btn" :class="{'btn-neutral': checkCurrentRoute('/login')}"
                 to="/login"
                 v-text="'შესვლა'"/>

    <div class="cursor-pointer items-center avatar placeholder gap-x-2.5" v-else>
      <button class="cursor-auto uppercase btn no-animation hover:bg-base-200 hover:border-base-200"
              v-text="`${authStore.user?.firstName[0]}. ${authStore.user?.lastName}`"/>

      <button class="text-white btn btn-error" @click="authStore.logout" v-text="'გასვლა'"/>
    </div>
  </div>
</template>