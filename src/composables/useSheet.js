import {ref} from "vue";
import axios from "/src/interceptors/axios";
import cookies from "vue-cookies";

export default function useSheet() {
    const sheet = ref();
    const _currentPage = ref(1);
    const pageSize = ref(10);
    const recordId = ref();
    const _totalPages = ref(1);
    const ok = ref()
    const warning = ref()
    const total = ref()
    const amount = ref()
    const status = ref()
    const filter_amount = ref()
    const startDate = ref()
    const endDate = ref()

    const fetchSheetData = async () => {
        sheet.value = undefined
        let url;
        const params = {
            page: _currentPage.value,
            size: pageSize.value,
            fileId: recordId.value,
        };

        if (startDate.value && endDate.value) {
            url = 'excels/getByDate'
            params.startDate = startDate.value
            params.endDate = endDate.value
        } else {
            if (filter_amount.value) {
                if (status.value) {
                    url = 'excels/getByAmountAndStatus'
                    params.amount = filter_amount.value
                    params.status = status.value === 'ok' ? 1 : 0;
                } else {
                    url = 'excels/getByAmount'
                    params.amount = filter_amount.value
                }
            } else {
                if (status.value === 'ok') {
                    url = 'excels/getOkExtractionsByFile';
                } else if (status.value === 'warn') {
                    url = 'excels/getWarningExtractionsByFile';
                } else {
                    url = 'excels/getExtractionsByFile'
                }
            }
        }

        try {
            const response = await axios.get(url);
            sheet.value = response.data.data.content;
            _totalPages.value = response.data.data.page.totalPages;
            ok.value = response.data.ok;
            warning.value = response.data.warn;
            total.value = response.data.countAll;
            amount.value = response.data.grandTotal;
        } catch (error) {
            console.error("Error fetching sheet data:", error);
        }
    };


    return {
        sheet,
        _currentPage,
        recordId,
        _totalPages,
        ok,
        warning,
        total,
        amount,
        status,
        filter_amount,
        startDate,
        endDate,
        fetchSheetData
    };
}
