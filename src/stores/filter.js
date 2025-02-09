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

        orderN: '',
        projectID: '',
        purpose: '',
        tax: '',
        description: '',

        clarificationDateStart: undefined,
        clarificationDateEnd: undefined,

        changeDateStart: undefined,
        changeDateEnd: undefined,

        transferDateStart: undefined,
        transferDateEnd: undefined,

        extractionDateStart: undefined,
        extractionDateEnd: undefined,

        note: '',
    });

    return {filter};
});

