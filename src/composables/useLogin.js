// Import necessary functions and modules from Vue
import {computed, ref} from 'vue';
// Import the useAuthStore function from authentication store
import {useAuthStore} from '/src/stores/auth';
// Import the useRouter function from Vue Router
import {useRouter} from 'vue-router';

export default function useLogin() {
    // Initialize the router
    const router = useRouter();
    // Initialize the auth store
    const authStore = useAuthStore();

    // Reactive references for email, password, and error message
    const email = ref('');
    const password = ref('');
    const error = ref('');

    // Computed property to validate the email format
    const isValidEmail = computed(() => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value));
    // Computed property to check if the password is empty
    const isPasswordEmpty = computed(() => !password.value);

    // Computed property to check if there are any errors (invalid email or empty password)
    const hasErrors = computed(() => !isValidEmail.value || isPasswordEmpty.value);

    // Async function to handle the login process
    const login = async () => {
        // Clear any previous error messages
        error.value = '';

        // If there are errors, set the appropriate error message and return
        if (hasErrors.value) {
            error.value = isValidEmail.value ? 'შეიყვანეთ პაროლი!' : 'შეიყვანეთ ვალიდური ემაილი!';
            return;
        }

        try {
            // Attempt to log in using the auth store
            await authStore.login(email.value, password.value);
            // Navigate to the Transactions page upon successful login
            await router.push({name: 'Transactions'});
        } catch (requestError) {
            // Set the error message based on the response or a default error message
            error.value = requestError.response?.data?.error || 'წარმოიშვა გაუთვალისწინებელი შეცდომა!';
        }
    };

    // Return the references and the login function to be used in the component
    return {
        email,
        password,
        error,
        login,
    };
}
