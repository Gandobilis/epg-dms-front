<template>
  <div class="flex justify-center items-center gap-x-10">
    <div class="flex items-center gap-x-4">
      <span><strong>{{ '1' }} - {{ '20' }}</strong> of <strong>{{ '523' }}</strong></span>
      <i class="fas fa-caret-down"></i>
    </div>

    <div class="flex items-center gap-x-7">
      <i class="fas fa-angle-double-left"></i>
      <i class="fas fa-angle-left"></i>


      <div class="flex items-center gap-x-1">
        <input
            class="w-8 text-center border"
            type="number"
            min="1"
            max="4"
            value="1"
        />
        <span>of 4</span>
      </div>

      <i class="fas fa-angle-right"/>

      <i class="fas fa-angle-double-right"/>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>