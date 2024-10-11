import {ref} from "vue";
import {useRouter} from "vue-router";
import axios from "/src/interceptors/axios/index.js";
import cookies from "vue-cookies";

export default function useLogin() {
    const router = useRouter();
    const email = ref();
    const password = ref();
    const remember = ref(false);
    const error = ref();

    const toggleRemember = () => {
        remember.value = !remember.value;
    };

    const login = async () => {
        try {
            const {data} = await axios.post("auth/signin", {
                email: email.value,
                password: password.value
            });

            if (remember.value) {
                cookies.set("access_token", data.token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                });
            }


            await router.push("/");
        } catch (err) {
            error.value = err.response.data.error;
        }
    };

    return {email, password, remember, error, toggleRemember, login};
}