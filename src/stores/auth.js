import {defineStore} from 'pinia';
import {ref} from 'vue';
import axios from "/src/interceptors/axios/index.js";
import cookies from "vue-cookies";

export const useAuthStore = defineStore('auth', () => {
    const filesRoles = ['ROLE_MANAGER', 'ROLE_ADMIN']
    const transactionsRoles = ['ROLE_GUEST', 'ROLE_OPERATOR', 'ROLE_MANAGER', 'ROLE_ADMIN']
    const usersRoles = ['ROLE_ADMIN']
    const fileExportRoles = ['ROLE_GUEST', 'ROLE_OPERATOR', 'ROLE_MANAGER', 'ROLE_ADMIN']

    const user = ref();
    const token = ref();
    const isAuthenticated = ref(false);

    const login = async (email, password) => {

        const {data} = await axios.post('auth/signin', {email, password});
        token.value = data.jwtAuthenticationResponse.token;
        user.value = data.user;
        isAuthenticated.value = true;

        cookies.set('auth_token', token.value);

        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    };

    const logout = async () => {
        await axios.post('auth/logout');
        token.value = undefined;
        user.value = undefined;
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
        filesRoles,
        transactionsRoles,
        usersRoles,
        fileExportRoles,
        user,
        token,
        isAuthenticated,
        login,
        logout,
        restoreSession,
    };
});
