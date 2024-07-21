<script setup>
defineProps({
  sheet: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box w-11/12 max-w-5xl">
      <h1 class="text-3xl font-bold">მონაცემები</h1>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
          <tr>
            <th>თარიღი</th>
            <th>სრული თანხა</th>
            <th>მიზანი</th>
            <th>აღწერა</th>
            <th>სტატუსი</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(extraction, index) in extractions" :key="index">
            <td v-text="extraction.date"/>
            <td v-text="extraction.totalAmount"/>
            <td v-text="extraction.purpose"/>
            <td v-text="extraction.description"/>
            <td>
              <i class="fa-solid fa-check fa-2xl" style="color: #00a96e" v-if="extraction.status"/>
              <i class="fa-solid fa-triangle-exclamation fa-2xl" style="color: #ffbe00" v-else/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-action">
        <div class="join justify-center w-full">
          <button class="join-item btn" @click="
            extractionPage = extractionPage - 1;
          getExtractions(currentFileId);
          " :disabled="extractionPage === 1">
            «
          </button>
          <button class="join-item btn focus:outline-0">
            {{ extractionPage }}
          </button>
          <button class="join-item btn" @click="
            extractionPage = extractionPage + 1;
          getExtractions(currentFileId);
          " :disabled="extractionPage === totalPages">
            »
          </button>
        </div>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form method="dialog">
          <button class="btn">დახურვა</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
