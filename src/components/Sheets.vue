<script setup>
import useSheets from "/src/composables/useSheets";
import {onMounted} from "vue";
import CreateSheet from "./CreateSheet.vue";

const {sheets, fetchSheets, createSheet} = useSheets();

onMounted(async () => {
  await fetchSheets();
});
</script>

<template>
  <div class="grid grid-cols-2 m-5 w-full">
    <div class="flex flex-col gap-y-5">
      <create-sheet/>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
          <tr>
            <th>სახელი</th>
            <th>თარიღი</th>
            <th>სტატუსი</th>
            <th>ნახვა</th>
            <th>წაშლა</th>
          </tr>
          </thead>
          <tbody class="font-bold">
          <tr v-for="(sheet, index) in sheets" :key="index">
            <td class="flex items-center gap-x-2.5">
              <img src="/src/assets/excel.svg.png" alt="xlsx icon" class="w-8"/>
              {{ sheet.fileName }}
            </td>
            <td v-text="sheet.date"/>
            <td>
              <img src="/src/assets/check_circle.svg" alt="check mark" v-if="sheet.status"/>
              <img src="/src/assets/warning.svg" alt="warning mark" v-else/>
            </td>
            <td>
              <img src="/src/assets/visibility.svg" alt="view mark" class="cursor-pointer"/>
            </td>
            <td>
              <img src="/src/assets/delete.svg" alt="delete mark" class="cursor-pointer"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
