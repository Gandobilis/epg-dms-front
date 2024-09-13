<script setup>
import {onMounted, watch} from "vue";
import useCenters from "../composables/useCenters.js"
import useUploads from "../composables/useUploads.js"

const {
  records,
  getFees,
  currentPage,
  totalPages,
  filter,
  sortBy,
  sortDir
} = useUploads()

onMounted(async () => {
  await getFees();
})

const {
  getRegionsByParentId,
  regions,
  _regions,
  serviceCenters,
  _serviceCenters,
  updateRecord,
  extractionFee
} = useCenters()

const handleEditClick = async (extraction) => {
  extractionFee.value = {...extraction};
  if (!extractionFee.value.region) {
    extractionFee.value.region = 'აირჩიეთ რეგიონი';
  } else {
    await getRegionsByParentId(regions.value.find(reg => reg.name === extraction.region).id)
  }

  if (!extractionFee.value.serviceCenter) {
    extractionFee.value.serviceCenter = 'აირჩიეთ სერვისცენტრი';
  }
}

const handleSaveClick = async () => {
  if (!extractionFee.value.orderN || !extractionFee.value.region || !extractionFee.value.serviceCenter || !extractionFee.value.projectID || !extractionFee.value.withdrawType) {
    document.getElementById('my_modal_3').showModal()
  } else {
    await updateRecord();
    await getFees();
  }
}

watch(filter, async () => {
  await getFees();
}, {deep: true})

watch(sortBy, async () => {
  await getFees();
})

watch(sortDir, async () => {
  await getFees();
})

const caret = (_sortBy) => {
  if (_sortBy === sortBy.value && sortDir.value === "DESC") {
    return 'v'
  }

  return '^'
}

onMounted(async () => {
  await getRegionsByParentId()
})
</script>

