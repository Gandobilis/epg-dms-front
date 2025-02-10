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

const allowedEndpoints = [
    {
        endpoint: "user",
        method: "get",
        messages: {
            error: "მომხმარებლის მონაცემების ჩატვირთვა ვერ მოხერხდა.",
        },
    },
    {
        endpoint: "auth/signup",
        method: "post",
        messages: {
            success: "მომხმარებლი შეიქმნა წარმატებით.",
            error: "მომხმარებლის შექმნისას მოხდა შეცდომა.",
        }
    },
    {
        endpoint: "user",
        method: "delete",
        messages: {
            success: "მომხმარებლი წაიშალა წარმატებით.",
            error: "მომხმარებლის წაშლისას მოხდა შეცდომა.",
        }
    },
    {
        endpoint: "user",
        method: "put",
        messages: {
            success: "მომხმარებლი განახლდა წარმატებით.",
            error: "მომხმარებლის განახლებისას მოხდა შეცდომა.",
        }
    },
];

axiosInstance.interceptors.response.use(
    (response) => {
        const notification = useNotificationStore();


        const matchedEndpoint = allowedEndpoints.find(
            (endpoint) =>
                endpoint.endpoint === extractBaseEndpoint(response.config.url) &&
                endpoint.method === response.config.method
        );

        if (matchedEndpoint && matchedEndpoint.messages.success) {
            notification.showSuccess(matchedEndpoint.messages.success);
        }

        return response;
    },
    (error) => {
        const notification = useNotificationStore();

        const matchedEndpoint = allowedEndpoints.find(
            (endpoint) =>
                endpoint.endpoint === extractBaseEndpoint(error.config?.url) &&
                endpoint.method === error.config?.method
        );

        if (matchedEndpoint && matchedEndpoint.messages.error) {
            notification.showError(matchedEndpoint.messages.error);
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;
