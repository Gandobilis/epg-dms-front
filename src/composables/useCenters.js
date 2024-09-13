import {ref} from "vue";
import axios from "/src/interceptors/axios";

export default function useCenters() {
    const regions = ref();
    const _regions = ref();
    const serviceCenters = ref();
    const _serviceCenters = ref()
    const extractionFee = ref()

    const getRegionsByParentId = async (parentId = 68) => {
        try {
            const {data} = await axios.get(`business-units/by-parent/${parentId}`);
            if (parentId === 68) {
                regions.value = data.data;
                _regions.value = data.data
            } else {
                serviceCenters.value = data.data;
                _serviceCenters.value = data.data;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const updateRecord = async () => {
        try {
            const response = await axios.put(`connection-fees/${extractionFee.value.id}`,
                extractionFee.value
            )
            extractionFee.value = undefined;
        } catch (error) {
            console.error("Error updating fee:", error);
        }
    }

    return {
        getRegionsByParentId,
        regions,
        _regions,
        serviceCenters,
        _serviceCenters,
        updateRecord,
        extractionFee
    };
}