<template>
  <div class="flex justify-between">
    <div class="flex gap-x-5 mb-3.5">
      <button class="btn btn-sm" :class="{'btn-neutral': filter.status === 'TRANSFER_COMPLETE'}"
              @click="filter.status = 'TRANSFER_COMPLETE'; getFees()">
        შევსებული
      </button>
      <button class="btn btn-sm" :class="{'btn-neutral': filter.status === 'TRANSFERRED'}"
              @click="filter.status = 'TRANSFERRED'; getFees()">
        შესავსები
      </button>
    </div>
  </div>

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
        <label class="font-semibold text-gray-600">გადარიხვის ტიპი</label>
        <input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
               v-model="filter.withdrawType"
        />
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
        <label class="font-semibold text-gray-600">ფაილი</label>
        <input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
               v-model="filter.file"/>
      </div>

      <div class="flex flex-col gap-y-2 text-sm">
        <label class="font-semibold text-gray-600">სრული თანხა</label>
        <input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
               v-model="filter.totalAmount"
        />
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
    </div>
  </div>

  <div class="grid grid-cols-5 text-sm py-2.5 items-center">
    <div class="flex flex-col gap-y-10 font-medium">
      <div class="flex flex-col gap-y-2.5">
        <p>გარკვევის თარიღი</p>

        <div class="flex items-center gap-x-1">
          <div class="flex flex-col gap-y-2">
            <div class="flex items-center gap-x-2">
              <input type="date" class="text-sm" v-model="filter.clarificationDateStart"/>
              <span class="text-xs">დან</span>
            </div>

            <div class="flex items-center gap-x-2">
              <input type="date" class="text-sm" v-model="filter.clarificationDateEnd"/>
              <span class="text-xs">მდე</span>
            </div>
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
            <div class="flex items-center gap-x-2">
              <input type="date" class="text-sm" v-model="filter.changeDateStart"/>
              <span class="text-xs">დან</span>
            </div>

            <div class="flex items-center gap-x-2">
              <input type="date" class="text-sm" v-model="filter.changeDateEnd"/>
              <span class="text-xs">მდე</span>
            </div>
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
            <div class="flex items-center gap-x-2">
              <input type="date" class="text-sm" v-model="filter.transferDateStart"/>
              <span class="text-xs">დან</span>
            </div>

            <div class="flex items-center gap-x-2">
              <input type="date" class="text-sm" v-model="filter.transferDateEnd"/>
              <span class="text-xs">მდე</span>
            </div>
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
        <p>ატვირთვის თარიღი</p>

        <div class="flex items-center gap-x-1">
          <div class="flex flex-col gap-y-2">
            <div class="flex items-center gap-x-2">
              <input type="date" class="text-sm" v-model="filter.extractionDateStart"/>
              <span class="text-xs">დან</span>
            </div>

            <div class="flex items-center gap-x-2">
              <input type="date" class="text-sm" v-model="filter.extractionDateEnd"/>
              <span class="text-xs">მდე</span>
            </div>
          </div>

          <button class="btn btn-sm btn-circle btn-ghost"
                  @click="filter.extractionDateStart = undefined; filter.extractionDateEnd = undefined">
            ✕
          </button>
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
    withdrawType: undefined,
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
    file: undefined
    }">გასუფთავება
    </button>
  </div>

  <div class="h-[75vh]">
    <table class="table table-xs">
      <thead>
      <tr>
        <th class="flex items-center gap-x-1">ორდერის ნომერი <span class="cursor-pointer" v-text="caret('orderN')"
                                                                   @click="sortBy = 'orderN'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/>
        </th>
        <th>რეგიონი <span class="cursor-pointer" v-text="caret('region')"
                          @click="sortBy = 'region'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/></th>
        <th>სერვისცენტრი <span class="cursor-pointer" v-text="caret('serviceCenter')"
                               @click="sortBy = 'serviceCenter'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/></th>
        <th>პროექტის Id <span class="cursor-pointer" v-text="caret('projectID')"
                              @click="sortBy = 'projectID'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/></th>
        <th>გადარიხვის ტიპი <span class="cursor-pointer" v-text="caret('withdrawType')"
                                  @click="sortBy = 'withdrawType'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/></th>
        <th>გარკვევის თარიღი <span class="cursor-pointer" v-text="caret('clarificationDate')"
                                   @click="sortBy = 'clarificationDate'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/></th>
        <th>ბოლო ცვლილება <span class="cursor-pointer" v-text="caret('changeDate')"
                                @click="sortBy = 'changeDate'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/></th>
        <th>ფაილი <span class="cursor-pointer" v-text="caret('file')"
                        @click="sortBy = 'file'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/></th>
        <th>გადმოტანის თარიღი <span class="cursor-pointer" v-text="caret('transferDate')"
                                    @click="sortBy = 'transferDate'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/></th>
        <th>შენიშვნა <span class="cursor-pointer" v-text="caret('note')"
                           @click="sortBy = 'note'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/></th>
        <th>ატვირთვის თარიღი <span class="cursor-pointer" v-text="caret('transferDate')"
                                   @click="sortBy = 'transferDate'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/></th>
        <th class="flex items-center gap-x-1">სრული თანხა <span class="cursor-pointer" v-text="caret('totalAmount')"
                                                                @click="sortBy = 'totalAmount'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/>
        </th>
        <th>მიზანი <span class="cursor-pointer" v-text="caret('purpose')"
                         @click="sortBy = 'purpose'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/></th>
        <th>აღწერა <span class="cursor-pointer" v-text="caret('description')"
                         @click="sortBy = 'description'; sortDir = (sortDir === 'DESC' ? 'ASC' : 'DESC')"/></th>
        <th></th>
      </tr>
      </thead>
      <tbody v-if="records && records.length > 0">
      <tr v-for="(extraction, index) in records" :key="index">
        <td v-text="extraction.orderN"/>
        <td v-text="extraction.region"/>
        <td v-text="extraction.serviceCenter"/>
        <td v-text="extraction.projectID"/>
        <td v-text="extraction.withdrawType"/>
        <td v-text="extraction.clarificationDate"/>
        <td v-text="extraction.changeDate"/>
        <th v-text="extraction.extractionTask.fileName"/>
        <td v-text="extraction.transferDate"/>
        <td v-text="extraction.note"/>
        <td v-text="extraction.extractionDate"/>
        <td v-text="extraction.totalAmount"/>
        <td v-text="extraction.purpose"/>
        <td v-text="extraction.description"/>
        <td><img src="/src/assets/edit.svg" alt="edit icon" class="cursor-pointer max-w-8"
                 onclick="my_modal_1.showModal()"
                 @click="handleEditClick(extraction)"/>
        </td>
      </tr>
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
  </div>

  <div class="join justify-center w-full mt-5">
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

  <dialog id="my_modal_1" class="modal" v-if="extractionFee">
    <div class="modal-box max-w-[52.5vw] flex flex-col gap-y-3 text-sm">
      <div class="flex flex-row gap-x-6">
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
            <label class="font-semibold text-gray-600">გადარიხვის ტიპი</label>
            <input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
                   v-model="extractionFee.withdrawType"/>
          </div>
          <div class="flex flex-col gap-y-2">
            <label class="font-semibold text-gray-600">შენიშვნა</label>
            <textarea v-if="extractionFee"
                      class="textarea textarea-bordered textarea-xs w-full max-w-xs focus:outline-0 resize-none"
                      v-model="extractionFee.note"></textarea>
          </div>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col justify-between gap-y-2">
          <div class="flex gap-x-2">
            <label class="font-semibold text-gray-600">გარკვევის თარიღი</label>
            <div v-text="extractionFee.clarificationDate"/>
          </div>
          <div class="flex gap-x-2">
            <label class="font-semibold text-gray-600">ბოლო ცვლილება</label>
            <div v-text="extractionFee.changeDate"/>
          </div>
          <div class="flex gap-x-2">
            <label class="font-semibold text-gray-600">ფაილი</label>
            <div v-text="extractionFee.extractionTask.fileName"/>
          </div>
          <div class="flex gap-x-2">
            <label class="font-semibold text-gray-600">გადმოტანის თარიღი</label>
            <div v-text="extractionFee.transferDate"/>
          </div>
          <div class="flex gap-x-2">
            <label class="font-semibold text-gray-600">ატვირთვის თარიღი</label>
            <div v-text="extractionFee.extractionDate"/>
          </div>
          <div class="flex gap-x-2">
            <label class="font-semibold text-gray-600">სრული თანხა</label>
            <div v-text="extractionFee.totalAmount"/>
          </div>
          <div class="flex gap-x-2">
            <label class="font-semibold text-gray-600">მიზანი</label>
            <div v-text="extractionFee.purpose"/>
          </div>
          <div class="flex gap-x-2">
            <label class="font-semibold text-gray-600">აღწერა</label>
            <div v-text="extractionFee.description"/>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center mt-4">
        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-neutral" @click="handleSaveClick">შენახვა</button>
          </form>

          <form method="dialog">
            <button class="btn">გაუქმება</button>
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
</template>