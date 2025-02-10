import {ref} from 'vue';
import {useAuthStore} from '/src/stores/auth';
import {useRouter} from 'vue-router';

export default function useLogin() {
    const router = useRouter();
    const authStore = useAuthStore();

    const email = ref('');
    const password = ref('');
    const error = ref('');

    const login = async () => {
        error.value = '';

        try {
            await authStore.login(email.value, password.value);
            await router.push({name: 'Transactions'});
        } catch (error) {
            error.value = error.response?.data?.error || 'წარმოიშვა გაუთვალისწინებელი შეცდომა!';
        }
    };

    return {
        email,
        password,
        error,
        login
    };
}
