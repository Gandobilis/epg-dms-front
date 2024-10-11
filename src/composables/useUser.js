import {markRaw, ref} from "vue";
import cookies from "vue-cookies";
import axios from "/src/interceptors/axios/index.js";

const useUser = () => {
    const accessToken = cookies.get('access_token');
    const userData = ref()
    const isAuthenticated = ref();

    const checkIfAuthenticated = async () => {
        try {
            await axios.get('users/check_token_validity', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            isAuthenticated.value = true

        } catch (error) {
            console.error(error);
            isAuthenticated.value = false
        }
    };

    return {
        isAuthenticated,
        checkIfAuthenticated
    };
};

export default useUser;