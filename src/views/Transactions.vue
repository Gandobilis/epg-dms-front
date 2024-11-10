<script setup>
import {computed, onMounted, ref, watch} from "vue";
import useCenters from "/src/composables/useCenters.js";
import useUploads from "/src/composables/useUploads.js";
import RecursiveRow from "/src/components/RecursiveRow.vue";
import {useAuthStore} from "/src/stores/auth.js";
import DateFilter from "../components/FilterDate.vue";
import Pagination from "../components/Pagination.vue";

const {
  records,
  getFees,
  currentPage,
  totalPages,
  totalElements,
  filter,
  pageSize,
  withdrawTypes,
  sortOptions,
  sortByDir,
  formatDate,
} = useUploads()

const {
  getRegionsByParentId,
  _regions,
  _serviceCenters,
  updateRecord,
  extractionFee,
  handleEditClick,
  divide,
  sc,
  getServiceCenters,
} = useCenters()

const showDp = ref(false);

const _error = ref(false)
const handleSaveClick = async () => {
  if (!extractionFee.value.region || !extractionFee.value.serviceCenter || !extractionFee.value.projectID || !extractionFee.value.withdrawType) {
    _error.value = true;
  } else {
    await updateRecord();
    await getFees();
    document.getElementById('my_modal_1').close()
  }
}

const hec = async (extraction) => {
  _error.value = false;
  await handleEditClick(extraction)
}

const id = ref()
const amount = ref('')
const remainder = ref();
const error = ref(false)
watch(amount, (newAmount) => {
  error.value = remainder.value < newAmount;
})


const handleDivideClick = async (args) => {
  document.getElementById('my_modal_7').showModal()
  id.value = args[0];
  remainder.value = args[1];
}


const handleDivision = async () => {
  if (remainder < amount.value) {
    error.value = true;
    return;
  }
  await divide(id.value, mapToArray())
  await getFees()
  id.value = undefined;
  amount.value = '';
  remainder.value = undefined;
  error.value = false;
}

const options = ref([])

onMounted(async () => {
  await getRegionsByParentId();
  await getFees();
  await getServiceCenters()
  if (totalElements.value > 10) {
    options.value.push(10);
  }
  if (totalElements.value > 20) {
    options.value.push(20);
  }
  if (totalElements.value > 50) {
    options.value.push(50);
  }
  if (totalElements.value > 100) {
    options.value.push(100);
  }
  if (totalElements.value > 250) {
    options.value.push(250);
  }
  if (totalElements.value > 500) {
    options.value.push(500);
  }
})

const regex = /^(\d+(\s\d+)*)$/;
const cleanAmount = () => amount.value.replace(/\s+/g, ' ').trim();
const mapToArray = () => cleanAmount().split(' ').map(Number);
const sumArray = () => mapToArray().reduce((a, b) => a + b, 0);
const validateAmount = () => {
  const numbers = mapToArray();
  return regex.test(cleanAmount()) && numbers.every(n => n > 0) && (sumArray() <= remainder.value);
};

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
        await getFees();
      }
    }
)

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

const searchTerm = ref("");
const isDropdownOpen = ref(false);

const filteredServiceCenters = computed(() =>
    sc.value.filter(center => center.name.toLowerCase().includes(searchTerm.value.trim()))
);

function selectCenter(centerName, parentName) {
  extractionFee.value.serviceCenter = centerName;
  searchTerm.value = centerName;
  extractionFee.value.region = parentName;
  isDropdownOpen.value = false;
}

function closeDropdown() {
  setTimeout(() => isDropdownOpen.value = false, 200);
}

const clearRegion = () => {
  filter.value.region = 'აირჩიეთ რეგიონი';
  clearSC();
}

const clearSC = () => {
  filter.value.serviceCenter = 'აირჩიეთ მ/ც';
}

const clearType = () => {
  filter.value.withdrawType = 'აირჩიეთ ტიპი';
}

const clearStatus = () => {
  filter.value.status = 'აირჩიეთ სტატუსი';
}

const clearClarification = () => {
  filter.value.clarificationDateStart = undefined;
  filter.value.clarificationDateEnd = undefined;
}

const clearChange = () => {
  filter.value.changeDateStart = undefined;
  filter.value.changeDateEnd = undefined;
}

