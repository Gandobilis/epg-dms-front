<script setup>
import {ref} from "vue";
import useUploads from "../composables/useUploads.js";
import Confirm from "./modals/Confirm.vue";

const {formatDate, fetchSheets, _delete, transfer} = useUploads();

defineProps({
      sheets: {
        type: Array,
        required: true
      },
      currentPage: {
        type: Number,
        required: true
      },
      totalPages: {
        type: Number,
        required: true
      }
    }
)

const deleteId = ref();
const transferId = ref();

const _transfer = async () => {
  await transfer(transferId.value)
}

const __delete = async () => {
  await _delete(deleteId.value)
}
</script>

<template>
  <confirm id="modal_3" @accept="__delete"/>

  <confirm id="modal_4" @accept="_transfer"/>

  <div class="overflow-x-auto" v-if="sheets && sheets.length > 0">
    <table class="table table-xs">
      <thead>
      <tr>
        <th>ფაილის სახელი</th>
        <th>ატვირთვის თარიღი</th>
        <th>ფაილის სტატუსი</th>
        <th>ფაილის ნახვა</th>
        <th>ფაილის წაშლა</th>
        <th>ბაზაში გადატანა</th>
      </tr>
      </thead>

      <tbody>
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
          <img src="/src/assets/visibility.svg" alt="view icon" class="cursor-pointer"
               @click="recordId = sheet.id; fetchSheetData()" onclick="my_modal_1.showModal(); "/>
        </td>
        <td>
          <img src="/src/assets/delete.svg" alt="delete icon" @click="deleteId = sheet.id"
               onclick="modal_3.showModal()" class="cursor-pointer"/>
        </td>
        <td>
          <img src="/src/assets/save.svg" alt="save icon" @click="saveId = sheet.id"
               onclick="modal_4.showModal()" class="cursor-pointer"/>
        </td>
      </tr>
      </tbody>
    </table>

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
  </div>

  <div v-else-if="sheets && sheets.length === 0" class="text-sm font-medium">
    გთხოვთ ატვირთოთ ფაილები!
  </div>

  <div v-else class="flex items-center gap-x-1.5 text-sm font-medium">
    იტვირთება <span class="loading loading-spinner loading-md"/>
  </div>
</template>