import {ref} from "vue";
import axios from "/src/interceptors/axios";

export default function useCenters() {
    const regions = ref();
    const _regions = ref();
    const serviceCenters = ref();
    const _serviceCenters = ref()
    const extractionFee = ref({
            orderN: '',                 // For the order number input field
            region: '',                 // For the selected region
            serviceCenter: '',          // For the selected service center
            projectID: '',              // For the project ID input field
            withdrawType: '',           // For the withdrawal type input field
            note: '',                   // For the note textarea
            clarificationDate: '',     // For the clarification date display
            changeDate: '',            // For the last change date display
            transferDate: '',          // For the transfer date display
            extractionDate: '',        // For the extraction date display
            totalAmount: '',           // For the total amount display
            purpose: '',               // For the purpose display
            description: ''
        }
    )

    const handleEditClick = async (extraction) => {
        extractionFee.value = {...extraction};
        document.getElementById('my_modal_1').showModal();
        if (!extractionFee.value.region) {
            extractionFee.value.region = 'აირჩიეთ რეგიონი';
        } else {
            await getRegionsByParentId(regions.value.find(reg => reg.name === extraction.region).id)
        }

        if (!extractionFee.value.serviceCenter) {
            extractionFee.value.serviceCenter = 'აირჩიეთ სერვისცენტრი';
        }

        if (!extractionFee.value.withdrawType) {
            extractionFee.value.withdrawType = 'აირჩიეთ გადარიცხვის ტიპი';
        }
    }

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


    const deleteRecord = async () => {
        try {
            await axios.delete(`connection-fees/soft-delete/${extractionFee.value.id}`);
            extractionFee.value = undefined;
        } catch (error) {
            console.log(error)
        }
    }


    return {
        getRegionsByParentId,
        regions,
        _regions,
        serviceCenters,
        _serviceCenters,
        updateRecord,
        extractionFee,
        handleEditClick,
        deleteRecord
    };
}
