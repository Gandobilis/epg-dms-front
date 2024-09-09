import {ref} from "vue";
import axios from "../interceptors/axios";

export default function useSheets() {
    const sheets = ref();
    const currentPage = ref(1);
    const pageSize = ref(10);
    const selectedSheet = ref();
    const lastResponse = ref();
    const totalPages = ref(1);
    const records = ref()

    const fetchSheets = async () => {
        try {
            lastResponse.value = await axios.get(`extraction-task/all-upls`, {
                params: {
                    page: currentPage.value,
                    size: pageSize.value,
                },
            });
            sheets.value = lastResponse.value.data.data.content;
            totalPages.value = lastResponse.value.data.data.page.totalPages;
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

    const deleteSheet = async (sheetId) => {
        try {
            await axios.delete(`excels/delete`, {
                params: {
                    taskId: sheetId,
                },
            });
            await fetchSheets();
        } catch (error) {
            console.error("Error deleting sheets:", error);
        }
    };

    const saveSheet = async (sheetId) => {
        try {
            await axios.post(`connection-fees/${sheetId}`);
            await fetchSheets();
        } catch (error) {
            console.error("Error deleting sheets:", error);
        }
    };

    const getFees = async () => {
        try {
            lastResponse.value = await axios.get(`connection-fees`, {
                params: {
                    page: currentPage.value,
                    size: pageSize.value,
                },
            });
            records.value = lastResponse.value.data.data.content;
            totalPages.value = lastResponse.value.data.data.page.totalElements;
        } catch (error) {
            console.error("Error fetching sheets:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const months = [
            "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
            "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"
        ];

        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year} წლის ${day} ${month}, ${hours}:${minutes}:${seconds}`;
    }

    return {
        sheets,
        currentPage,
        pageSize,
        totalPages,
        selectedSheet,
        lastResponse,
        fetchSheets,
        createSheet,
        formatDate,
        deleteSheet,
        saveSheet,
        getFees,
        records
    };
}
