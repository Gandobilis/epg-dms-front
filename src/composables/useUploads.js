import {ref} from "vue";
import axios from "../interceptors/axios";

export default function useUploads() {
    const sheets = ref();
    const currentPage = ref(1);
    const pageSize = ref(17); //17
    const selectedSheet = ref();
    const lastResponse = ref();
    const totalPages = ref(1);
    const records = ref()
    const sortBy = ref("totalAmount")
    const sortDir = ref("ASC")

    const filter = ref({
        status: 'TRANSFERRED',
        orderN: undefined,
        region: "აირჩიეთ რეგიონი",
        serviceCenter: "აირჩიეთ სერვისცენტრი",
        projectID: undefined,
        withdrawType: undefined,
        clarificationDateStart: undefined,
        clarificationDateEnd: undefined,
        changeDateStart: undefined,
        changeDateEnd: undefined,
        transferDateStart: undefined,
        transferDateEnd: undefined,
        extractionDateStart: undefined,
        extractionDateEnd: undefined,
        totalAmount: undefined,
        purpose: undefined,
        note: undefined,
        description: undefined,
        file: undefined
    })

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
        records.value = undefined;
        const params = {
            page: currentPage.value,
            size: pageSize.value,
            sortBy: sortBy.value,
            sortDir: sortDir.value
        }

        const undefinedValues = ["აირჩიეთ რეგიონი", "აირჩიეთ სერვისცენტრი"];
        const filtered = Object.entries(filter.value)
            .filter(([_, value]) => value && !undefinedValues.includes(value))
            .reduce((_, [key, value]) => {
                params[key] = value;
            }, {});

        try {
            lastResponse.value = await axios.get(`connection-fees/filter`, {params});
            records.value = lastResponse.value.data.data.content;
            totalPages.value = lastResponse.value.data.data.page.totalPages;
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
        records,
        filter,
        sortBy,
        sortDir
    };
}