import {defineStore} from 'pinia';
import {ref} from 'vue';
import axios from "/src/interceptors/axios/index.js";
import cookies from "vue-cookies";

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const token = ref(null);
    const isAuthenticated = ref(false);

    const login = async (email, password) => {
        try {
            const response = await axios.post('auth/signin', {email, password});
            token.value = response.data.jwtAuthenticationResponse.token;
            user.value = response.data.user;
            isAuthenticated.value = true;

            cookies.set('auth_token', token.value);

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

        cookies.remove('auth_token');

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

    return {
        user,
        token,
        isAuthenticated,
        login,
        logout,
        restoreSession,
    };
});
