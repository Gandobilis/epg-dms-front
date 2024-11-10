import {ref, watch} from "vue";
import axios from "/src/interceptors/axios";

export default function useFiles() {
    const files = ref();
    const selectedSheet = ref();
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalPages = ref();
    const totalElements = ref();
    const transactions = ref();

    watch(currentPage, async (value) => {
            if (value > totalPages) {
                currentPage.value = totalPages.value;
            }
            if (value) {
                await fetchSheets();
            }
        }
    )

    watch(pageSize, async () => {
        currentPage.value = 1;
        await fetchSheets();
    })

    const fetchSheets = async () => {
        try {
            files.value = undefined;
            const lastResponse = await axios.get(`extraction-task/all-upls`, {
                params: {
                    page: currentPage.value,
                    size: pageSize.value,
                }
            });
            files.value = lastResponse.data.data.content;
            totalPages.value = lastResponse.data.data.page.totalPages;
            totalElements.value = lastResponse.data.data.page.totalElements;
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const createSheet = async () => {
        try {
            const formData = new FormData();
            formData.append("file", selectedSheet.value);

            await axios.post("excels/upload", formData, {
                requiresAuth: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            await fetchSheets();
        } catch (error) {
            console.error("Error creating sheet:", error);
        }
    };

    const deleteSheet = async (sheetId) => {
        try {
            await axios.delete(`connection-fees/delete-by-task/${sheetId}`, {
                requiresAuth: true
            });
            await fetchSheets();
        } catch (error) {
            console.error("Error deleting files:", error);
        }
    };

    const saveSheet = async (sheetId) => {
        try {
            await axios.post(`connection-fees/${sheetId}`, {}, {
                requiresAuth: true
            });
            await fetchSheets();
        } catch (error) {
            console.error("Error deleting files:", error);
        }
    };

    return {
        files,
        currentPage,
        pageSize,
        totalPages,
        totalElements,
        selectedSheet,
        fetchSheets,
        createSheet,
        deleteSheet,
        saveSheet,
        transactions,
    };
}