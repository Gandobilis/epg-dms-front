<script setup>
import {useAuthStore} from "/src/stores/auth.js";
import useNavigation from "/src/composables/useNavigation.js";

const authStore = useAuthStore();
const {
  showFiles,
  showTransactions,
  showUsers,
  showFileExport,
  checkCurrentRoute,
  generateDownloadLink,
  getUserName,
  logout
} = useNavigation();
</script>

<template>
  <div class="flex items-center gap-x-5">
    <router-link v-if="showFiles()" class="btn" :class="{'btn-neutral': checkCurrentRoute('/')}" to="/">
      ფაილები
    </router-link>

    <router-link v-if="showTransactions()" class="btn" :class="{'btn-neutral': checkCurrentRoute('/transactions')}"
                 to="/transactions">
      ჩარიცხვები
    </router-link>
  </div>

  <div class="flex items-center gap-x-5">
    <a v-if="showFileExport()" class="text-white btn btn-success" :href="generateDownloadLink()"
       target="_blank">
      ექსპორტი
    </a>

    <router-link v-if="showUsers()" class="btn"
                 :class="{'btn-neutral': checkCurrentRoute('/users')}" to="/users">
      მომხმარებლები
    </router-link>

    <router-link v-if="!authStore.isAuthenticated" class="btn"
                 :class="{'btn-neutral': checkCurrentRoute('/login')}" to="/login">
      შესვლა
    </router-link>

    <div v-else class="cursor-pointer items-center avatar placeholder gap-x-2.5">
      <button class="cursor-auto uppercase btn no-animation hover:bg-base-200 hover:border-base-200"
              v-text="getUserName()"/>

      <button class="text-white btn btn-error" @click="logout" v-text="'გასვლა'"/>
    </div>
  </div>
</template>