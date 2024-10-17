import axios from "axios";
import {useAuthStore} from '/src/stores/auth';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "any" // წასაშლელია
    }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(config => {
    const authStore = useAuthStore(); // Access Pinia store

    // If the request requires authentication, add the Authorization header
    if (config.requiresAuth && authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }

    return config;
}, error => {
    // Handle error
    return Promise.reject(error);
});

export default axiosInstance;