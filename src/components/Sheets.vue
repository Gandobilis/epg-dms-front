<script setup>
import useSheets from "/src/composables/useSheets";
import {onMounted, ref, watch} from "vue";
import useSheet from "../composables/useSheet.js";

const {sheets, currentPage, selectedSheet, totalPages, fetchSheets, createSheet, formatDate, deleteSheet, saveSheet} = useSheets();

const {
  sheet,
  _currentPage,
  _totalPages,
  recordId,
  ok,
  warning,
  total,
  amount,
  status,
  filter_amount,
  startDate,
  endDate,
  fetchSheetData
} = useSheet()

onMounted(async () => {
  await fetchSheets();
});

const deleteId = ref();
const saveId = ref();

const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = async (event) => {
  selectedSheet.value = event.target.files[0]
  await createSheet();
  event.target.value = '';
  setTimeout(() => selectedSheet.value = '', 2000);
};

watch(status, async () => {
  await fetchSheetData();
});

watch(filter_amount, async () => {
  await fetchSheetData();
})

watch(startDate, async () => {
  await fetchSheetData();
})

watch(endDate, async () => {
  await fetchSheetData();
})
</script>

<template>
  <div class="flex items-center justify-between mb-3.5 ml-3.5">
    <div class="flex gap-x-5">
      <router-link class="btn btn-sm" to="/">ატვირთულები</router-link>
      <router-link class="btn btn-sm" to="/records">შენახულები</router-link>
    </div>

    <div class="flex items-center gap-x-2.5">
      <input
          ref="fileInput"
          type="file"
          @change="handleFileChange"
          class="hidden"
      />
      <button
          @click="triggerFileInput"
          class="btn btn-sm"
      >
        აირჩიეთ ფაილი
      </button>
      <p class="text-sm">{{ selectedSheet ? selectedSheet.name : 'ფაილი არჩეული არ არის' }}</p>
    </div>
  </div>

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

  <div class="overflow-x-auto h-[80vh]">
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
          <img src="/src/assets/delete.svg" alt="delete icon" @click="deleteId = sheet.id"
               onclick="my_modal_3.showModal()" class="cursor-pointer"/>
        </td>
        <td>
          <img src="/src/assets/save.svg" alt="save icon" @click="saveId = sheet.id"
               onclick="my_modal_4.showModal()" class="cursor-pointer"/>
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
    <div class="modal-box max-w-7xl pt-8">
      <div class="overflow-x-auto space-y-4">
        <div class="flex items-center justify-between px-4 font-semibold">
          <p>ჯამური თანხა - {{ amount }}</p>
          <p>ჩანაწერი - {{ total }}</p>
          <p>უხარვეზო - {{ ok }}</p>
          <p>დახარვეზებული - {{ warning }}</p>
        </div>
        <div class="flex gap-x-16">
          <table class="table w-3/4 min-h-[62vh]">
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

          <div class="flex flex-col gap-y-10 font-medium">
            <div class="flex flex-col gap-y-2.5">
              <p>თარიღი</p>

              <div class="flex flex-col gap-y-2">
                <div class="flex items-center gap-x-2">
                  <input type="date" class="text-sm" v-model="startDate"/>
                  <span class="text-xs">დან</span>
                </div>

                <div class="flex items-center gap-x-2">
                  <input type="date" class="text-sm" v-model="endDate"/>
                  <span class="text-xs">მდე</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-y-2">
              <p>თანხა</p>

              <input
                  type="text"
                  v-model="filter_amount"
                  placeholder="შეიყვანეთ თანხა"
                  class="input input-bordered input-xs w-full max-w-xs focus:outline-none"/>
            </div>

            <div class="flex flex-col gap-y-2">
              <p>სტატუსი</p>

              <div class="flex flex-col gap-y-2.5">
                <div class="flex items-center gap-x-2">
                  <input type="radio" name="radio" value="" class="radio radio-xs focus:outline-none"
                         checked="checked" v-model="status"/>
                  <span class="text-xs">ერთად</span>
                </div>

                <div class="flex items-center gap-x-2">
                  <input type="radio" name="radio" value="ok" class="radio radio-xs focus:outline-none"
                         v-model="status"/>
                  <span class="text-xs">უხარვეზო</span>
                </div>

                <div class="flex items-center gap-x-2">
                  <input type="radio" name="radio" value="warn" class="radio radio-xs focus:outline-none"
                         v-model="status"/>
                  <span class="text-xs">დახარვეზებული</span>
                </div>
              </div>
            </div>

            <button class="btn btn-neutral btn-sm"
                    @click="startDate = null; endDate = null; filter_amount = null; status = ''">გასუფთავება
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
              @submit="_currentPage=1; sheet = null; startDate = null; endDate = null; filter_amount = null; status = ''">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form method="dialog"
              @submit="_currentPage=1; sheet = null;startDate = null; endDate = null; filter_amount = null; status = null">
          <button class="btn">დახურვა</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
