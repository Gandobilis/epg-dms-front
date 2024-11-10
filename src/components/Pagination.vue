<script setup>
import {computed, ref} from "vue";

const cp = defineModel('current-page');
const ps = defineModel('page-size');
const tp = defineModel('total-pages');
const te = defineModel('total-elements');

const startIndex = computed(() => (cp.value - 1) * ps.value + 1);

const endIndex = computed(() => {
  const ei = (startIndex.value + ps.value - 1)
  if (ei > te.value) {
    return te.value;
  } else {
    return ei
  }
});

const previousPage = () => {
  if (cp.value > 1) {
    cp.value--;
  }
}
const nextPage = () => {
  if (cp.value < tp.value) {
    cp.value++;
  }
}

function onEnter(event) {
  const page = parseInt(event.target.value);
  if (page >= 1 && page <= tp.value) {
    cp.value = page;
  } else {
    cp.value = 1;
  }
}

function validatePage(event) {
  if (event.target.value) {
    const page = parseInt(event.target.value);
    if (page < 1) {
      event.target.value = 1;
    } else if (page > tp.value) {
      event.target.value = tp.value;
    } else {
      event.target.value = page;
    }
  }
}

const options = computed(() => {
  const optionsArray = [10, 20, 50, 100];
  const oa = []
  for (const option of optionsArray) {
    if (option < te.value) {
      oa.push(option);
    }
  }
  oa.push(te.value)

  return oa;
});

const showDp = ref(false);
</script>


<template>
  <!--პაგინაცია-->
  <div
      class="fixed bottom-0 w-screen bg-white p-4 shadow-md flex justify-center items-center gap-x-10">
    <div class="flex items-center gap-x-4 relative">
      <span><strong>{{ startIndex }} - {{ endIndex }}</strong> of <strong>{{ te }}</strong></span>
      <i class="fas fa-caret-down cursor-pointer" @click="showDp = !showDp"/>
      <ul class="absolute flex flex-col bottom-10 bg-white shadow" v-if="showDp">
        <li v-for="(o, i) in options" :key="i" @click="showDp = false; ps = o; cp = 1;"
            class="flex items-center gap-x-2.5 whitespace-nowrap cursor-pointer hover:bg-gray-300 py-2 px-3.5 text-sm">
          {{ o }} ერთ გვერდზე <i v-if="ps === o" class="fa-solid fa-check text-blue-500"></i>
        </li>
      </ul>
    </div>

    <div class="flex items-center gap-x-7">
      <i class="fas fa-angle-double-left cursor-pointer" :class="{
          'text-gray-300 cursor-default': cp === 1
        }" @click="cp = 1"/>
      <i class="fas fa-angle-left cursor-pointer" :class="{
          'text-gray-300 cursor-default': cp === 1
        }" @click="previousPage"></i>

      <div class="flex items-center gap-x-1">
        <input
            @input="validatePage"
            class="w-8 text-center border no-spinner"
            type="number"
            min="1"
            :max="tp"
            :value="cp"
            @keyup.enter="onEnter"
        />
        <span>of {{ tp }}</span>
      </div>

      <i class="fas fa-angle-right cursor-pointer" :class="{
          'text-gray-300 cursor-default': cp === tp
        }" @click="nextPage"></i>
      <i class="fas fa-angle-double-right cursor-pointer" :class="{
          'text-gray-300 cursor-default': cp === tp
        }" @click="cp = tp"></i>
    </div>
  </div>
  <!--პაგინაცია-->
</template>

<style scoped>
.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
  appearance: none;
}

.no-spinner {
  appearance: textfield;
}
</style>