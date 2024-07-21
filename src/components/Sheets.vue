<script setup>
import useSheets from "/src/composables/useSheets";
import {onMounted} from "vue";

const {sheets, currentPage, totalPages, fetchSheets, formatDate} = useSheets();

onMounted(async () => {
  await fetchSheets();
});
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table">
      <thead>
      <tr>
        <th>ფაილის სახელი</th>
        <th>ატვირთვის თარიღი</th>
        <th>ფაილის სტატუსი</th>
        <th>ფაილის ნახვა</th>
        <th>ფაილის წაშლა</th>
      </tr>
      </thead>

      <tbody v-if="sheets && sheets.length > 0">
      <tr v-for="(sheet, index) in sheets" :key="index">
        <td>
          <div class="flex items-center gap-x-2.5">
            <img src="/src/assets/excel.svg.png" alt="excel icon" class="w-8"/>
            {{ sheet.fileName }}
          </div>
        </td>
        <td v-text="formatDate(sheet.date)"/>
        <td>
          <img src="/src/assets/check_circle.svg" alt="check icon" v-if="sheet.status"/>
          <img src="/src/assets/warning.svg" alt="warning icon" v-else/>
        </td>
        <td>
          <img src="/src/assets/visibility.svg" alt="view icon" class="cursor-pointer"/>
        </td>
        <td>
          <img src="/src/assets/delete.svg" alt="delete icon" class="cursor-pointer"/>
        </td>
      </tr>
      </tbody>

      <tbody v-else-if="sheets && sheets.length === 0">
      <tr>
        <td>
          გთხოვთ ატვირთოთ ფაილები!
        </td>
      </tr>
      </tbody>

      <tbody v-else>
      <tr>
        <td class="flex items-center gap-x-2.5">
          იტვირთება <span class="loading loading-spinner loading-md"/>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <div class="join justify-center w-full mt-5">
    <button class="join-item btn" @click="
            currentPage = currentPage - 1;
          fetchSheets();
          " :disabled="currentPage === 1">
      «
    </button>

    <button class="join-item btn focus:outline-0">
      {{ currentPage }}
    </button>

    <button class="join-item btn" @click="
            currentPage = currentPage + 1;
          fetchSheets();
          " :disabled="currentPage === totalPages">
      »
    </button>
  </div>
</template>
