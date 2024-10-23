<script setup>
import {useAuthStore} from "/src/stores/auth.js";
import useNavigation from "/src/composables/useNavigation.js";

const authStore = useAuthStore();

const {checkCurrentRoute, generateDownloadLink, getUserName, logout} = useNavigation();
</script>

<template>
  <div class="flex items-center gap-x-5">
    <router-link class="btn"
                 :class="{'btn-neutral': checkCurrentRoute('/')}"
                 to="/">
      ატვირთულები
    </router-link>

    <router-link class="btn"
                 :class="{'btn-neutral': checkCurrentRoute('/saved')}"
                 to="/saved">
      შენახულები
    </router-link>
  </div>

  <div class="flex items-center gap-x-5">
    <a v-if="checkCurrentRoute('/saved')"
       class="text-white btn btn-success"
       :href="generateDownloadLink"
       target="_blank">
      ექსპორტი
    </a>

    <router-link v-if="authStore.user?.role === 'ROLE_ADMIN'"
                 class="btn"
                 :class="{'btn-neutral': checkCurrentRoute('/users')}"
                 to="/users">
      მომხმარებლები
    </router-link>

    <router-link v-if="!authStore.isAuthenticated"
                 class="btn"
                 :class="{'btn-neutral': checkCurrentRoute('/login')}"
                 to="/login">
      შესვლა
    </router-link>

    <div v-else class="cursor-pointer items-center avatar placeholder gap-x-2.5">
      <button class="cursor-auto uppercase btn no-animation hover:bg-base-200 hover:border-base-200"
              v-text="getUserName()"/>

      <button class="text-white btn btn-error" @click="logout" v-text="'გასვლა'"/>
    </div>
  </div>
</template>