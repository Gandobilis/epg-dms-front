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
    <tr>
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
      <td v-text="extraction.changeDate?.split('.')[0].replace('T', ' ')"/>
      <td v-text="extraction.note"/>
      <td v-text="extraction.transferDate?.split('.')[0].replace('T', ' ')"/>
      <td v-text="extraction.extractionDate"/>
      <td v-text="extraction.totalAmount"/>
      <td v-text="extraction.tax"/>
      <td v-text="extraction.purpose"/>
      <td v-text="extraction.description"/>
      <td title="შეცვლა">
        <img src="/src/assets/edit.svg" alt="edit icon" class="cursor-pointer max-w-8"
             @click="emit('handleEditClick', extraction)"/>
      </td>
      <td title="გაყოფა">
        <img src="/src/assets/divide.svg" alt="divide icon" @click="emit('handleDivideClick', extraction.id)"
             class="cursor-pointer max-w-8"/>
      </td>
    </tr>
    <RecursiveRow @handleDivideClick="emit('handleDivideClick', $event)"
                  @handleEditClick="emit('handleEditClick', $event)"
                  v-if="extraction.children && extraction.children.length > 0 && extraction.show"
                  :records="extraction.children" :level="level + 1"/>
  </template>
</template>
