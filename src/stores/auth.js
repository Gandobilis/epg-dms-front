import {defineStore} from 'pinia';
import {ref} from 'vue';
import axios from "../interceptors/axios/index.js";
import cookies from "vue-cookies";

export const useAuthStore = defineStore('auth', () => {
    // Define state
    const user = ref(null);
    const token = ref(null);
    const isAuthenticated = ref(false);

    // Define actions (functions)
    const login = async (email, password) => {
        try {
            const response = await axios.post('auth/signin', {email, password});
            token.value = response.data.jwtAuthenticationResponse.token;
            user.value = response.data.user;
            isAuthenticated.value = true;

            // Persist token in localStorage
            cookies.set('auth_token', token.value);

            // Set token in Axios headers for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        isAuthenticated.value = false;

        // Clear token from localStorage
        cookies.remove('auth_token');

        // Remove Authorization header for future requests
        delete axios.defaults.headers.common['Authorization'];
    };

    const restoreSession = async () => {
        const savedToken = cookies.get('auth_token');
        if (savedToken) {
            token.value = savedToken;
            isAuthenticated.value = true;
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
            try {
                const {data} = await axios.get('auth/user')
                user.value = data;
            } catch (error) {
                console.error('Failed to restore session:', error);
                logout();
            }
        }
    };

    // Return all the state and actions you want to expose
    return {
        user,
        token,
        isAuthenticated,
        login,
        logout,
        restoreSession,
    };
});
