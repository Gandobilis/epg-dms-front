<script setup>

defineProps({
  records: {
    type: Array,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['handleEditClick', 'handleDivideClick'])
</script>

<template>
  <template v-for="extraction in records" :key="extraction.id">
    <tr class="cursor-pointer" :class="{'bg-gray-300': extraction.children.length > 0, 'hover:bg-gray-100': extraction.children.length <= 0}">
      <td>
        <div :style="{ marginLeft: `${level * 10 + (level !== 0 && extraction.children.length === 0 ? 20 : 0)}px` }"
             class="flex items-center gap-x-1.5"><img
            v-if="extraction.children && extraction.children.length > 0"
            src="/src/assets/caret-right-thin.svg"
            alt="divide icon" :class="{'rotate-90': extraction.show}"
            class="cursor-pointer max-w-4 rounded-full border"
            @click="extraction.show = !extraction.show"/>
          <div v-else-if="level !== 0" class="w-1 aspect-square rounded-full bg-black"/>
          <p v-text="extraction.id"/></div>
      </td>
      <td v-text="extraction.orderN"/>
      <td v-text="extraction.region"/>
      <td v-text="extraction.serviceCenter"/>
      <td v-text="extraction.projectID"/>
      <td v-text="extraction.withdrawType"/>
      <td v-text="extraction.clarificationDate?.split('.')[0].replace('T', ' ')"/>
      <td>
        <p v-text="extraction.changeDate?.split('.')[0].replace('T', ' ')" />
        <p class="text-neutral underline font-bold" v-if="extraction.changeDate" v-text="`${extraction.changePearson.firstName} ${extraction.changePearson.lastName}`"/>
      </td>
      <td v-text="extraction.note"/>
      <td>
        <p v-text="extraction.transferDate?.split('.')[0].replace('T', ' ')" />
        <p class="text-neutral underline font-bold" v-text="`${extraction.transferPearson.firstName} ${extraction.transferPearson.lastName}`"/>
      </td>
      <td v-text="extraction.extractionDate"/>
      <td v-text="extraction.totalAmount"/>
      <td v-text="extraction.tax"/>
      <td v-text="extraction.purpose"/>
      <td v-text="extraction.description"/>
      <td title="შეცვლა">
        <button @click="emit('handleEditClick', extraction)" :class="{'cursor-not-allowed': extraction.children.length > 0}" :disabled="extraction.children.length > 0">
        <img src="/src/assets/edit.svg" alt="edit icon" class="max-w-8"/></button>
      </td>
      <td title="გაყოფა">
        <button @click="emit('handleDivideClick', [extraction.id, extraction.remainder])" :class="{'cursor-not-allowed': extraction.children.length > 0}" :disabled="extraction.children.length > 0">
        <img src="/src/assets/divide.svg" alt="divide icon" class="max-w-8"/></button>
      </td>
    </tr>
    <RecursiveRow @handleDivideClick="emit('handleDivideClick', $event)"
                  @handleEditClick="emit('handleEditClick', $event)"
                  v-if="extraction.children && extraction.children.length > 0 && extraction.show"
                  :records="extraction.children" :level="level + 1"/>
  </template>
</template>
