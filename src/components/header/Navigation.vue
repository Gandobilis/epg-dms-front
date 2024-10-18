<script setup>
import {useRouter} from "vue-router";
import {useAuthStore} from "../../stores/auth.js";

const router = useRouter();

const checkCurrentRoute = (path) => router.currentRoute.value.path === path;

// Get the authentication store
const authStore = useAuthStore();
</script>

<template>
  <div class="flex gap-x-5 items-center">
    <router-link class="btn" :class="{'btn-neutral': checkCurrentRoute('/')}" to="/" v-text="'ატვირთულები'"/>
    <router-link class="btn" :class="{'btn-neutral': checkCurrentRoute('/saved')}" to="/saved" v-text="'შენახულები'"/>
  </div>

  <div class="flex gap-x-5 items-center">
    <a href="https://capital-badly-imp.ngrok-free.app/api/v1/connection-fees/download" target="_blank"
       class="btn btn-success text-white" v-text="'ექსპორტი'"/>
    <router-link v-if="!authStore.isAuthenticated" class="btn" :class="{'btn-neutral': checkCurrentRoute('/login')}"
                 to="/login"
                 v-text="'შესვლა'"/>
    <div class="avatar placeholder cursor-pointer items-center gap-x-2.5" v-else>
      <div class="bg-neutral text-neutral-content w-12 rounded-full">
        <span class="font-semibold text-sm">{{ `${authStore.user?.firstName[0]}.${authStore.user?.lastName[0]}`}}</span>
      </div>
      <button class="btn btn-error text-white btn-sm"
              @click="authStore.logout">გასვლა
      </button>
    </div>
  </div>
</template>