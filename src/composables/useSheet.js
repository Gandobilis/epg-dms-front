import { ref } from "vue";
import axios from "/src/interceptors/axios";

export default function useSheet() {
  const sheet = ref([]); // Reactive reference for sheet data
  const currentPage = ref(1); // Current page number
  const pageSize = ref(10); // Number of items per page
  const recordId = ref(null); // Optional record ID for filtering
  const totalPages = ref(0); // Total number of pages

  // Function to fetch sheet data from the server
  const fetchSheetData = async () => {
    try {
      const response = await axios.get(`excels/upload`, {
        params: {
          page: currentPage.value,
          size: pageSize.value,
          fileId: recordId.value,
        },
      });
      sheet.value = response.data.data.content;
      totalPages.value = response.data.data.page.pages;
    } catch (error) {
      console.error("Error fetching sheet data:", error);
    }
  };

  // Return reactive references and fetch function
  return {
    sheet,
    currentPage,
    pageSize,
    recordId,
    totalPages,
    fetchSheetData,
  };
}
