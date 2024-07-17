import { ref } from 'vue'
import axios from '/src/interceptors/axios'

export default function useSheets() {
    const sheets = ref([])         // Reactive reference for sheet data
    const currentPage = ref(0)     // Current page number for fetching sheets
    const pageSize = ref(100)      // Number of sheets per page
    const selectedSheet = ref(null) // Selected sheet to be uploaded
    const lastResponse = ref(null) // Last response from server

    // Function to fetch sheets from the server
    const fetchSheets = async () => {
        try {
            lastResponse.value = await axios.get(`extraction-task/all-upls`, {
                params: {
                    page: currentPage.value,
                    size: pageSize.value
                }
            })
            sheets.value = lastResponse.value.data.data.content
        } catch (error) {
            console.error('Error fetching sheets:', error)
            throw error // Re-throw the error to propagate it if needed
        }
    }

    // Function to create a new sheet
    const createSheet = async () => {
        try {
            const formData = new FormData()
            formData.append('file', selectedSheet.value)

            await axios.post('excels/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            await fetchSheets() // Update sheets after creation
        } catch (error) {
            console.error('Error creating sheet:', error)
            throw error // Re-throw the error to propagate it if needed
        }
    }

    // Return reactive references and functions for use
    return {
        sheets,
        currentPage,
        pageSize,
        selectedSheet,
        lastResponse,
        fetchSheets,
        createSheet
    }
}
