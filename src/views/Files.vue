<script setup>
import useUploads from "/src/composables/useUploads";
import {onMounted, ref, watch} from "vue";
import useSheet from "../composables/useSheet.js";
import FileInput from "../components/uploads/FileInput.vue"
import {useAuthStore} from "../stores/auth.js";
import Pagination from "../components/Pagination.vue";
import useFiles from "../composables/useFiles.js";

const authStore = useAuthStore();

const {formatDate,} = useUploads();

const {
  files,
  currentPage,
  pageSize,
  totalPages,
  totalElements,
  selectedSheet,
  fetchSheets,
  createSheet,
  deleteSheet,
  saveSheet,
  transactions
} = useFiles();

const {sheet, _currentPage, _totalPages, recordId, details, fetchSheetData, filter, clearFilter} = useSheet()

const deleteId = ref();
const saveId = ref();

watch(currentPage, async (value) => {
  if (value > totalPages) {
    currentPage.value = totalPages.value;
  }
  if (value) {
    await fetchSheets()
  }
})

onMounted(async () => {
  await fetchSheets();
});
</script>

<template>
  <file-input v-if="authStore.user" v-model="selectedSheet" @createSheet="createSheet"/>

  <dialog id="my_modal_3" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="font-bold">ნამდვილად გსურთ ფაილის წაშლა?</h3>
      <div class="flex items-center justify-center gap-x-10 pt-5">
        <button class="btn" onclick="setTimeout(() => my_modal_3.close(), 1000);" @click="deleteSheet(deleteId)">დიახ
        </button>
        <button class="btn btn-neutral" onclick="my_modal_3.close();">არა</button>
      </div>
    </div>
  </dialog>

  <dialog id="my_modal_4" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="font-bold">ნამდვილად გსურთ ყველა ჩანაწერის გადატანა?</h3>
      <div class="flex items-center justify-center gap-x-10 pt-5">
        <button class="btn" onclick="setTimeout(() => my_modal_4.close(), 1000);" @click="saveSheet(saveId)">დიახ
        </button>
        <button class="btn btn-neutral" onclick="my_modal_4.close();">არა</button>
      </div>
    </div>
  </dialog>

  <div class="flex flex-col gap-y-5">
    <table class="table table-xs">
      <thead>
      <tr>
        <th>ფაილის სახელი</th>
        <th>ატვირთვის თარიღი</th>
        <th>ფაილის სტატუსი</th>
        <th>ფაილის ნახვა</th>
        <th v-if="authStore.user">ფაილის წაშლა</th>
        <th v-if="authStore.user">ბაზაში გადატანა</th>
      </tr>
      </thead>

      <tbody v-if="files && files.length> 0">
      <tr v-for="(sheet, index) in files" :key="index">
        <td>
          <div class="flex items-center gap-x-2.5">
            <img src="/src/assets/excel.svg.png" alt="excel icon" class="w-8"/>
            {{ sheet.fileName }}
          </div>
        </td>
        <td v-text="formatDate(sheet.date)"/>
        <td>
          <img src="/src/assets/check_circle.svg" alt="check icon"
               v-if="sheet.status === 'GOOD' || sheet.status === 'TRANSFERRED_GOOD'"/>
          <img src="/src/assets/warning.svg" alt="warning icon"
               v-else-if="sheet.status === 'WARNING' ||  sheet.status === 'TRANSFERRED_WARNING'"/>
        </td>
        <td>
          <img src="/src/assets/visibility.svg" alt="view icon" class="cursor-pointer"
               @click="recordId = sheet.id; fetchSheetData()" onclick="my_modal_1.showModal(); "/>
        </td>
        <td v-if="authStore.user">
          <img src="/src/assets/delete.svg" alt="delete icon" @click="deleteId = sheet.id"
               onclick="my_modal_3.showModal()" class="cursor-pointer"/>
        </td>
        <td v-if="authStore.user">
          <button v-if="sheet.status === 'GOOD' || sheet.status === 'WARNING'"
                  onclick="my_modal_4.showModal()">
            <img src="/src/assets/save.svg" alt="save icon" @click="saveId = sheet.id"/>
          </button>
        </td>
      </tr>
      </tbody>

      <tbody v-else-if="files && files.length === 0">
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

    <pagination v-model:current-page="currentPage" v-model:page-size="pageSize" v-model:total-pages="totalPages"
                v-model:total-elements="totalElements"/>
  </div>

  <dialog id="my_modal_1" class="modal">
    <div class="modal-box max-w-7xl pt-8">
      <div class="overflow-x-auto space-y-4">
        <div class="flex items-center justify-between px-4 font-semibold">
          <p>ჯამური თანხა - {{ details.amount }}</p>
          <p>ჩანაწერი - {{ details.total }}</p>
          <p>უხარვეზო - {{ details.ok }}</p>
          <p>დახარვეზებული - {{ details.warning }}</p>
        </div>
        <div class="flex gap-x-16">
          <table class="table w-3/4 min-h-[62vh]">
            <thead>
            <tr>
              <th>N</th>
              <th>ჩარიცხვის თარიღი</th>
              <th>სრული თანხა</th>
              <th>გადამხდელი</th>
              <th>დანიშნულება</th>
              <th>აღწერა</th>
              <th>სტატუსი</th>
            </tr>
            </thead>
            <tbody v-if="sheet && sheet.length > 0">
            <tr v-for="(extraction, index) in sheet" :key="index">
              <td v-text="extraction.id"/>
              <td v-text="formatDate(extraction.date)"/>
              <td v-text="extraction.totalAmount"/>
              <td v-text="extraction.tax"/>
              <td v-text="extraction.purpose"/>
              <td v-text="extraction.description"/>
              <td>
                <img src="/src/assets/check_circle.svg" alt="check icon" v-if="extraction.status === 'GOOD'"/>
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

          <div class="flex flex-col gap-y-10 font-medium">
            <div class="flex flex-col gap-y-2.5">
              <p>ჩარიცხვის თარიღი</p>

              <div class="flex flex-col gap-y-2">
                <div class="flex items-center gap-x-2">
                  <input type="date" class="text-sm" v-model="filter.startDate"/>
                </div>

                <div class="flex items-center gap-x-2">
                  <input type="date" class="text-sm" v-model="filter.endDate"/>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-y-2">
              <p>სრული თანხა</p>

              <div class="flex flex-col gap-y-5">
                <input type="text" class="input input-bordered input-sm focus:outline-0"
                       placeholder="მინ"
                       v-model="filter.totalAmountStart"
                />

                <input type="text" class="input input-bordered input-sm focus:outline-0"
                       placeholder="მაქს"
                       v-model="filter.totalAmountEnd"
                />
              </div>
            </div>

            <div class="flex flex-col gap-y-2">
              <p>სტატუსი</p>

              <div class="flex flex-col gap-y-2.5">
                <div class="flex items-center gap-x-2">
                  <input type="radio" name="radio" value="" class="radio radio-xs focus:outline-none"
                         checked="checked" v-model="filter.status"/>
                  <span class="text-xs">ყველა</span>
                </div>

                <div class="flex items-center gap-x-2">
                  <input type="radio" name="radio" value="GOOD" class="radio radio-xs focus:outline-none"
                         v-model="filter.status"/>
                  <span class="text-xs">უხარვეზო</span>
                </div>

                <div class="flex items-center gap-x-2">
                  <input type="radio" name="radio" value="WARNING" class="radio radio-xs focus:outline-none"
                         v-model="filter.status"/>
                  <span class="text-xs">დახარვეზებული</span>
                </div>
              </div>
            </div>

            <button class="btn btn-neutral btn-sm"
                    @click="clearFilter();">გასუფთავება
            </button>
          </div>
        </div>
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
        <form method="dialog"
              @submit="_currentPage=1; sheet = null; clearFilter();">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form method="dialog"
              @submit="_currentPage=1; sheet = null; clearFilter();">
          <button class="btn">დახურვა</button>
        </form>
      </div>
    </div>
  </dialog>
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
