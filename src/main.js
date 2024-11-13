import {createApp} from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import {createPinia} from 'pinia';
import {useAuthStore} from "./stores/auth.js";

const initializeApp = async () => {
    const app = createApp(App);
    const pinia = createPinia();
    app.use(pinia);

    const authStore = useAuthStore();
    try {
        // Restore session before mounting the app
        await authStore.restoreSession();
    } catch (error) {
        console.error("Error restoring session:", error);
    }

    // Use router after session is restored
    app.use(router);
    app.mount('#app');
};

// Initialize the app
initializeApp();