const clearTransfer = () => {
  filter.value.transferDateStart = undefined;
  filter.value.transferDateEnd = undefined;
}

const clearExtraction = () => {
  filter.value.extractionDateStart = undefined;
  filter.value.extractionDateEnd = undefined;
}

const clearFilter = () => {
  filter.value = {
    region: 'აირჩიეთ რეგიონი',
    serviceCenter: 'აირჩიეთ მ/ც',
    withdrawType: 'აირჩიეთ ტიპი',
    status: 'აირჩიეთ სტატუსი',
    totalAmountStart: undefined,
    totalAmountEnd: undefined,

    orderN: undefined,
    projectID: undefined,
    purpose: undefined,
    tax: undefined,
    description: undefined,

    clarificationDateStart: undefined,
    clarificationDateEnd: undefined,

    changeDateStart: undefined,
    changeDateEnd: undefined,

    transferDateStart: undefined,
    transferDateEnd: undefined,

    extractionDateStart: undefined,
    extractionDateEnd: undefined,

    note: undefined,
  };
};

async function getSelectedParentId(event) {
  await getRegionsByParentId(Number(event.target.selectedOptions[0].getAttribute('data-id')));
}
</script>

<template>
  <!--ფილტრი-->
  <div class="flex flex-col gap-y-5">
    <!--პირველი ხაზი-->
    <div class="filter-row">
      <!--რეგიონი-->
      <div class="select-container">
        <select class="filter-select" v-model="filter.region" @change="getSelectedParentId">
          <option disabled selected>აირჩიეთ რეგიონი</option>

          <option :value="region.name" v-for="(region, index) in _regions" v-text="region.name" :data-id="region.id"
                  :key="index"/>
        </select>

        <button class="filter-clear-btn" @click="clearRegion">✕</button>
      </div>
      <!--რეგიონი-->

      <!--მ/ც-->
      <div class="select-container">
        <select class="filter-select" v-model="filter.serviceCenter">
          <option disabled selected>აირჩიეთ მ/ც</option>

          <option :value="center.name" v-for="(center, index) in _serviceCenters" v-text="center.name" :key="index"/>
        </select>

        <button class="filter-clear-btn" @click="clearSC">✕</button>
      </div>
      <!--მ/ც-->

      <!--ტიპი-->
      <div class="select-container">
        <select class="filter-select" v-model="filter.withdrawType">
          <option disabled selected>აირჩიეთ ტიპი</option>

          <option :value="type" v-for="(type, index) in withdrawTypes" v-text="type" :key="index"/>
        </select>

        <button class="filter-clear-btn" @click="clearType">✕</button>
      </div>
      <!--ტიპი-->

      <!--სტატუსი-->
      <div class="select-container">
        <select class="filter-select" v-model="filter.status">
          <option disabled selected>აირჩიეთ სტატუსი</option>

          <option value="TRANSFER_COMPLETE">შევსებული</option>

          <option value="TRANSFERRED">შესავსები</option>

          <option value="CANCELED">გაუქმებული</option>
        </select>

        <button class="filter-clear-btn" @click="clearStatus">✕</button>
      </div>
      <!--სტატუსი-->

      <!--ბრუნვა-->
      <div class="grid grid-cols-3 items-center gap-x-8">
        <p class="filter-label">ბრუნვა (კრედ)</p>

        <input type="text" class="filter-input" placeholder="მინ" v-model="filter.totalAmountStart"/>

        <input type="text" class="filter-input" placeholder="მაქს" v-model="filter.totalAmountEnd"/>
      </div>
      <!--ბრუნვა-->
    </div>
    <!--პირველი ხაზი-->

    <!--მეორე ხაზი-->
    <div class="filter-row">
      <!--ორდერის N-->
      <input type="text" class="filter-input" v-model="filter.orderN" placeholder="ორდერის N"/>
      <!--ორდერის N-->

      <!--პროექტის N-->
      <input type="text" class="filter-input" v-model="filter.projectID" placeholder="პროექტის N"/>
      <!--პროექტის N-->

      <!--დანიშნულება-->
      <input type="text" class="filter-input" v-model="filter.purpose" placeholder="დანიშნულება"/>
      <!--დანიშნულება-->

      <!--ID-->
      <input type="text" class="filter-input" v-model="filter.tax" placeholder="ID"/>
      <!--ID-->

      <!--დამატებითი ინფორმაცია-->
      <input type="text" class="input input-bordered input-sm w-full focus:outline-0" v-model="filter.description"
             placeholder="დამატებითი ინფორმაცია"/>
      <!--დამატებითი ინფორმაცია-->
    </div>
    <!--მეორე ხაზი-->

    <!--მესამე ხაზი-->
    <div class="filter-row">
      <date-filter v-model:start-date="filter.clarificationDateStart" v-model:end-date="filter.clarificationDateEnd"
                   label="გარკვევის თარიღი" @clear="clearClarification"/>

      <date-filter v-model:start-date="filter.changeDateStart" v-model:end-date="filter.changeDateEnd"
                   label="ცვლილების თარიღი" @clear="clearChange"/>

      <date-filter v-model:start-date="filter.transferDateStart" v-model:end-date="filter.transferDateEnd"
                   label="გადმოტანის თარიღი" @clear="clearTransfer"/>

      <date-filter v-model:start-date="filter.extractionDateStart" v-model:end-date="filter.extractionDateEnd"
                   label="ჩარიცხვის თარიღი" @clear="clearExtraction"/>

      <div class="flex flex-col gap-y-2.5">
        <input type="text" class="input input-bordered w-full input-sm focus:outline-0"
               v-model="filter.note" placeholder="შენიშვნა"/>

        <div class="grid grid-cols-2 items-center gap-x-5">
          <select class="select select-bordered select-sm w-full focus:outline-0"
                  v-model="sortByDir">
            <option disabled>დალაგება</option>
            <option :value="option" v-for="(option, index) in sortOptions" v-text="option.text" :key="index"/>
          </select>

          <button class="btn btn-neutral btn-sm" @click="clearFilter">გასუფთავება</button>
        </div>
      </div>
    </div>
    <!--მესამე ხაზი-->
  </div>
  <!--ფილტრი-->

  <!--ცხრილი-->
  <div class="flex flex-col gap-y-5 mt-5">
    <table class="table table-xs">
      <thead>
      <tr>
        <th>N</th>
        <th>ორდერის N</th>
        <th>რეგიონი</th>
        <th>მ/ც</th>
        <th>პროექტის N</th>
        <th>ტიპი</th>
        <th>გარკვევის თარიღი</th>
        <th>ცვლილების თარიღი</th>
        <th>შენიშვნა</th>
        <th>ჩარიცხვის თარიღი</th>
        <th>ბრუნვა</th>
        <th>ID</th>
        <th>დანიშნულება</th>
        <th>დამატებითი ინფორმაცია</th>
        <th v-if="authStore.user"/>
      </tr>
      </thead>
      <tbody v-if="records && records.length > 0">
      <RecursiveRow @handleDivideClick="handleDivideClick" @handleEditClick="hec" :records="records"/>
      </tbody>

      <tbody v-else-if="records && records.length === 0">
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
    <!--ცხრილი-->


    <div v-if="records && records.length > 0"
         class="fixed bottom-0 w-screen bg-white p-4 shadow-md flex justify-center items-center gap-x-10">
      <div class="flex items-center gap-x-4 relative">
        <span><strong>{{ startIndex }} - {{ endIndex }}</strong> of <strong>{{ totalElements }}</strong></span>
        <i class="fas fa-caret-down cursor-pointer" @click="showDp = !showDp"/>
        <ul class="absolute flex flex-col bottom-10 bg-white shadow" v-if="showDp">
          <li v-for="(o, i) in options" :key="i" @click="showDp = false; pageSize = o; currentPage = 1;"
              class="flex items-center gap-x-2.5 whitespace-nowrap cursor-pointer hover:bg-gray-300 py-2 px-3.5 text-sm">
            {{ o }} ერთ გვერდზე <i v-if="pageSize === o" class="fa-solid fa-check text-blue-500"></i>
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
  </div>

  <dialog id="my_modal_1" class="modal">
    <div class="modal-box max-w-[45vw] flex flex-col gap-y-3 text-sm" v-if="extractionFee">
      <div class="flex gap-x-20">
        <!-- Left Column -->
        <div class="flex flex-col w-1/2 gap-y-2">
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">ორდერის N</label>
            <div class="grid grid-cols-2 gap-x-2 max-w-xs">
              <input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
                     v-model="extractionFee.orderN"/>
              <select class="filter-select" v-model="extractionFee.orderStatus">
                <option value="ORDER_INCOMPLETE">შესავსები</option>

                <option value="ORDER_COMPLETE">შევსებული</option>

                <option value="CANCELED">გაუქმებული</option>
              </select>
            </div>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">რეგიონი</label>
            <input :value="extractionFee.region" class="input input-bordered max-w-xs input-sm mb-2 focus:outline-0"
                   disabled>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">მ/ც</label>
            <div class="relative max-w-xs">
              <input
                  type="text"
                  v-model="searchTerm"
                  placeholder="აირჩიეთ მ/ც"
                  @focus="isDropdownOpen = true"
                  @blur="closeDropdown"
                  class="input input-bordered input-sm mb-2 focus:outline-0 w-full"
              />

              <!-- Dropdown options -->
              <div
                  v-if="isDropdownOpen && filteredServiceCenters.length"
                  class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                <div
                    v-for="(center, index) in filteredServiceCenters"
                    :key="index"
                    @mousedown="selectCenter(center.name, center.parent.name)"
                    class="p-2 hover:bg-gray-100 cursor-pointer">
                  {{ center.name }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">პროექტის N</label>
            <input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
                   v-model="extractionFee.projectID"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">ტიპი</label>
            <select class="select select-bordered select-sm w-full max-w-xs focus:outline-0"
                    v-model="extractionFee.withdrawType">
              <option disabled selected>აირჩიეთ ტიპი</option>
              <option :value="type" v-for="(type, index) in withdrawTypes" v-text="type" :key="index"/>
            </select>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">შენიშვნა</label>
            <textarea v-if="extractionFee"
                      class="textarea textarea-bordered textarea-xs w-full max-w-xs focus:outline-0 resize-none"
                      v-model="extractionFee.note"></textarea>
          </div>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col justify-between w-1/2 gap-y-2">
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">გარკვევის თარიღი</label>
            <div v-text="extractionFee.clarificationDate ? formatDate(extractionFee.clarificationDate) : ''"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">ცვლილების თარიღი</label>
            <div>
              <p v-text="extractionFee.changeDate ? formatDate(extractionFee.changeDate) : ''"/>
              <p class="text-neutral underline font-bold" v-if="extractionFee.changeDate"
                 v-text="`${extractionFee.changePerson.firstName} ${extractionFee.changePerson.lastName}`"/>
            </div>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">გადმოტანის თარიღი</label>
            <div>
              <p v-text="extractionFee.transferDate ? formatDate(extractionFee.transferDate) : ''"/>
              <p v-if="extractionFee.transferPerson" class="text-neutral underline font-bold"
                 v-text="`${extractionFee.transferPerson.firstName} ${extractionFee.transferPerson.lastName}`"/>
            </div>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">ჩარიცხვის თარიღი</label>
            <div v-text="extractionFee.extractionDate ? formatDate(extractionFee.extractionDate) : ''"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">ბრუნვა</label>
            <div v-text="extractionFee.totalAmount"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">დანიშნულება</label>
            <div v-text="extractionFee.purpose"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">დამატებიტი ინფორმაცია</label>
            <div v-text="extractionFee.description"/>
          </div>
        </div>
      </div>

      <span class="text-error" v-if="_error">გთხოვთ შეავსოთ ყველა სავადლებულო ველი!</span>

      <div class="flex items-center justify-between mt-4">
        <div class="flex justify-between items-center">
          <div class="modal-action">
            <button class="btn btn-neutral" @click="handleSaveClick">შენახვა</button>

            <form method="dialog">
              <button class="btn">გაუქმება</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </dialog>

  <dialog id="my_modal_7" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 focus:outline-none">✕</button>
      </form>
      <h3 class="text-lg font-bold" v-text="`გთხოვთ შეიყვანოთ თანხა! ნაშთი ${remainder}`"/>
      <div class="modal-action items-center">
        <input class="input input-bordered w-full max-w-xs input-sm focus:outline-0" type="text" v-model="amount"
               placeholder="10 25 50"/>
        <form method="dialog" class="flex items-center justify-end w-full gap-x-5">
          <button class="btn btn-neutral btn-sm" v-text="'გაყოფა'"
                  :disabled="!validateAmount()"
                  @click="handleDivision"/>
          <button class="btn btn-sm" v-text="'გაუქმება'"/>
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