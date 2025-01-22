import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useFilterStore = defineStore('filter', () => {
    let filter = ref({
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
    });

    return {filter};
});

