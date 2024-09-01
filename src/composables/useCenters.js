import {ref} from "vue";
import axios from "/src/interceptors/axios";

export default function useCenters() {
    const regions = ref();
    const serviceCenters = ref();
    const region = ref("აირჩიეთ რეგიონი");
    const serviceCenter = ref("აირჩიეთ სერვისცენტრი");

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

    return {getRegionsByParentId, regions, serviceCenters, region, serviceCenter};
}
