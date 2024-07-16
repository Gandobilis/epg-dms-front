<script setup>
import useExtraction from "../composables/useExtraction"
import {onMounted, ref} from "vue"

const {
  extractions,
  getExtractions,
  sheets,
  getSheets,
  extractionPage,
  currentFileId,
  totalPages,
  file,
  uploadFile
} = useExtraction()

function formatDateString(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const handleFileUpload = (event) => {
  file.value = event.target.files[0];
};


onMounted(async () => {
  // await getExtractions()
  await getSheets();
})
</script>

<template>
  <div class="grid grid-cols-2 m-5 w-full">
    <div class="flex flex-col gap-y-5">
      <div class="flex items-center gap-x-2.5">
        <h1 class="text-3xl font-bold">ფაილები</h1>
        <div class="flex justify-center items-center gap-x-2.5">
          <input type="file" @change="handleFileUpload" class="file-input file-input-bordered w-full max-w-xs">
          <button @click="uploadFile" class="btn font-bold">ატვირთვა</button>
        </div>
      </div>
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
          <tbody>
          <tr v-for="(file, index) in sheets" :key="index">
            <td class="flex items-center gap-x-2.5"><i class="fa-solid fa-sheet-plastic fa-2xl"
                                                       style="color: #1d6f42;"/>
              {{ file.fileName }}
            </td>
            <td v-text="formatDateString(file.date)"/>
            <td>
              <i class="fa-solid fa-check fa-2xl" style="color: #00a96e" v-if="file.status"/>
              <i class="fa-solid fa-triangle-exclamation fa-2xl" style="color: #ffbe00" v-else/>
            </td>
            <td>
              <i class="fa-solid fa-eye fa-xl cursor-pointer" @click="getExtractions(file.id); currentFileId = file.id"
                 onclick="my_modal_1.showModal()"/>
            </td>
            <td>
              <i class="fa-solid fa-trash fa-xl cursor-pointer" style="color: #d11a2a"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>

  <dialog id="my_modal_1" class="modal">
    <div class="modal-box w-11/12 max-w-5xl">
      <h1 class="text-3xl font-bold">მონაცემები</h1>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
          <tr>
            <th>ID</th>
            <th>თარიღი</th>
            <th>სრული თანხა</th>
            <th>მიზანი</th>
            <th>აღწერა</th>
            <th>სტატუსი</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(extraction, index) in extractions" :key="index">
            <td v-text="extraction.id"/>
            <td v-text="formatDateString(extraction.date)"/>
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
          <button class="join-item btn" @click="extractionPage = extractionPage - 1; getExtractions(currentFileId)"
                  :disabled="extractionPage === 1">«
          </button>
          <button class="join-item btn focus:outline-0">{{ extractionPage }}</button>
          <button class="join-item btn" @click="extractionPage = extractionPage + 1; getExtractions(currentFileId)"
                  :disabled="extractionPage === totalPages">»
          </button>
        </div>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <form method="dialog">
          <button class="btn">დახურვა</button>
        </form>
      </div>
    </div>
  </dialog>
</template>