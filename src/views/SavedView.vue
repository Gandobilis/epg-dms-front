<script setup>
import {onMounted, ref, watch} from "vue";
import useCenters from "../composables/useCenters.js"
import useUploads from "../composables/useUploads.js"
import RecursiveRow from "../components/RecursiveRow.vue";

const {
  records,
  getFees,
  currentPage,
  totalPages,
  filter,
  pageSize,
  withdrawTypes,
  sortOptions,
  pageOptions,
  sortByDir,
} = useUploads()

const {
  getRegionsByParentId,
  regions,
  _regions,
  serviceCenters,
  _serviceCenters,
  updateRecord,
  extractionFee,
  deleteRecord,
  handleEditClick,
  divide
} = useCenters()

const handleSaveClick = async () => {
  if (!extractionFee.value.orderN || !extractionFee.value.region || !extractionFee.value.serviceCenter || !extractionFee.value.projectID || !extractionFee.value.withdrawType) {
    document.getElementById('my_modal_3').showModal()
  } else {
    await updateRecord();
    await getFees();
  }
}

const handleDeleteClick = async () => {
  await deleteRecord();
  await getFees();
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

onMounted(async () => {
  await getRegionsByParentId();
  await getFees();
})

const regex = /^(\d+(\s\d+)*)$/;
const cleanAmount = () => amount.value.replace(/\s+/g, ' ').trim();
const mapToArray = () => cleanAmount().split(' ').map(Number);
const sumArray = () => mapToArray().reduce((a, b) => a + b, 0);
const validateAmount = () => {
  const numbers = mapToArray();
  return regex.test(cleanAmount()) && numbers.every(n => n > 0) && (sumArray() <= remainder.value);
};
</script>

<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-5">
      <div class="flex flex-col gap-y-2 text-sm">
        <label class="font-semibold text-gray-600">რეგიონი</label>
        <div class="flex items-center gap-x-1">
          <select class="select select-bordered select-sm w-full max-w-xs focus:outline-0"
                  v-model="filter.region"
                  @change="(event) => getRegionsByParentId(Number(event.target.selectedOptions[0].getAttribute('data-id')))">
            <option disabled selected>აირჩიეთ რეგიონი</option>
            <option :value="region.name" v-for="(region, index) in _regions" v-text="region.name" :key="index"
                    :data-id="region.id"/>
          </select>

          <button class="btn btn-sm btn-circle btn-ghost" @click="filter.region = 'აირჩიეთ რეგიონი'">
            ✕
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-y-2 text-sm">
        <label class="font-semibold text-gray-600">ორდერის ნომერი</label>
        <input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
               v-model="filter.orderN"
        />
      </div>

      <div class="flex flex-col gap-y-2 text-sm">
        <label class="font-semibold text-gray-600">პროექტის Id</label>
        <input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
               v-model="filter.projectID"
        />
      </div>

      <div class="flex flex-col gap-y-2 text-sm">
        <label class="font-semibold text-gray-600">გადარიცხვის ტიპი</label>
        <div class="flex items-center gap-x-1">
          <select class="select select-bordered select-sm w-full max-w-xs focus:outline-0"
                  v-model="filter.withdrawType">
            <option disabled selected>აირჩიეთ გადარიცხვის ტიპი</option>
            <option :value="type" v-for="(type, index) in withdrawTypes" v-text="type" :key="index"/>
          </select>

          <button class="btn btn-sm btn-circle btn-ghost" @click="filter.withdrawType = 'აირჩიეთ გადარიცხვის ტიპი'">
            ✕
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-y-2 text-sm">
        <label class="font-semibold text-gray-600">შენიშვნა</label>
        <input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
               v-model="filter.note"
        />
      </div>
    </div>

    <div class="grid grid-cols-5 mt-2.5">
      <div class="flex flex-col gap-y-2 text-sm">
        <label class="font-semibold text-gray-600">სერვისცენტრი</label>
        <div class="flex items-center gap-x-1">
          <select class="select select-bordered select-sm w-full max-w-xs focus:outline-0"
                  v-model="filter.serviceCenter">
            <option disabled selected>აირჩიეთ სერვისცენტრი</option>
            <option :value="center.name" v-for="(center, index) in _serviceCenters" v-text="center.name" :key="index"/>
          </select>

          <button class="btn btn-sm btn-circle btn-ghost" @click="filter.serviceCenter = 'აირჩიეთ სერვისცენტრი'">
            ✕
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-y-2 text-sm">
        <label class="font-semibold text-gray-600">სრული თანხა</label>
        <div class="grid grid-cols-3 gap-x-5">
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

      <div class="flex flex-col gap-y-2 text-sm">
        <label class="font-semibold text-gray-600">მიზანი</label>
        <input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
               v-model="filter.purpose"
        />
      </div>

      <div class="flex flex-col gap-y-2 text-sm">
        <label class="font-semibold text-gray-600">აღწერა</label>
        <input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
               v-model="filter.description"
        />
      </div>

      <div class="flex flex-col gap-y-2 text-sm">
        <label class="font-semibold text-gray-600">სტატუსი</label>
        <div class="flex items-center gap-x-1">
          <select class="select select-bordered select-sm w-full max-w-xs focus:outline-0"
                  v-model="filter.status">
            <option :value="undefined" selected>ორივე</option>
            <option value="TRANSFER_COMPLETE">შევსებული</option>
            <option value="TRANSFERRED">შესავსები</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-6 text-sm py-2.5 items-center">
    <div class="flex flex-col gap-y-2 text-sm">
      <label class="font-semibold text-gray-600">გადამხდელი</label>
      <input type="text" class="input input-bordered w-4/5 input-sm focus:outline-0"
             v-model="filter.tax"
      />
    </div>

    <div class="flex flex-col gap-y-10 font-medium">
      <div class="flex flex-col gap-y-2.5">
        <p>გარკვევის თარიღი</p>

        <div class="flex items-center gap-x-1">
          <div class="flex flex-col gap-y-2">
            <input type="date" class="text-sm" v-model="filter.clarificationDateStart"/>

            <input type="date" class="text-sm" v-model="filter.clarificationDateEnd"/>
          </div>

          <button class="btn btn-sm btn-circle btn-ghost"
                  @click="filter.clarificationDateStart = undefined; filter.clarificationDateEnd = undefined">
            ✕
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-y-10 font-medium">
      <div class="flex flex-col gap-y-2.5">
        <p>ბოლო ცვლილება</p>

        <div class="flex items-center gap-x-1">
          <div class="flex flex-col gap-y-2">
            <input type="date" class="text-sm" v-model="filter.changeDateStart"/>

            <input type="date" class="text-sm" v-model="filter.changeDateEnd"/>
          </div>

          <button class="btn btn-sm btn-circle btn-ghost"
                  @click="filter.changeDateStart = undefined; filter.changeDateEnd = undefined">
            ✕
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-y-10 font-medium">
      <div class="flex flex-col gap-y-2.5">
        <p>გადმოტანის თარიღი</p>

        <div class="flex items-center gap-x-1">
          <div class="flex flex-col gap-y-2">
            <input type="date" class="text-sm" v-model="filter.transferDateStart"/>

            <input type="date" class="text-sm" v-model="filter.transferDateEnd"/>
          </div>

          <button class="btn btn-sm btn-circle btn-ghost"
                  @click="filter.transferDateStart = undefined; filter.transferDateEnd = undefined">
            ✕
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-y-10 font-medium">
      <div class="flex flex-col gap-y-2.5">
        <p>ჩარიცხვის თარიღი</p>

        <div class="flex items-center gap-x-1">
          <div class="flex flex-col gap-y-2">
            <input type="date" class="text-sm" v-model="filter.extractionDateStart"/>

            <input type="date" class="text-sm" v-model="filter.extractionDateEnd"/>
          </div>

          <button class="btn btn-sm btn-circle btn-ghost"
                  @click="filter.extractionDateStart = undefined; filter.extractionDateEnd = undefined">
            ✕
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 items-center gap-x-2.5">
      <div class="grid grid-rows-2 gap-y-2.5">
        <div class="flex flex-col gap-y-2 text-sm">
          <div class="flex items-center gap-x-1">
            <select class="select select-bordered select-sm w-full max-w-xs focus:outline-0"
                    v-model="sortByDir">
              <option disabled>დალაგება</option>
              <option :value="option" v-for="(option, index) in sortOptions" v-text="option.text" :key="index"/>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-y-2 text-sm">
          <div class="flex items-center gap-x-1">
            <select class="select select-bordered select-sm w-full max-w-xs focus:outline-0"
                    v-model="pageSize">
              <option disabled>ერთ გვერდზე</option>
              <option :value="option" v-for="(option, index) in pageOptions" v-text="option" :key="index"/>
            </select>
          </div>
        </div>
      </div>

      <button class="btn btn-neutral btn-sm w-fit"
              @click="filter = {
        status: filter.status,
        orderN: undefined,
        region: 'აირჩიეთ რეგიონი',
    serviceCenter: 'აირჩიეთ სერვისცენტრი',
    projectID: undefined,
    withdrawType: 'აირჩიეთ გადარიცხვის ტიპი',
    clarificationDateStart: undefined,
    clarificationDateEnd: undefined,
    changeDateStart: undefined,
    changeDateEnd: undefined,
    transferDateStart: undefined,
    transferDateEnd: undefined,
    extractionDateStart: undefined,
    extractionDateEnd: undefined,
    totalAmount: undefined,
    purpose: undefined,
    note: undefined,
    description: undefined,
    file: undefined,
    totalAmountStart: undefined,
    totalAmountEnd: undefined,
    tax: undefined
    }">გასუფთავება
      </button>
    </div>
  </div>

  <div class="flex flex-col gap-y-5">
    <table class="table table-xs">
      <thead>
      <tr>
        <th>N</th>
        <th>ორდერის N</th>
        <th>რეგიონი</th>
        <th>ს/ც</th>
        <th>პროექტის N</th>
        <th>ტიპი</th>
        <th>გარკვევა</th>
        <th>ცვლილება</th>
        <th>შენიშვნა</th>
        <th>გადმოტანა</th>
        <th>ჩარიცხვა</th>
        <th>თანხა</th>
        <th>გადამხდელი</th>
        <th>მიზანი</th>
        <th>აღწერა</th>
        <th/>
        <th/>
      </tr>
      </thead>
      <tbody v-if="records && records.length > 0">
      <RecursiveRow @handleDivideClick="handleDivideClick" @handleEditClick="handleEditClick" :records="records"/>
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

    <div class="join justify-center w-full" v-if="records && records.length > 0">
      <button class="join-item btn" @click="
            currentPage = currentPage - 1;
          getFees();
          " :disabled="currentPage === 1">
        «
      </button>

      <button class="join-item btn focus:outline-0">
        {{ currentPage }}
      </button>

      <button class="join-item btn" @click="
            currentPage = currentPage + 1;
          getFees();
          " :disabled="currentPage === totalPages">
        »
      </button>
    </div>
  </div>

  <dialog id="my_modal_1" class="modal">
    <div class="modal-box max-w-[45vw] flex flex-col gap-y-3 text-sm" v-if="extractionFee">
      <div class="flex justify-between">
        <!-- Left Column -->
        <div class="flex flex-col w-1/2 gap-y-2">
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">ორდერის ნომერი</label>
            <input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
                   v-model="extractionFee.orderN"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">რეგიონი</label>
            <select class="select select-bordered select-sm w-full max-w-xs focus:outline-0"
                    v-model="extractionFee.region"
                    @change="(event) => getRegionsByParentId(Number(event.target.selectedOptions[0].getAttribute('data-id')))">
              <option disabled selected>აირჩიეთ რეგიონი</option>
              <option :value="region.name" v-for="(region, index) in regions" v-text="region.name" :key="index"
                      :data-id="region.id"/>
            </select>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">სერვისცენტრი</label>
            <select class="select select-bordered select-sm w-full max-w-xs focus:outline-0"
                    v-model="extractionFee.serviceCenter">
              <option disabled selected>აირჩიეთ სერვისცენტრი</option>
              <option :value="center.name" v-for="(center, index) in serviceCenters" v-text="center.name" :key="index"/>
            </select>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">პროექტის Id</label>
            <input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
                   v-model="extractionFee.projectID"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">გადარიცხვის ტიპი</label>
            <select class="select select-bordered select-sm w-full max-w-xs focus:outline-0"
                    v-model="extractionFee.withdrawType">
              <option disabled selected>აირჩიეთ გადარიცხვის ტიპი</option>
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
            <div v-text="extractionFee.clarificationDate"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">ბოლო ცვლილება</label>
            <div v-text="extractionFee.changeDate"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">გადმოტანის თარიღი</label>
            <div v-text="extractionFee.transferDate"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">ატვირთვის თარიღი</label>
            <div v-text="extractionFee.extractionDate"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">სრული თანხა</label>
            <div v-text="extractionFee.totalAmount"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">მიზანი</label>
            <div v-text="extractionFee.purpose"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">აღწერა</label>
            <div v-text="extractionFee.description"/>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-4">
        <div class="flex justify-between items-center">
          <div class="modal-action">
            <form method="dialog">
              <button class="btn btn-neutral" @click="handleSaveClick">შენახვა</button>
            </form>

            <form method="dialog">
              <button class="btn">გაუქმება</button>
            </form>
          </div>
        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-error text-white" @click="handleDeleteClick">წაშლა</button>
          </form>
        </div>
      </div>
    </div>
  </dialog>

  <dialog id="my_modal_3" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">შეცდომა</h3>
      <p class="py-4">გთხოვთ შეავსოთ ყველა სავადლებულო ველი!</p>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-sm">დახურვა</button>
        </form>
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