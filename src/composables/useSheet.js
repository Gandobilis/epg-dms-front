import {ref} from "vue";
import axios from "/src/interceptors/axios";

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

    const fetchSheetData = async () => {
        try {
            const response = await axios.get(`excels/getExtractionsByFile`, {
                params: {
                    page: _currentPage.value,
                    size: pageSize.value,
                    fileId: recordId.value,
                },
            });
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

    const fetchSheetDataWarnings = async () => {
        try {
            const response = await axios.get(`excels/getWarningExtractionsByFile`, {
                params: {
                    page: _currentPage.value,
                    size: pageSize.value,
                    fileId: recordId.value,
                },
            });
            sheet.value = response.data.data.content;
            _totalPages.value = response.data.data.page.totalPages;
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
        fetchSheetData,
        fetchSheetDataWarnings
    };
}
