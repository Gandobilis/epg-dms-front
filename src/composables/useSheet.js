import {ref, watch} from "vue";
import axios from "/src/interceptors/axios";

export default function useSheet() {
    const sheet = ref();
    const _currentPage = ref(1);
    const pageSize = ref(10);
    const recordId = ref();
    const _totalPages = ref(1);
    const details = ref({
        ok: undefined,
        warning: undefined,
        total: undefined,
        amount: undefined
    })

    const filter = ref({
        startDate: undefined,
        endDate: undefined,
        totalAmountStart: undefined,
        totalAmountEnd: undefined,
        status: undefined,
    })

    const clearFilter = () => {
        filter.value = {
            startDate: undefined,
            endDate: undefined,
            totalAmountStart: undefined,
            totalAmountEnd: undefined,
            status: undefined,
        };
    }

    watch(filter, async () => {
        await fetchSheetData();
    }, {deep: true});


    const fetchSheetData = async () => {
        sheet.value = undefined
        const params = {
            page: _currentPage.value,
            size: pageSize.value,
            fileId: recordId.value,
        };

        Object.entries(filter.value)
            .filter(([_, value]) => value)
            .reduce((_, [key, value]) => {
                params[key] = value;
            }, {});

        try {
            const response = await axios.get('excels/filter', {params: params});
            sheet.value = response.data.excPage.content;
            _totalPages.value = response.data.excPage.page.totalPages;
            details.value.ok = response.data.ok;
            details.value.warning = response.data.warn;
            details.value.total = response.data.excPage.page.totalElements;
            details.value.amount = response.data.totalAmountSum;
        } catch (error) {
            console.error("Error fetching sheet data:", error);
        }
    };

    return {
        sheet,
        _currentPage,
        recordId,
        _totalPages,
        details,
        fetchSheetData,
        filter,
        clearFilter
    };
}
