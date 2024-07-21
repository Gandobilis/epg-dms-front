import {ref} from "vue";
import axios from "/src/interceptors/axios";

export default function useSheet() {
    const sheet = ref();
    const _currentPage = ref(1);
    const pageSize = ref(10);
    const recordId = ref();
    const _totalPages = ref(1);

    // Function to fetch sheet data from the server
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
        } catch (error) {
            console.error("Error fetching sheet data:", error);
        }
    };

    // Function to fetch sheet data from the server
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
        fetchSheetData,
        fetchSheetDataWarnings
    };
}
