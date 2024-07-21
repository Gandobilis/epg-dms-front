<script setup>
import useSheets from "/src/composables/useSheets";
import {onMounted, ref} from "vue";
import useSheet from "../composables/useSheet.js";

const {sheets, currentPage, selectedSheet, totalPages, fetchSheets, createSheet, formatDate} = useSheets();
const {
  sheet,
  _currentPage,
  _totalPages,
  recordId,
  ok,
  warning,
  total,
  fetchSheetData,
  fetchSheetDataWarnings
} = useSheet()

onMounted(async () => {
  await fetchSheets();
});

const handleFileUpload = (event) => {
  selectedSheet.value = event.target.files[0];
};

const submitFile = async () => {
  await createSheet();
};

const handleCheckboxChange = async (event) => {
  if (event.target.checked) {
    await fetchSheetDataWarnings();
  } else {
    await fetchSheetData();
  }
}

const warn = ref(null)
</script>

<template>
  <div>
    <input type="file" @change="handleFileUpload" class="file-input w-full max-w-xs"/>
    <button @click="submitFile" class="btn" :disabled="!selectedSheet">ატვირთვა</button>
  </div>

  <div class="overflow-x-auto h-[80vh]">
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
          <img src="/src/assets/visibility.svg" alt="view icon" class="cursor-pointer"
               @click="recordId = sheet.id; fetchSheetData()" onclick="my_modal_1.showModal(); "/>
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

  <dialog id="my_modal_1" class="modal">
    <div class="modal-box w-11/12 max-w-5xl">
      <div class="overflow-x-auto h-[70vh]">
        <div class="flex items-center justify-between pr-5">
          <div class="flex items-center gap-x-2.5">
            <input type="checkbox" ref="warn" class="checkbox checkbox-sm" @change="handleCheckboxChange"/> მხოლოდ
            დახარვეზებული
          </div>
          <p>{{ total }} ჩანაწერი</p>
          <p>{{ ok }} უხარვეზო</p>
          <p>{{ warning }} დახარვეზებული</p>
        </div>
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
          <tbody v-if="sheet && sheet.length > 0">
          <tr v-for="(extraction, index) in sheet" :key="index">
            <td v-text="extraction.date"/>
            <td v-text="extraction.totalAmount"/>
            <td v-text="extraction.purpose"/>
            <td v-text="extraction.description"/>
            <td>
              <img src="/src/assets/check_circle.svg" alt="check icon" v-if="extraction.status"/>
              <img src="/src/assets/warning.svg" alt="warning icon" v-else/>
            </td>
          </tr>
          </tbody>

          <tbody v-else-if="sheet && sheet.length === 0">
          <tr>
            <td>
              ჩანაწერები ვერ მოიძებნა!
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
      <div class="modal-action">
        <div class="join justify-center w-full">
          <button class="join-item btn" @click="
            _currentPage = _currentPage - 1;
          fetchSheetData();
          " :disabled="_currentPage === 1">
            «
          </button>
          <button class="join-item btn focus:outline-0">
            {{ _currentPage }}
          </button>
          <button class="join-item btn" @click="
            _currentPage = _currentPage + 1;
          fetchSheetData();
          " :disabled="_currentPage === _totalPages">
            »
          </button>
        </div>
        <form method="dialog" @submit="_currentPage=1; sheet = null; warn.checked = false;">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form method="dialog" @submit="_currentPage=1; sheet = null; warn.checked = false;">
          <button class="btn">დახურვა</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
