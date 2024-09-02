<script setup>
import {onMounted, ref} from "vue";
import useSheets from "../composables/useSheets.js";

const {records, getFees} = useSheets()
const records1 = ref()
onMounted(async () => {
  await getFees();
  records1.value = records.value.filter(rec => rec.status)
})

import useCenters from "../composables/useCenters.js";

const {
  getRegionsByParentId,
  regions,
  serviceCenters,
  orderN,
  region,
  serviceCenter,
  projectID,
  withdrawType,
  updateRecord,
  extractionFee
} = useCenters()


onMounted(async () => {
  await getRegionsByParentId()
})
</script>

<template>
  <div class="flex justify-between">
    <div class="flex gap-x-5">
      <router-link class="btn btn-sm" to="/">ატვირთულები</router-link>
      <router-link class="btn  btn-neutral btn-sm" to="/records">შენახულები</router-link>
    </div>

    <div class="flex gap-x-5">
      <button class="btn btn-sm" @click="records1 = records.filter(rec => !rec.status)">შევსებული</button>
      <button class="btn btn-neutral btn-sm" @click="records1 = records.filter(rec => rec.status)">შესავსები</button>
    </div>
  </div>

  <table class="table table-xs">
    <thead>
    <tr>
      <th>ორდერის ნომერი</th>
      <th>რეგიონი</th>
      <th>სერვისცენტრი</th>
      <th>პროექტის Id</th>
      <th>გადარიხვის ტიპი</th>
      <th>გარკვევის თარიღი</th>
      <th>ბოლო ცვლილება</th>
      <th>ფაილი</th>
      <th>გადმოტანის თარიღი</th>
      <th>შენიშვნა</th>
      <th>ატვირთვის თარიღი</th>
      <th>სრული თანხა</th>
      <th>მიზანი</th>
      <th>აღწერა</th>
      <th></th>
    </tr>
    </thead>
    <tbody v-if="records1 && records1.length > 0">
    <tr v-for="(extraction, index) in records1" :key="index">
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
      <td><img src="/src/assets/edit.svg" alt="edit icon" class="cursor-pointer" onclick="my_modal_1.showModal()"
               @click="extractionFee = extraction"/></td>
    </tr>
    </tbody>

    <tbody v-else-if="records1 && records1.length === 0">
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

  <dialog id="my_modal_1" class="modal">
    <div class="modal-box max-w-[95vw]">
      <table class="table table-xs">
        <thead>
        <tr>
          <th>ორდერის ნომერი</th>
          <th>რეგიონი</th>
          <th>სერვისცენტრი</th>
          <th>პროექტის Id</th>
          <th>გადარიხვის ტიპი</th>
          <th>გარკვევის თარიღი</th>
          <th>ბოლო ცვლილება</th>
          <th>ფაილი</th>
          <th>გადმოტანის თარიღი</th>
          <th>შენიშვნა</th>
          <th>ატვირთვის თარიღი</th>
          <th>სრული თანხა</th>
          <th>მიზანი</th>
          <th>აღწერა</th>
        </tr>
        </thead>
        <tbody v-if="extractionFee">
        <tr>
          <td><input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
                     v-model="orderN"/></td>
          <td><select class="select select-bordered select-sm w-full max-w-xs focus:outline-0" v-model="region"
                      @change="(event) => getRegionsByParentId(Number(event.target.selectedOptions[0].getAttribute('data-id')))">
            <option disabled selected>აირჩიეთ რეგიონი</option>
            <option :value="region.name" v-for="(region, index) in regions" v-text="region.name" :key="index"
                    :data-id="region.id"/>
          </select></td>
          <td><select class="select select-bordered select-sm w-full max-w-xs focus:outline-0" v-model="serviceCenter">
            <option disabled selected>აირჩიეთ სერვისცენტრი</option>
            <option :value="center.name" v-for="(center, index) in serviceCenters" v-text="center.name" :key="index"/>
          </select>
          </td>
          <td><input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
                     v-model="projectID"/></td>
          <td><input type="text" class="input input-bordered w-full max-w-xs input-sm focus:outline-0"
                     v-model="withdrawType"/></td>
          <td v-text="extractionFee.clarificationDate"/>
          <td v-text="extractionFee.changeDate"/>
          <th v-text="extractionFee.extractionTask.fileName"/>
          <td v-text="extractionFee.transferDate"/>
          <td v-text="extractionFee.note"/>
          <td v-text="extractionFee.extractionDate"/>
          <td v-text="extractionFee.totalAmount"/>
          <td v-text="extractionFee.purpose"/>
          <td v-text="extractionFee.description"/>
        </tr>
        </tbody>
      </table>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-neutral" @click="updateRecord(); getFees()">შენახვა</button>
        </form>

        <form method="dialog">
          <button class="btn">გაუქმება</button>
        </form>
      </div>
    </div>
  </dialog>
</template>