import {ref} from "vue";
import axios from "../interceptors/axios";

export default function useSheets() {
    const sheets = ref([{ id: 1, fileName: "document1.pdf", date: "2023-05-10", status: 1 },
        { id: 2, fileName: "image1.png", date: "2023-05-12",  status: 0 },
        { id: 3, fileName: "spreadsheet1.xlsx", date: "2023-05-14",  status: 0 },
        { id: 4, fileName: "presentation1.pptx", date: "2023-05-16",  status: 1 },
        { id: 5, fileName: "notes.txt", date: "2023-05-18", status: 1 }]);
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
