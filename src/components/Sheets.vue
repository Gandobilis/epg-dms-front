<script setup>
import useSheets from "/src/composables/useSheets";
import {onMounted, ref} from "vue";
import useSheet from "../composables/useSheet.js";

const {sheets, currentPage, selectedSheet, totalPages, fetchSheets, createSheet, formatDate} = useSheets();
const warn = ref(null)

const {
  sheet,
  _currentPage,
  _totalPages,
  recordId,
  ok,
  warning,
  total,
  amount,
  fetchSheetData,
  fetchSheetDataWarnings
} = useSheet()
onMounted(async () => {
  await fetchSheets();

});
const handleFileUpload = async (event) => {
  selectedSheet.value = event.target.files[0];
  await createSheet();
  event.target.value = '';

};
const handleCheckboxChange = async (event) => {
  if (event.target.checked) {
    await fetchSheetDataWarnings();
  } else {
    await fetchSheetData();
  }

}
</script>

<template>
  <div class="flex items-center justify-between mb-3.5 ml-3.5">
    <input type="file" @change="handleFileUpload"
           class="file-input btn file-input-ghost file-input-bordered file-input-md w-full max-w-xs"/>

    <label class="swap swap-rotate btn">
      <!-- this hidden checkbox controls the state -->
      <input type="checkbox" class="theme-controller" value="dark"/>

      <!-- sun icon -->
      <svg
          class="swap-off h-10 w-10 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
        <path
            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
      </svg>

      <!-- moon icon -->
      <svg
          class="swap-on h-10 w-10 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
        <path
            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
      </svg>
    </label>
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
          <p>{{ amount }} თანხა</p>
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
