<script setup>
import Sheets from "../components/Sheets.vue";
//
// import useCenters from "../composables/useCenters.js";
// import {onMounted} from "vue";
//
// const {getRegionsByParentId, setCenter, regions, serviceCenters, region, serviceCenter} = useCenters()
//
// onMounted(async () => {
//   await getRegionsByParentId()
// })
</script>

<template>
<!--  <select class="select select-bordered select-sm w-full max-w-xs focus:outline-0" v-model="region"-->
<!--          @change="(event) => getRegionsByParentId(Number(event.target.selectedOptions[0].getAttribute('data-id')))">-->
<!--    <option disabled selected>აირჩიეთ რეგიონი</option>-->
<!--    <option :value="region.name" v-for="(region, index) in regions" v-text="region.name" :key="index"-->
<!--            :data-id="region.id"/>-->
<!--  </select>-->
<!--  <select class="select select-bordered select-sm w-full max-w-xs focus:outline-0" v-model="serviceCenter">-->
<!--    <option disabled selected>აირჩიეთ სერვისცენტრი</option>-->
<!--    <option :value="center.name" v-for="(center, index) in serviceCenters" v-text="center.name" :key="index"/>-->
<!--  </select>-->
  <sheets/>
</template>
