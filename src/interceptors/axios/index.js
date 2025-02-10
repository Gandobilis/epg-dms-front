import axios from "axios";
import {useAuthStore} from "/src/stores/auth";
import {useNotificationStore} from '/src/stores/notification.js';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true
    }
});

axiosInstance.interceptors.request.use(config => {
    const authStore = useAuthStore();

    if (config.requiresAuth && authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }


    return config;
}, error => {
    return Promise.reject(error);
});

const allowedEndpoints = [];

axiosInstance.interceptors.response.use(
    (response) => {
        const notification = useNotificationStore();

        if (allowedEndpoints.includes(response.config.url)) {
            notification.showSuccess('წარმატებული ოპერაცია!');
        }

        return response;
    },
    (error) => {
        const notification = useNotificationStore();

        if (allowedEndpoints.includes(error.config?.url)) {
            notification.showError('დაფიქსირდა შეცდომა!');
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;
