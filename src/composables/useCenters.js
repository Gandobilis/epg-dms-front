import {ref} from "vue";
import axios from "/src/interceptors/axios";

export default function useCenters() {
    const regions = ref();
    const serviceCenters = ref();
    const region = ref("აირჩიეთ რეგიონი");
    const serviceCenter = ref("აირჩიეთ სერვისცენტრი");
    const orderN = ref()
    const projectID = ref()
    const withdrawType = ref()
    const extractionFee = ref()

    const getRegionsByParentId = async (parentId = 68) => {
        try {
            const {data} = await axios.get(`business-units/by-parent/${parentId}`);
            if (parentId === 68) {
                regions.value = data.data;
            } else {
                serviceCenters.value = data.data;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const updateRecord = async () => {
        try {
            const response = await axios.put(`connection-fees/${extractionFee.value.id}`, {
                "orderN": orderN.value,
                "region": region.value,
                "serviceCenter": serviceCenter.value,
                "projectID": projectID.value,
                "withdrawType": withdrawType.value,
            })
        } catch (error) {
            console.error("Error updating fee:", error);
        }
    }

    return {
        getRegionsByParentId,
        regions,
        serviceCenters,
        orderN,
        region,
        serviceCenter,
        projectID,
        withdrawType,
        updateRecord,
        extractionFee
    };
}
