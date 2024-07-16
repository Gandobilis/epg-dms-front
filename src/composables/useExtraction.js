import axios from "../interceptors/axios"
import {ref} from "vue"

export default function useExtraction() {
    const extractions = ref([])
    const extractionPage = ref(1)
    const extractionSize = ref(10)
    const currentFileId = ref()
    const totalPages = ref()
    const file = ref()
    // const extractionsOk = ref()
    // const extractionsWarning = ref()

    const getExtractions = async (sheetId) => {
        try {
            const response = await axios.get(`excels/getExtractionsByFile?page=${extractionPage.value}&size=${extractionSize.value}&fileId=${sheetId}`)
            extractions.value = response.data.data.content
            totalPages.value = response.data.data.page.totalPages
        } catch (error) {
            console.error("Error fetching extractions:", error)
        }
    }

    const sheets = ref([])
    const sheetPage = ref(0)
    const sheetSize = ref(100)

    const getSheets = async () => {
        try {
            const response = await axios.get(`extraction-task/all-upls?page=${sheetPage.value}&size=${sheetSize.value}`)
            sheets.value = response.data.data.content
        } catch (error) {
            console.error("Error fetching sheets:", error)
        }
    }

    const uploadFile = async () => {
        await axios.post('excels/upload', {
            file: file.value
        }, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        await getSheets()
    }

    return {
        extractions,
        getExtractions,
        sheets,
        getSheets,
        extractionPage,
        currentFileId,
        totalPages,
        file,
        uploadFile
        // extractionsOk,
        // extractionsWarning
    }
}
