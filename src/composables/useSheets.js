import {ref} from "vue";
import axios from "../interceptors/axios";

export default function useSheets() {
    const sheets = ref([]);
    const currentPage = ref(0);
    const pageSize = ref(100);
    const selectedSheet = ref(null);
    const lastResponse = ref(null);

    const fetchSheets = async () => {
        try {
            lastResponse.value = await axios.get(`extraction-task/all-upls`, {
                params: {
                    page: currentPage.value,
                    size: pageSize.value,
                },
            });
            sheets.value = lastResponse.value.data.data.content;
        } catch (error) {
            console.error("Error fetching sheets:", error);
        }
    };

    const createSheet = async () => {
        try {
            const formData = new FormData();
            formData.append("file", selectedSheet.value);

            await axios.post("excels/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await fetchSheets();
        } catch (error) {
            console.error("Error creating sheet:", error);
        }
    };

    return {
        sheets,
        currentPage,
        pageSize,
        selectedSheet,
        lastResponse,
        fetchSheets,
        createSheet,
    };
}
