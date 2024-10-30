<script setup>
import useUploads from "/src/composables/useUploads";
import {computed, onMounted, ref, watch} from "vue";
import useSheet from "../composables/useSheet.js";
import FileInput from "../components/uploads/FileInput.vue"
import {useAuthStore} from "../stores/auth.js";

const {
  sheets,
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  fetchSheets,
  formatDate,
  deleteSheet,
  saveSheet,
  createSheet,
  selectedSheet
} = useUploads();

const {
  sheet,
  _currentPage,
  _totalPages,
  recordId,
  details,
  fetchSheetData,
  filter,
  clearFilter
} = useSheet()

const options = ref([])

onMounted(async () => {
  await fetchSheets();
  options.value = [10, 20, 50];
  if (totalElements.value > 100) {
    options.value.push(100);
  }
  if (totalElements.value > 500) {
    options.value.push(250, 500);
  }
});

const deleteId = ref();
const saveId = ref();

const authStore = useAuthStore();

const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1);

const endIndex = computed(() => {
  const ei = (startIndex.value + pageSize.value - 1)
  if (ei > totalElements.value) {
    return totalElements.value;
  } else {
    return ei
  }
});

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

watch(currentPage, async (value) => {
  if (value > totalPages) {
    currentPage.value = totalPages.value;
  }
  if (value) {
    await fetchSheets()
  }
})

function onEnter(event) {
  const page = parseInt(event.target.value);
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  } else {
    currentPage.value = 1;
  }
}

function validatePage(event) {
  if (event.target.value) {
    const page = parseInt(event.target.value);
    if (page < 1) {
      currentPage.value = 1;
    } else if (page > totalPages.value) {
      currentPage.value = totalPages.value;
    } else {
      currentPage.value = page;
    }
  }
}

const showDp = ref(false)
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

  <div class="overflow-x-auto h-[75vh]">
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

  <div class="fixed bottom-0 w-screen bg-white p-4 shadow-md flex justify-center items-center gap-x-10">
    <div class="flex items-center gap-x-4 relative">
      <span><strong>{{ startIndex }} - {{ endIndex }}</strong> of <strong>{{ totalElements }}</strong></span>
      <i class="fas fa-caret-down cursor-pointer" @click="showDp = !showDp"/>
      <ul class="absolute flex flex-col bottom-10 bg-white shadow" v-if="showDp">
        <li v-for="(o, i) in options" :key="i" @click="showDp = false; pageSize = o; currentPage = 1;"
            class="flex items-center gap-x-5 whitespace-nowrap cursor-pointer hover:bg-gray-300 py-2.5 px-5">
          {{ o }} გვერდზე <i v-if="pageSize === o" class="fa-solid fa-check text-blue-500"></i>
        </li>
      </ul>
    </div>

    <div class="flex items-center gap-x-7">
      <i class="fas fa-angle-double-left cursor-pointer" :class="{
          'text-gray-300 cursor-default': currentPage === 1
        }" @click="currentPage = 1"/>
      <i class="fas fa-angle-left cursor-pointer" :class="{
          'text-gray-300 cursor-default': currentPage === 1
        }" @click="previousPage"></i>

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
        }" @click="nextPage"></i>
      <i class="fas fa-angle-double-right cursor-pointer" :class="{
          'text-gray-300 cursor-default': currentPage === totalPages
        }" @click="currentPage = totalPages"></i>
    </div>
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
              <th>თარიღი</th>
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
              <td v-text="extraction.date"/>
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
              <p>თარიღი</p>

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
              <p>თანხა</p>

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
                  <span class="text-xs">ერთად</span>
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
