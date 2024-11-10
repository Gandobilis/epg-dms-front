<template>
  <div class="fixed bottom-0 w-screen bg-white p-4 shadow-md flex justify-center items-center gap-x-10">
    <div class="flex items-center gap-x-4 relative">
      <span><strong>{{ startIndex }} - {{ endIndex }}</strong> of <strong>{{ totalElements }}</strong></span>
      <i class="fas fa-caret-down cursor-pointer" @click="showDp = !showDp"/>
      <ul class="absolute flex flex-col bottom-10 bg-white shadow" v-if="showDp">
        <li v-for="(o, i) in options" :key="i" @click="selectPageSize(o)"
            class="flex items-center gap-x-2.5 whitespace-nowrap cursor-pointer hover:bg-gray-300 py-2 px-3.5 text-sm">
          {{ o }} ერთ გვერდზე <i v-if="pageSize === o" class="fa-solid fa-check text-blue-500"></i>
        </li>
      </ul>
    </div>

    <div class="flex items-center gap-x-7">
      <i class="fas fa-angle-double-left cursor-pointer" :class="{
        'text-gray-300 cursor-default': currentPage === 1
      }" @click="setPage(1)"/>
      <i class="fas fa-angle-left cursor-pointer" :class="{
        'text-gray-300 cursor-default': currentPage === 1
      }" @click="previousPage"/>

      <div class="flex items-center gap-x-1">
        <input
            @input="validatePage"
            class="w-8 text-center border no-spinner"
            type="number"
            min="1"
            :max="totalPages"
            :value="currentPage"
            @keyup.enter="onEnter"
        />
        <span>of {{ totalPages }}</span>
      </div>

      <i class="fas fa-angle-right cursor-pointer" :class="{
        'text-gray-300 cursor-default': currentPage === totalPages
      }" @click="nextPage"/>
      <i class="fas fa-angle-double-right cursor-pointer" :class="{
        'text-gray-300 cursor-default': currentPage === totalPages
      }" @click="setPage(totalPages)"/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

// Define props for the component
const props = defineProps({
  startIndex: {
    type: Number,
    required: true
  },
  endIndex: {
    type: Number,
    required: true
  },
  totalElements: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  }
});

// Define events to emit to parent component
const emit = defineEmits([
  'update:currentPage',
  'update:pageSize'
]);

// Local state for dropdown visibility
const showDp = ref(false);

// Methods to handle pagination actions
const selectPageSize = (o) => {
  showDp.value = false;
  emit('update:pageSize', o);
  emit('update:currentPage', 1); // Reset to first page
};

const setPage = (page) => {
  if (page !== props.currentPage) {
    emit('update:currentPage', page);
  }
};

const previousPage = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1);
  }
};

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1);
  }
};

const validatePage = (event) => {
  const page = parseInt(event.target.value, 10);
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page);
  }
};

const onEnter = () => {
  // You can handle any specific logic when the Enter key is pressed
};

// Computed properties for dynamic indices based on current page and page size
const startIndex = computed(() => (props.currentPage - 1) * props.pageSize + 1);
const endIndex = computed(() => Math.min(props.currentPage * props.pageSize, props.totalElements));
</script>

<style scoped>
/* Add any specific styles here */
</style>
